const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const patients = await prisma.patient.findMany({take: 1});
  console.log(patients[0]);
}
main().finally(() => prisma.$disconnect());
