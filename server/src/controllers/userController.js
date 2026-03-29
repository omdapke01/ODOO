const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const { createAuditLog } = require("../utils/audit");

async function createUser(req, res) {
  const { name, email, password, role, managerId } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return res.status(409).json({ message: "Email already registered." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      managerId: managerId || null,
      companyId: req.user.companyId,
    },
    include: {
      manager: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  await createAuditLog({ action: "USER_CREATED", userId: req.user.sub, metadata: { createdUserId: user.id, role } });
  return res.status(201).json(user);
}

async function listUsers(req, res) {
  const users = await prisma.user.findMany({
    where: { companyId: req.user.companyId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      managerId: true,
      createdAt: true,
      manager: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(users);
}

module.exports = { createUser, listUsers };
