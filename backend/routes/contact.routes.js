const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// Public route - Submit contact form
router.post('/', contactController.createContactMessage);

// Admin routes - Manage contact messages
router.get('/', contactController.getAllContactMessages);
router.get('/stats', contactController.getContactStats);
router.get('/:id', contactController.getContactMessageById);
router.patch('/:id', contactController.updateContactMessageStatus);
router.delete('/:id', contactController.deleteContactMessage);

module.exports = router;
