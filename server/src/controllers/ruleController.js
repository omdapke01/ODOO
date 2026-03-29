const prisma = require("../config/prisma");
const { createAuditLog } = require("../utils/audit");

async function createRule(req, res) {
  const rule = await prisma.approvalRule.create({
    data: {
      ...req.body,
      companyId: req.user.companyId,
    },
  });

  await createAuditLog({ action: "RULE_CREATED", userId: req.user.sub, metadata: { ruleId: rule.id } });
  return res.status(201).json(rule);
}

async function listRules(req, res) {
  const rules = await prisma.approvalRule.findMany({
    where: { companyId: req.user.companyId },
    orderBy: [{ minAmount: "asc" }, { createdAt: "desc" }],
  });

  return res.json(rules);
}

module.exports = { createRule, listRules };
