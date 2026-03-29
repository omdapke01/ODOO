const prisma = require("../config/prisma");

async function createAuditLog({ action, userId, expenseId, metadata }) {
  return prisma.auditLog.create({
    data: {
      action,
      userId,
      expenseId,
      metadata: metadata == null ? null : JSON.stringify(metadata),
    },
  });
}

module.exports = { createAuditLog };
