const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const company = await prisma.company.upsert({
    where: { id: "seed-company" },
    update: { name: "Acme Labs", baseCurrency: "INR" },
    create: { id: "seed-company", name: "Acme Labs", baseCurrency: "INR" },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@acme.com" },
    update: { name: "Asha Admin", role: "ADMIN", companyId: company.id, password: hashedPassword },
    create: { name: "Asha Admin", email: "admin@acme.com", password: hashedPassword, role: "ADMIN", companyId: company.id },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@acme.com" },
    update: { name: "Mohan Manager", role: "MANAGER", companyId: company.id, password: hashedPassword },
    create: { name: "Mohan Manager", email: "manager@acme.com", password: hashedPassword, role: "MANAGER", companyId: company.id },
  });

  await prisma.user.upsert({
    where: { email: "employee@acme.com" },
    update: { name: "Esha Employee", role: "EMPLOYEE", companyId: company.id, managerId: manager.id, password: hashedPassword },
    create: { name: "Esha Employee", email: "employee@acme.com", password: hashedPassword, role: "EMPLOYEE", companyId: company.id, managerId: manager.id },
  });

  await prisma.approvalRule.deleteMany({ where: { companyId: company.id } });

  await prisma.approvalRule.createMany({
    data: [
      { companyId: company.id, ruleType: "SEQUENTIAL", minAmount: 0, maxAmount: 5000, specificApproverRole: "MANAGER" },
      { companyId: company.id, ruleType: "HYBRID", minAmount: 5000, percentageRequired: 0.6, specificApproverRole: "ADMIN" },
    ],
  });

  await prisma.auditLog.create({
    data: { action: "SEED_COMPLETED", userId: admin.id, metadata: JSON.stringify({ companyId: company.id }) },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
