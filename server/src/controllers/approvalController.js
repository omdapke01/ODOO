const { ApprovalDecision, WorkflowStatus } = { ApprovalDecision: { PENDING: "PENDING", APPROVED: "APPROVED", REJECTED: "REJECTED" }, WorkflowStatus: { REJECTED: "REJECTED" } };
const prisma = require("../config/prisma");
const { canCurrentApproverAct, finalizeExpenseIfReady } = require("../services/approvalService");
const { createAuditLog } = require("../utils/audit");

async function handleDecision(req, res, nextStatus) {
  const { expenseId, comments } = req.body;
  const approval = await prisma.approval.findFirst({ where: { expenseId, approverId: req.user.sub } });

  if (!approval) {
    return res.status(404).json({ message: "Approval assignment not found." });
  }

  if (approval.status !== ApprovalDecision.PENDING) {
    return res.status(400).json({ message: "Approval already processed." });
  }

  const expense = await prisma.expense.findUnique({ where: { id: expenseId } });

  if (!expense || expense.companyId !== req.user.companyId) {
    return res.status(404).json({ message: "Expense not found." });
  }

  if (approval.stepOrder > 1) {
    const canAct = await canCurrentApproverAct(approval, expenseId);
    if (!canAct) {
      return res.status(400).json({ message: "Previous approval steps are still pending." });
    }
  }

  const updated = await prisma.approval.update({
    where: { id: approval.id },
    data: { status: nextStatus, comments, actedAt: new Date() },
  });

  if (nextStatus === ApprovalDecision.REJECTED) {
    await prisma.expense.update({ where: { id: expenseId }, data: { status: WorkflowStatus.REJECTED } });
  } else {
    await finalizeExpenseIfReady(expenseId, req.user.sub);
  }

  await createAuditLog({
    action: nextStatus === ApprovalDecision.APPROVED ? "APPROVAL_APPROVED" : "APPROVAL_REJECTED",
    userId: req.user.sub,
    expenseId,
    metadata: { comments: comments || null },
  });

  return res.json(updated);
}

async function approveExpense(req, res) {
  return handleDecision(req, res, ApprovalDecision.APPROVED);
}

async function rejectExpense(req, res) {
  return handleDecision(req, res, ApprovalDecision.REJECTED);
}

module.exports = { approveExpense, rejectExpense };
