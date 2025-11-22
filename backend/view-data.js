const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function viewAllData() {
  console.log('\n📊 =============== DATABASE CONTENTS ===============\n');
  
  // Users
  const users = await prisma.user.findMany();
  console.log('👤 USERS TABLE (' + users.length + ' records):');
  console.log('─'.repeat(60));
  users.forEach(user => {
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.firstName} ${user.lastName}`);
    console.log(`Role: ${user.role}`);
    console.log(`Created: ${user.createdAt.toLocaleDateString()}`);
    console.log('─'.repeat(60));
  });
  
  // Hospitals
  const hospitals = await prisma.hospital.findMany({
    include: {
      addresses: true,
      schemes: true
    }
  });
  console.log('\n🏥 HOSPITALS TABLE (' + hospitals.length + ' records):');
  console.log('─'.repeat(60));
  hospitals.forEach(hospital => {
    console.log(`ID: ${hospital.id}`);
    console.log(`Name: ${hospital.name}`);
    console.log(`Type: ${hospital.hospitalType}`);
    console.log(`Status: ${hospital.status}`);
    console.log(`Registration: ${hospital.registrationNo || 'N/A'}`);
    console.log(`Phone: ${hospital.phone || 'N/A'}`);
    console.log(`Verified: ${hospital.isVerified ? 'Yes' : 'No'}`);
    console.log(`Addresses: ${hospital.addresses.length}`);
    console.log(`Schemes Enrolled: ${hospital.schemes.length}`);
    console.log('─'.repeat(60));
  });
  
  // Schemes
  const schemes = await prisma.scheme.findMany({
    include: {
      hospitals: true
    }
  });
  console.log('\n📋 SCHEMES TABLE (' + schemes.length + ' records):');
  console.log('─'.repeat(60));
  schemes.forEach(scheme => {
    console.log(`ID: ${scheme.id}`);
    console.log(`Name: ${scheme.name}`);
    console.log(`Category: ${scheme.category}`);
    console.log(`Eligibility: ${scheme.eligibility}`);
    console.log(`Benefits: ${scheme.benefits}`);
    console.log(`Enrolled Hospitals: ${scheme.hospitals.length}`);
    console.log('─'.repeat(60));
  });
  
  // Addresses
  const addresses = await prisma.address.findMany({
    include: {
      hospital: true
    }
  });
  console.log('\n📍 ADDRESSES TABLE (' + addresses.length + ' records):');
  console.log('─'.repeat(60));
  addresses.forEach(address => {
    console.log(`ID: ${address.id}`);
    console.log(`Hospital: ${address.hospital.name}`);
    console.log(`Address: ${address.addressLine1}`);
    console.log(`City: ${address.city}, ${address.state}`);
    console.log(`Pincode: ${address.pincode}`);
    console.log(`Primary: ${address.isPrimary ? 'Yes' : 'No'}`);
    console.log(`Verified: ${address.isVerified ? 'Yes' : 'No'}`);
    if (address.latitude && address.longitude) {
      console.log(`Location: ${address.latitude}, ${address.longitude}`);
    }
    console.log('─'.repeat(60));
  });
  
  // Reference Addresses
  const refAddresses = await prisma.referenceAddress.findMany();
  console.log('\n📍 REFERENCE ADDRESSES TABLE (' + refAddresses.length + ' records):');
  console.log('─'.repeat(60));
  refAddresses.slice(0, 5).forEach(ref => {
    console.log(`ID: ${ref.id}`);
    console.log(`Name: ${ref.name}`);
    console.log(`Address: ${ref.addressLine1}`);
    console.log(`City: ${ref.city}, ${ref.state}`);
    console.log(`Pincode: ${ref.pincode}`);
    console.log('─'.repeat(60));
  });
  if (refAddresses.length > 5) {
    console.log(`... and ${refAddresses.length - 5} more`);
  }
  
  // Validations
  const validations = await prisma.hospitalValidation.findMany({
    include: {
      hospital: true,
      user: true
    }
  });
  console.log('\n✅ VALIDATIONS TABLE (' + validations.length + ' records):');
  console.log('─'.repeat(60));
  validations.forEach(validation => {
    console.log(`ID: ${validation.id}`);
    console.log(`Hospital: ${validation.hospital.name}`);
    console.log(`Validator: ${validation.user ? validation.user.email : 'N/A'}`);
    console.log(`Status: ${validation.status}`);
    console.log(`Jaccard Score: ${validation.jaccardScore || 'N/A'}`);
    console.log(`Checked At: ${validation.checkedAt ? validation.checkedAt.toLocaleDateString() : 'N/A'}`);
    console.log('─'.repeat(60));
  });
  
  console.log('\n✨ DATABASE VIEW COMPLETE!\n');
  
  await prisma.$disconnect();
}

viewAllData().catch(console.error);
