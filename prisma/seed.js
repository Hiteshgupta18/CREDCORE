import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  try {
    // Create sample providers
    const provider1 = await prisma.provider.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        npi: '1234567890',
        overallTrustScore: 0.95,
        status: 'ACTIVE',
        locations: {
          create: [
            {
              addressLine1: '123 Medical Center Dr',
              city: 'San Francisco',
              state: 'CA',
              zip: '94143',
              phone: '415-555-0123',
              isPrimary: true
            }
          ]
        },
        credentials: {
          create: [
            {
              type: 'MEDICAL_LICENSE',
              number: 'CA12345',
              expirationDate: new Date('2026-12-31')
            }
          ]
        }
      }
    });

    // Create sample raw scraped data
    await prisma.rawScrapedData.create({
      data: {
        sourceUrl: 'https://example-medical-directory.com/dr-john-doe',
        rawJson: {
          name: 'Dr. John Doe',
          address: '123 Medical Center Dr, San Francisco, CA 94143',
          phone: '415-555-0124', // Slightly different phone number to trigger discrepancy
          license: 'CA12345'
        }
      }
    });

    // Create sample discrepancy
    await prisma.discrepancyLog.create({
      data: {
        providerId: provider1.id,
        fieldName: 'phone_number',
        currentValue: '415-555-0123',
        newFoundValue: '415-555-0124',
        aiConfidenceScore: 0.85,
        status: 'PENDING_REVIEW'
      }
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();