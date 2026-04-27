import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const patientCount = await prisma.patient.count();
  const transactionCount = await prisma.transaction.count();
  console.log(`Patients: ${patientCount}`);
  console.log(`Transactions: ${transactionCount}`);
  
  if (patientCount > 0) {
    const patients = await prisma.patient.findMany({
      select: { id: true, name: true }
    });
    console.log('Patient names:', patients.map(p => p.name));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
