const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user profile
router.get('/me', authController.getCurrentUser);

// Get all users (admin)
router.get('/users', authController.getAllUsers);

// Get user statistics
router.get('/users/stats', authController.getUserStats);

module.exports = router;
