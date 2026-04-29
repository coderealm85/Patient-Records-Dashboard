import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDummies() {
  // Delete existing dummy patients (where userId is null)
  await prisma.patient.deleteMany({
    where: { userId: null }
  });

  const dummyPatients = [
    {
      name: 'Jessica Taylor',
      gender: 'Female',
      age: 28,
      profilePicture: 'https://fedskillstest.coalitiontechnologies.workers.dev/img/jessica-taylor.png',
      dateOfBirth: 'August 23, 1996',
      phoneNumber: '(415) 555-1234',
      emergencyContact: '(415) 555-5678',
      insuranceType: 'Sunrise Health Assurance',
    },
    {
      name: 'Emily Williams',
      gender: 'Female',
      age: 34,
      profilePicture: 'https://fedskillstest.coalitiontechnologies.workers.dev/img/emily-williams.png',
      dateOfBirth: 'March 15, 1990',
      phoneNumber: '(555) 123-4567',
      emergencyContact: '(555) 987-6543',
      insuranceType: 'Blue Cross Blue Shield',
    },
    {
      name: 'Brandon Mitchell',
      gender: 'Male',
      age: 42,
      profilePicture: 'https://fedskillstest.coalitiontechnologies.workers.dev/img/brandon-mitchell.png',
      dateOfBirth: 'January 10, 1982',
      phoneNumber: '(555) 444-3333',
      emergencyContact: '(555) 222-1111',
      insuranceType: 'UnitedHealth',
    },
    {
      name: 'Ryan Johnson',
      gender: 'Male',
      age: 31,
      profilePicture: 'https://fedskillstest.coalitiontechnologies.workers.dev/img/ryan-johnson.png',
      dateOfBirth: 'May 05, 1993',
      phoneNumber: '(555) 777-8888',
      emergencyContact: '(555) 999-0000',
      insuranceType: 'Aetna',
    },
    {
      name: 'Samantha Reed',
      gender: 'Female',
      age: 25,
      profilePicture: 'https://fedskillstest.coalitiontechnologies.workers.dev/img/samantha-reed.png',
      dateOfBirth: 'November 12, 1998',
      phoneNumber: '(555) 111-2222',
      emergencyContact: '(555) 333-4444',
      insuranceType: 'Cigna',
    }
  ];

  console.log("Creating 5 global dummy patients...");

  for (const p of dummyPatients) {
    await prisma.patient.create({
      data: {
        ...p,
        diagnosisHistory: {
          create: [
            {
              month: 'March',
              year: 2024,
              systolicValue: 120 + Math.floor(Math.random() * 40),
              systolicLevel: 'Normal',
              diastolicValue: 70 + Math.floor(Math.random() * 20),
              diastolicLevel: 'Normal',
              heartRateValue: 75,
              heartRateLevel: 'Normal',
              respiratoryValue: 18,
              respiratoryLevel: 'Normal',
              temperatureValue: 98.6,
              temperatureLevel: 'Normal',
            },
            {
              month: 'February',
              year: 2024,
              systolicValue: 115 + Math.floor(Math.random() * 30),
              systolicLevel: 'Normal',
              diastolicValue: 65 + Math.floor(Math.random() * 20),
              diastolicLevel: 'Normal',
              heartRateValue: 72,
              heartRateLevel: 'Normal',
              respiratoryValue: 16,
              respiratoryLevel: 'Normal',
              temperatureValue: 98.4,
              temperatureLevel: 'Normal',
            }
          ]
        },
        diagnosticList: {
          create: [
            { name: 'Routine Checkup', description: 'Annual physical examination', status: 'Completed' },
            { name: 'Hypertension', description: 'Mild blood pressure elevation', status: 'Under Observation' }
          ]
        },
        labResults: {
          create: [
            { name: 'Blood Test' },
            { name: 'CT Scan' }
          ]
        }
      }
    });
  }

  console.log("Successfully created 5 dummy patients!");
}

seedDummies().catch(console.error).finally(() => prisma.$disconnect());
