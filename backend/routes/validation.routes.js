const express = require('express');
const router = express.Router();
const validationController = require('../controllers/validation.controller');

// Get all validations
router.get('/', validationController.getAllValidations);

// Get validation by ID
router.get('/:id', validationController.getValidationById);

// Create validation record (OCR result)
router.post('/', validationController.createValidation);

// Update validation status
router.patch('/:id/status', validationController.updateValidationStatus);

// Get validations by user
router.get('/user/:userId', validationController.getValidationsByUser);

// Get validations by hospital
router.get('/hospital/:hospitalId', validationController.getValidationsByHospital);

module.exports = router;
