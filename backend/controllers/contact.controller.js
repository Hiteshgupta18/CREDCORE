const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create new contact message
exports.createContactMessage = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    // Validate required fields
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create contact message
    const contactMessage = await prisma.contactMessage.create({
      data: {
        fullName,
        email,
        subject,
        message,
        status: 'NEW'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: contactMessage
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit message',
      error: error.message
    });
  }
};

// Get all contact messages (admin only)
exports.getAllContactMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) {
      where.status = status;
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.contactMessage.count({ where })
    ]);

    res.json({
      success: true,
      data: messages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

// Get single contact message by ID
exports.getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Mark as read if status is NEW
    if (message.status === 'NEW') {
      await prisma.contactMessage.update({
        where: { id },
        data: { status: 'READ' }
      });
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error fetching contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message',
      error: error.message
    });
  }
};

// Update contact message status
exports.updateContactMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, replied } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (replied !== undefined) {
      updateData.replied = replied;
      if (replied) {
        updateData.repliedAt = new Date();
      }
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Contact message updated successfully',
      data: message
    });
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message',
      error: error.message
    });
  }
};

// Delete contact message
exports.deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contactMessage.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
};

// Get contact message statistics
exports.getContactStats = async (req, res) => {
  try {
    const [total, newMessages, readMessages, inProgress, resolved] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'NEW' } }),
      prisma.contactMessage.count({ where: { status: 'READ' } }),
      prisma.contactMessage.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.contactMessage.count({ where: { status: 'RESOLVED' } })
    ]);

    res.json({
      success: true,
      data: {
        total,
        byStatus: {
          new: newMessages,
          read: readMessages,
          inProgress,
          resolved
        }
      }
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};
