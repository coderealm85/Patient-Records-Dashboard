import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const id = 'cmoftp77e0003i47k37eduyif'; // ID from Prisma Studio
  console.log(`Checking patient ${id}...`);
  
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      diagnosisHistory: true,
      diagnosticList: true,
      labResults: true,
    }
  });

  if (!patient) {
    console.log("Patient not found.");
    return;
  }

  console.log("Found patient:", patient.name);
  
  try {
    console.log("Attempting to delete...");
    await prisma.$transaction([
      prisma.diagnosisHistory.deleteMany({ where: { patientId: id } }),
      prisma.diagnosticItem.deleteMany({ where: { patientId: id } }),
      prisma.labResult.deleteMany({ where: { patientId: id } }),
      prisma.patient.delete({ where: { id } })
    ]);
    console.log("Successfully deleted!");
  } catch (error) {
    console.error("DELETE FAILED:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
