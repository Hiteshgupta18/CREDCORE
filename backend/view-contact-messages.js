const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function viewContactMessages() {
  console.log('\n📬 =============== CONTACT MESSAGES ===============\n');
  
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });

    if (messages.length === 0) {
      console.log('📭 No contact messages found.\n');
      return;
    }

    console.log(`Total Messages: ${messages.length}\n`);
    console.log('─'.repeat(70));

    messages.forEach((msg, index) => {
      console.log(`\n📧 Message #${index + 1}`);
      console.log('─'.repeat(70));
      console.log(`ID: ${msg.id}`);
      console.log(`Name: ${msg.fullName}`);
      console.log(`Email: ${msg.email}`);
      console.log(`Subject: ${msg.subject}`);
      console.log(`Status: ${msg.status} ${msg.replied ? '✅ Replied' : '⏳ Pending'}`);
      console.log(`Message:\n  ${msg.message}`);
      if (msg.notes) {
        console.log(`Notes: ${msg.notes}`);
      }
      console.log(`Submitted: ${msg.createdAt.toLocaleString()}`);
      if (msg.repliedAt) {
        console.log(`Replied At: ${msg.repliedAt.toLocaleString()}`);
      }
      console.log('─'.repeat(70));
    });

    // Statistics
    const stats = {
      total: messages.length,
      new: messages.filter(m => m.status === 'NEW').length,
      read: messages.filter(m => m.status === 'READ').length,
      inProgress: messages.filter(m => m.status === 'IN_PROGRESS').length,
      resolved: messages.filter(m => m.status === 'RESOLVED').length,
      replied: messages.filter(m => m.replied).length
    };

    console.log('\n📊 STATISTICS:');
    console.log('─'.repeat(70));
    console.log(`Total Messages: ${stats.total}`);
    console.log(`New: ${stats.new} | Read: ${stats.read} | In Progress: ${stats.inProgress} | Resolved: ${stats.resolved}`);
    console.log(`Replied: ${stats.replied} (${((stats.replied/stats.total)*100).toFixed(1)}%)`);
    console.log('─'.repeat(70));
    console.log('\n✨ View complete!\n');

  } catch (error) {
    console.error('Error fetching contact messages:', error);
  } finally {
    await prisma.$disconnect();
  }
}

viewContactMessages();
