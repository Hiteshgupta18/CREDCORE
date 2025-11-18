const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/scheme.controller');

// Get all schemes
router.get('/', schemeController.getAllSchemes);

// Get scheme by ID
router.get('/:id', schemeController.getSchemeById);

// Create new scheme
router.post('/', schemeController.createScheme);

// Update scheme
router.put('/:id', schemeController.updateScheme);

// Delete scheme
router.delete('/:id', schemeController.deleteScheme);

// Get schemes by hospital
router.get('/hospital/:hospitalId', schemeController.getSchemesByHospital);

// Enroll hospital in scheme
router.post('/enroll', schemeController.enrollHospital);

module.exports = router;
