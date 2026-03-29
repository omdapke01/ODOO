const prisma = require("../config/prisma");
const { createAuditLog } = require("../utils/audit");

const ApprovalDecision = { PENDING: "PENDING", APPROVED: "APPROVED", REJECTED: "REJECTED" };
const ApprovalRuleType = { SEQUENTIAL: "SEQUENTIAL", CONDITIONAL: "CONDITIONAL", HYBRID: "HYBRID", PARALLEL: "PARALLEL" };
const UserRole = { ADMIN: "ADMIN" };
const WorkflowStatus = { APPROVED: "APPROVED", PENDING: "PENDING", REJECTED: "REJECTED" };

function inRuleRange(rule, amount) {
  const minOkay = rule.minAmount == null || Number(rule.minAmount) <= amount;
  const maxOkay = rule.maxAmount == null || Number(rule.maxAmount) >= amount;
  return minOkay && maxOkay;
}

async function resolveRule(companyId, amount) {
  const rules = await prisma.approvalRule.findMany({
    where: { companyId },
    orderBy: [{ minAmount: "asc" }, { createdAt: "asc" }],
  });

  return rules.find((rule) => inRuleRange(rule, amount)) || rules[0] || null;
}

async function resolveApprovers(user, rule) {
  const approvers = [];

  if (user.managerId) {
    const manager = await prisma.user.findUnique({ where: { id: user.managerId } });
    if (manager) approvers.push(manager);
  }

  if (rule?.specificApproverRole) {
    const specificUsers = await prisma.user.findMany({
      where: { companyId: user.companyId, role: rule.specificApproverRole },
    });
    approvers.push(...specificUsers);
  } else {
    const admins = await prisma.user.findMany({
      where: { companyId: user.companyId, role: UserRole.ADMIN },
    });
    approvers.push(...admins);
  }

  const deduped = new Map();
  approvers.forEach((approver) => deduped.set(approver.id, approver));
  deduped.delete(user.id);
  return Array.from(deduped.values());
}

async function buildApprovals(expense) {
  const user = await prisma.user.findUnique({ where: { id: expense.userId } });
  const rule = await resolveRule(expense.companyId, Number(expense.convertedAmount));
  const approvers = await resolveApprovers(user, rule);

  if (!approvers.length) {
    await prisma.expense.update({ where: { id: expense.id }, data: { status: WorkflowStatus.APPROVED } });
    return { rule, approvals: [] };
  }

  const approvals = approvers.map((approver, index) => ({
    expenseId: expense.id,
    approverId: approver.id,
    stepOrder: rule?.ruleType === ApprovalRuleType.SEQUENTIAL ? index + 1 : 1,
  }));

  await prisma.approval.createMany({ data: approvals });
  await prisma.expense.update({ where: { id: expense.id }, data: { status: WorkflowStatus.PENDING } });

  return { rule, approvals };
}

async function canCurrentApproverAct(approval, expenseId) {
  const pendingApprovals = await prisma.approval.findMany({
    where: { expenseId, status: ApprovalDecision.PENDING },
    orderBy: { stepOrder: "asc" },
  });

  const minStep = pendingApprovals[0]?.stepOrder;
  return approval.stepOrder === minStep;
}

async function finalizeExpenseIfReady(expenseId, actorId) {
  const expense = await prisma.expense.findUnique({
    where: { id: expenseId },
    include: { approvals: { include: { approver: true } } },
  });

  const rule = await resolveRule(expense.companyId, Number(expense.convertedAmount));
  const approvals = expense.approvals;
  const approved = approvals.filter((item) => item.status === ApprovalDecision.APPROVED);
  const rejected = approvals.find((item) => item.status === ApprovalDecision.REJECTED);

  if (rejected) {
    await prisma.expense.update({ where: { id: expenseId }, data: { status: WorkflowStatus.REJECTED } });
    await createAuditLog({ action: "EXPENSE_REJECTED", userId: actorId, expenseId, metadata: { ruleType: rule?.ruleType || null } });
    return WorkflowStatus.REJECTED;
  }

  const total = approvals.length || 1;
  const ratio = approved.length / total;
  const specificApproved = rule?.specificApproverRole && approvals.some((item) => item.status === ApprovalDecision.APPROVED && item.approver.role === rule.specificApproverRole);
  const allApproved = approvals.every((item) => item.status === ApprovalDecision.APPROVED);
  const thresholdMet = rule?.percentageRequired != null ? ratio >= rule.percentageRequired : false;

  let shouldApprove = false;

  switch (rule?.ruleType) {
    case ApprovalRuleType.CONDITIONAL:
      shouldApprove = thresholdMet || Boolean(specificApproved);
      break;
    case ApprovalRuleType.HYBRID:
      shouldApprove = thresholdMet && (!rule.specificApproverRole || Boolean(specificApproved));
      break;
    case ApprovalRuleType.SEQUENTIAL:
    case ApprovalRuleType.PARALLEL:
    default:
      shouldApprove = allApproved;
      break;
  }

  if (shouldApprove) {
    await prisma.expense.update({ where: { id: expenseId }, data: { status: WorkflowStatus.APPROVED } });
    await createAuditLog({ action: "EXPENSE_APPROVED", userId: actorId, expenseId, metadata: { approvedCount: approved.length, totalApprovers: total } });
    return WorkflowStatus.APPROVED;
  }

  return WorkflowStatus.PENDING;
}

module.exports = { buildApprovals, canCurrentApproverAct, finalizeExpenseIfReady, resolveRule };
