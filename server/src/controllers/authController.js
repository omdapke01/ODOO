const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const { signToken } = require("../utils/tokens");
const { createAuditLog } = require("../utils/audit");

async function signup(req, res) {
  const { companyName, baseCurrency, name, email, password } = req.body;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(409).json({ message: "Email already registered." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: { name: companyName, baseCurrency },
    });

    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        companyId: company.id,
      },
    });

    await tx.approvalRule.create({
      data: {
        companyId: company.id,
        ruleType: "SEQUENTIAL",
        percentageRequired: 0.6,
        specificApproverRole: "ADMIN",
      },
    });

    return { company, user };
  });

  await createAuditLog({ action: "SIGNUP_COMPLETED", userId: result.user.id, metadata: { companyId: result.company.id } });

  return res.status(201).json({
    token: signToken(result.user),
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
      companyId: result.user.companyId,
    },
    company: result.company,
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  return res.json({
    token: signToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    },
  });
}

module.exports = { signup, login };
