const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function viewUsers() {
  console.log('\n👥 =============== USER ACCOUNTS ===============\n');
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            validations: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (users.length === 0) {
      console.log('❌ No users found in database.');
      console.log('\nTo create test users, run: npm run db:seed\n');
      await prisma.$disconnect();
      return;
    }

    console.log(`📊 Total Users: ${users.length}\n`);
    console.log('═'.repeat(70));

    users.forEach((user, index) => {
      console.log(`\n🔹 User #${index + 1}`);
      console.log('─'.repeat(70));
      console.log(`ID:              ${user.id}`);
      console.log(`Name:            ${user.firstName} ${user.lastName}`);
      console.log(`Email:           ${user.email}`);
      console.log(`Role:            ${user.role}`);
      console.log(`Validations:     ${user._count.validations}`);
      console.log(`Created:         ${new Date(user.createdAt).toLocaleString()}`);
      console.log(`Last Updated:    ${new Date(user.updatedAt).toLocaleString()}`);
      console.log('─'.repeat(70));
    });

    // Statistics
    const stats = {
      total: users.length,
      admins: users.filter(u => u.role === 'ADMIN').length,
      users: users.filter(u => u.role === 'USER').length,
      verifiers: users.filter(u => u.role === 'VERIFIER').length,
      recentSignups: users.filter(u => {
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return new Date(u.createdAt) > dayAgo;
      }).length
    };

    console.log('\n📈 STATISTICS:');
    console.log('═'.repeat(70));
    console.log(`Total Accounts:        ${stats.total}`);
    console.log(`Admins:                ${stats.admins}`);
    console.log(`Regular Users:         ${stats.users}`);
    console.log(`Verifiers:             ${stats.verifiers}`);
    console.log(`New (Last 24h):        ${stats.recentSignups}`);
    console.log('═'.repeat(70));

    console.log('\n🔐 DEFAULT LOGIN CREDENTIALS (from seed):');
    console.log('─'.repeat(70));
    console.log('Admin Account:');
    console.log('  Email:    admin@credcore.com');
    console.log('  Password: password123');
    console.log('');
    console.log('User Account:');
    console.log('  Email:    user@credcore.com');
    console.log('  Password: password123');
    console.log('─'.repeat(70));

    console.log('\n📍 View Options:');
    console.log('  • Prisma Studio:  cd backend && npx prisma studio');
    console.log('  • Frontend:       http://localhost:3000/data-viewer');
    console.log('  • API:            curl http://localhost:5000/api/auth/me');
    console.log('\n✨ User data view complete!\n');

  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

viewUsers();
