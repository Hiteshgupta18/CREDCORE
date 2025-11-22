const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('📝 Clearing existing data...');
  await prisma.hospitalValidation.deleteMany();
  await prisma.document.deleteMany();
  await prisma.credential.deleteMany();
  await prisma.hospitalScheme.deleteMany();
  await prisma.address.deleteMany();
  await prisma.referenceAddress.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.scheme.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.create({
    data: {
      email: 'admin@credcore.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user@credcore.com',
      password: hashedPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: 'USER'
    }
  });

  console.log(`✅ Created ${2} users`);

  // Create Schemes
  console.log('\n📋 Creating government schemes...');
  const schemes = await Promise.all([
    prisma.scheme.create({
      data: {
        name: 'Ayushman Bharat',
        description: 'Pradhan Mantri Jan Arogya Yojana - Health insurance for poor families',
        category: 'Health Insurance',
        eligibility: 'BPL families',
        benefits: 'Up to ₹5 lakh health coverage per family per year'
      }
    }),
    prisma.scheme.create({
      data: {
        name: 'CGHS',
        description: 'Central Government Health Scheme',
        category: 'Health Insurance',
        eligibility: 'Central government employees',
        benefits: 'Comprehensive medical facilities'
      }
    }),
    prisma.scheme.create({
      data: {
        name: 'Bhamashah Swasthya Bima Yojana',
        description: 'Rajasthan state health insurance scheme',
        category: 'Health Insurance',
        eligibility: 'Families in Rajasthan',
        benefits: 'Health coverage up to ₹3-5 lakh'
      }
    }),
    prisma.scheme.create({
      data: {
        name: 'ESI Scheme',
        description: 'Employee State Insurance Scheme',
        category: 'Social Security',
        eligibility: 'Employees earning below threshold',
        benefits: 'Medical, sickness, maternity benefits'
      }
    })
  ]);

  console.log(`✅ Created ${schemes.length} schemes`);

  // Create Hospitals
  console.log('\n🏥 Creating hospitals...');
  const hospitals = await Promise.all([
    prisma.hospital.create({
      data: {
        name: 'SMS Hospital',
        registrationNo: 'RAJ-SMS-001',
        licenseNumber: 'MED-LIC-2023-001',
        email: 'info@smshospital.com',
        phone: '+91-141-2560291',
        website: 'https://smshospital.rajasthan.gov.in',
        hospitalType: 'GOVERNMENT',
        status: 'VERIFIED',
        isVerified: true,
        verifiedAt: new Date(),
        verificationScore: 0.95,
        addresses: {
          create: [
            {
              addressLine1: 'JLN Marg',
              addressLine2: 'Near Collectorate Circle',
              city: 'Jaipur',
              state: 'Rajasthan',
              pincode: '302004',
              zone: 'Central',
              isPrimary: true,
              isVerified: true
            }
          ]
        },
        credentials: {
          create: [
            {
              type: 'MEDICAL_LICENSE',
              number: 'MED-LIC-2023-001',
              issuedBy: 'Medical Council of Rajasthan',
              issuedDate: new Date('2023-01-01'),
              expiryDate: new Date('2028-01-01'),
              isVerified: true,
              verifiedAt: new Date()
            },
            {
              type: 'ACCREDITATION',
              number: 'NABH-ACC-2022-SMS',
              issuedBy: 'NABH',
              issuedDate: new Date('2022-06-01'),
              expiryDate: new Date('2025-06-01'),
              isVerified: true,
              verifiedAt: new Date()
            }
          ]
        }
      }
    }),
    prisma.hospital.create({
      data: {
        name: 'Fortis Hospital',
        registrationNo: 'RAJ-FOR-002',
        licenseNumber: 'MED-LIC-2023-002',
        email: 'contact@fortis-jaipur.com',
        phone: '+91-141-2790000',
        website: 'https://www.fortishealthcare.com',
        hospitalType: 'PRIVATE',
        status: 'VERIFIED',
        isVerified: true,
        verifiedAt: new Date(),
        verificationScore: 0.92,
        addresses: {
          create: [
            {
              addressLine1: 'Jawahar Lal Nehru Marg',
              addressLine2: 'Sector 2, Malviya Nagar',
              city: 'Jaipur',
              state: 'Rajasthan',
              pincode: '302017',
              zone: 'South',
              isPrimary: true,
              isVerified: true
            }
          ]
        },
        credentials: {
          create: [
            {
              type: 'MEDICAL_LICENSE',
              number: 'MED-LIC-2023-002',
              issuedBy: 'Medical Council of Rajasthan',
              issuedDate: new Date('2023-01-01'),
              expiryDate: new Date('2028-01-01'),
              isVerified: true,
              verifiedAt: new Date()
            }
          ]
        }
      }
    }),
    prisma.hospital.create({
      data: {
        name: 'Eternal Hospital',
        registrationNo: 'RAJ-ETR-003',
        licenseNumber: 'MED-LIC-2023-003',
        email: 'info@eternalhospital.com',
        phone: '+91-141-2281111',
        website: 'https://www.eternalhospital.com',
        hospitalType: 'PRIVATE',
        status: 'VERIFIED',
        isVerified: true,
        verifiedAt: new Date(),
        verificationScore: 0.90,
        addresses: {
          create: [
            {
              addressLine1: 'Plot No. 4, Sector 5',
              addressLine2: 'Near Jagatpura Flyover',
              city: 'Jaipur',
              state: 'Rajasthan',
              pincode: '302025',
              zone: 'East',
              isPrimary: true,
              isVerified: true
            }
          ]
        }
      }
    }),
    prisma.hospital.create({
      data: {
        name: 'CK Birla Hospital',
        registrationNo: 'RAJ-CKB-004',
        licenseNumber: 'MED-LIC-2023-004',
        email: 'info@ckbirlahospitals.com',
        phone: '+91-141-5115222',
        website: 'https://www.ckbirlahospitals.com',
        hospitalType: 'PRIVATE',
        status: 'VERIFIED',
        isVerified: true,
        verifiedAt: new Date(),
        verificationScore: 0.88,
        addresses: {
          create: [
            {
              addressLine1: 'Jawahar Lal Nehru Marg',
              addressLine2: 'Sector 3, Malviya Nagar',
              city: 'Jaipur',
              state: 'Rajasthan',
              pincode: '302017',
              zone: 'South',
              isPrimary: true,
              isVerified: true
            }
          ]
        }
      }
    }),
    prisma.hospital.create({
      data: {
        name: 'Narayana Multispecialty Hospital',
        registrationNo: 'RAJ-NAR-005',
        licenseNumber: 'MED-LIC-2023-005',
        email: 'contact@narayanahealth.com',
        phone: '+91-141-6625555',
        hospitalType: 'PRIVATE',
        status: 'PENDING',
        verificationScore: 0.75,
        addresses: {
          create: [
            {
              addressLine1: 'Sector 28',
              addressLine2: 'Pratap Nagar',
              city: 'Jaipur',
              state: 'Rajasthan',
              pincode: '302033',
              zone: 'South',
              isPrimary: true
            }
          ]
        }
      }
    })
  ]);

  console.log(`✅ Created ${hospitals.length} hospitals`);

  // Enroll hospitals in schemes
  console.log('\n🔗 Enrolling hospitals in schemes...');
  await Promise.all([
    prisma.hospitalScheme.create({
      data: { hospitalId: hospitals[0].id, schemeId: schemes[0].id }
    }),
    prisma.hospitalScheme.create({
      data: { hospitalId: hospitals[0].id, schemeId: schemes[1].id }
    }),
    prisma.hospitalScheme.create({
      data: { hospitalId: hospitals[0].id, schemeId: schemes[2].id }
    }),
    prisma.hospitalScheme.create({
      data: { hospitalId: hospitals[1].id, schemeId: schemes[0].id }
    }),
    prisma.hospitalScheme.create({
      data: { hospitalId: hospitals[1].id, schemeId: schemes[3].id }
    }),
    prisma.hospitalScheme.create({
      data: { hospitalId: hospitals[2].id, schemeId: schemes[0].id }
    }),
    prisma.hospitalScheme.create({
      data: { hospitalId: hospitals[3].id, schemeId: schemes[0].id }
    })
  ]);

  console.log('✅ Hospital-scheme enrollments created');

  // Create Reference Addresses for Jaccard matching
  console.log('\n📍 Creating reference addresses...');
  const referenceAddresses = [
    {
      addressLine1: 'Flat No. B-402, Shanti Heights',
      addressLine2: 'Near D-Mart, Mansarovar',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302020',
      zone: 'South'
    },
    {
      addressLine1: 'H. No. 45/A, Shiv Vihar Colony',
      addressLine2: 'Opp. Sector 3 Park, Pratap Nagar',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302033',
      zone: 'South'
    },
    {
      addressLine1: 'Plot 108, Sunrise Residency',
      addressLine2: 'Main Ajmer Road, Mahindra SEZ',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302026',
      zone: 'West'
    },
    {
      addressLine1: 'Shop No. G-12, City Centre',
      addressLine2: 'M.I. Road, Near Paanch Batti',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001',
      zone: 'Central'
    },
    {
      addressLine1: 'K-9/14, Vaishali Marg',
      addressLine2: 'Behind Police Station, Vaishali Nagar',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302021',
      zone: 'West'
    },
    {
      addressLine1: 'B-7, Gopal Marg, C-Scheme',
      addressLine2: 'Near Statue Circle',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302005',
      zone: 'Central'
    },
    {
      addressLine1: 'Plot 25, Jagatpura Road',
      addressLine2: 'Near Jagatpura Flyover',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302025',
      zone: 'East'
    },
    {
      addressLine1: 'House 12, Malviya Nagar',
      addressLine2: 'Sector 2, JLN Marg',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302017',
      zone: 'South'
    },
    {
      addressLine1: 'Ward No. 32, Vidhyadhar Nagar',
      addressLine2: 'Near Akshay Patra Temple',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302039',
      zone: 'North'
    },
    {
      addressLine1: 'F-15, Rajat Path, Mansarovar',
      addressLine2: 'Sector 5, Near Metro Station',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302020',
      zone: 'South'
    }
  ];

  await prisma.referenceAddress.createMany({
    data: referenceAddresses
  });

  console.log(`✅ Created ${referenceAddresses.length} reference addresses`);

  // Create sample validation records
  console.log('\n✔️  Creating validation records...');
  await Promise.all([
    prisma.hospitalValidation.create({
      data: {
        userId: user1.id,
        hospitalId: hospitals[0].id,
        inputData: {
          scannedText: 'SMS Hospital JLN Marg Jaipur',
          documentType: 'registration'
        },
        extractedInfo: {
          hospitalName: 'SMS Hospital',
          address: 'JLN Marg, Jaipur',
          registrationNo: 'RAJ-SMS-001'
        },
        validationScore: 0.95,
        status: 'APPROVED',
        validatedAt: new Date()
      }
    }),
    prisma.hospitalValidation.create({
      data: {
        userId: user2.id,
        hospitalId: hospitals[1].id,
        inputData: {
          scannedText: 'Fortis Hospital Malviya Nagar',
          documentType: 'license'
        },
        extractedInfo: {
          hospitalName: 'Fortis Hospital',
          address: 'Malviya Nagar, Jaipur',
          licenseNumber: 'MED-LIC-2023-002'
        },
        validationScore: 0.88,
        status: 'APPROVED',
        validatedAt: new Date()
      }
    })
  ]);

  console.log('✅ Created validation records');

  console.log('\n✨ Database seeded successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - Users: ${2}`);
  console.log(`   - Schemes: ${schemes.length}`);
  console.log(`   - Hospitals: ${hospitals.length}`);
  console.log(`   - Reference Addresses: ${referenceAddresses.length}`);
  console.log(`   - Validations: ${2}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
