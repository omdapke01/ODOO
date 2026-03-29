const prisma = require("../config/prisma");
const { buildApprovals } = require("../services/approvalService");
const { convertToBaseCurrency } = require("../services/currencyService");
const { parseReceipt } = require("../services/ocrService");
const { createAuditLog } = require("../utils/audit");

const ApprovalDecision = { PENDING: "PENDING" };
const WorkflowStatus = { SUBMITTED: "SUBMITTED", APPROVED: "APPROVED" };

async function createExpense(req, res) {
  const { amount, currency, category, description, date } = req.body;
  const receiptUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const conversion = await convertToBaseCurrency({ amount, currency, companyId: req.user.companyId });
  let ocrData = null;
  let ocrWarning = null;

  if (req.file) {
    try {
      ocrData = await parseReceipt(req.file.path);
    } catch (_error) {
      ocrWarning = "Receipt was uploaded, but OCR could not read it. The expense was still submitted.";
    }
  }

  const expense = await prisma.expense.create({
    data: {
      userId: req.user.sub,
      companyId: req.user.companyId,
      amount,
      currency,
      convertedAmount: conversion.convertedAmount,
      category,
      description,
      date: new Date(date),
      status: WorkflowStatus.SUBMITTED,
      receiptUrl,
      merchantName: ocrData?.merchantName || null,
    },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  await buildApprovals(expense);
  await createAuditLog({
    action: "EXPENSE_SUBMITTED",
    userId: req.user.sub,
    expenseId: expense.id,
    metadata: { conversionRate: conversion.rate, ocrData, ocrWarning },
  });

  return res.status(201).json({ ...expense, ocrData, ocrWarning, conversion });
}

async function listExpenses(req, res) {
  const where = { companyId: req.user.companyId };

  if (req.user.role === "EMPLOYEE") {
    where.userId = req.user.sub;
  }

  if (req.user.role === "MANAGER") {
    const reports = await prisma.user.findMany({ where: { managerId: req.user.sub }, select: { id: true } });
    where.OR = [{ userId: req.user.sub }, { userId: { in: reports.map((item) => item.id) } }];
  }

  const expenses = await prisma.expense.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      approvals: {
        include: { approver: { select: { name: true, role: true } } },
        orderBy: [{ stepOrder: "asc" }, { approverId: "asc" }],
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(expenses);
}

async function getExpenseById(req, res) {
  const expense = await prisma.expense.findFirst({
    where: { id: req.params.id, companyId: req.user.companyId },
    include: {
      user: { select: { name: true, email: true } },
      approvals: {
        include: { approver: { select: { name: true, role: true } } },
        orderBy: [{ stepOrder: "asc" }, { approverId: "asc" }],
      },
    },
  });

  if (!expense) {
    return res.status(404).json({ message: "Expense not found." });
  }

  return res.json(expense);
}

async function getDashboard(req, res) {
  const [expenses, pendingApprovals, users] = await Promise.all([
    prisma.expense.findMany({
      where: { companyId: req.user.companyId },
      select: { convertedAmount: true, category: true, createdAt: true, status: true },
    }),
    prisma.approval.count({ where: { approverId: req.user.sub, status: ApprovalDecision.PENDING } }),
    prisma.user.count({ where: { companyId: req.user.companyId } }),
  ]);

  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.convertedAmount), 0);
  const categoryBreakdown = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + Number(item.convertedAmount);
    return acc;
  }, {});
  const monthlyTrends = expenses.reduce((acc, item) => {
    const key = new Date(item.createdAt).toISOString().slice(0, 7);
    acc[key] = (acc[key] || 0) + Number(item.convertedAmount);
    return acc;
  }, {});

  return res.json({
    totalExpenses,
    pendingApprovals,
    users,
    categoryBreakdown,
    monthlyTrends,
    approvedExpenses: expenses.filter((item) => item.status === WorkflowStatus.APPROVED).length,
  });
}

async function extractReceipt(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "Receipt file is required." });
  }

  try {
    const data = await parseReceipt(req.file.path);
    return res.json(data);
  } catch (_error) {
    return res.json({
      amount: null,
      date: null,
      merchantName: null,
      rawText: "",
      warning: "OCR could not read this receipt. You can still enter the fields manually and submit the expense.",
    });
  }
}

module.exports = { createExpense, listExpenses, getExpenseById, getDashboard, extractReceipt };
