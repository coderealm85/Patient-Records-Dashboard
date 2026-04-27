import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.appointment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.labResult.deleteMany();
  await prisma.diagnosticItem.deleteMany();
  await prisma.diagnosisHistory.deleteMany();
  await prisma.patient.deleteMany();

  const patientsData = [
    { name: 'Jessica Taylor', gender: 'Female', age: 28, profilePicture: '/jessica.png' },
    { name: 'Ryan Johnson', gender: 'Male', age: 45, profilePicture: '/ryan.png' },
    { name: 'Emily Williams', gender: 'Female', age: 32, profilePicture: '/emily.png' },
    { name: 'Brandon Mitchell', gender: 'Male', age: 38, profilePicture: '/brandon.png' },
    { name: 'Samantha Reed', gender: 'Female', age: 24, profilePicture: '/samantha.png' }
  ];

  for (const data of patientsData) {
    await prisma.patient.create({
      data: {
        ...data,
        dateOfBirth: 'January 1, 1990',
        phoneNumber: '(555) 123-4567',
        emergencyContact: '(555) 987-6543',
        insuranceType: 'HealthPlus',
        diagnosisHistory: {
          create: [{
            month: 'March',
            year: 2024,
            systolicValue: 120,
            systolicLevel: 'Normal',
            diastolicValue: 80,
            diastolicLevel: 'Normal',
            heartRateValue: 72,
            heartRateLevel: 'Normal',
            respiratoryValue: 16,
            respiratoryLevel: 'Normal',
            temperatureValue: 98.6,
            temperatureLevel: 'Normal',
          }]
        }
      }
    });
  }

  console.log('Seed many completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
