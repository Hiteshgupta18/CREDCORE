const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospital.controller');

// Get all hospitals
router.get('/', hospitalController.getAllHospitals);

// Get single hospital by ID
router.get('/:id', hospitalController.getHospitalById);

// Create new hospital
router.post('/', hospitalController.createHospital);

// Update hospital
router.put('/:id', hospitalController.updateHospital);

// Delete hospital
router.delete('/:id', hospitalController.deleteHospital);

// Search hospitals
router.get('/search/query', hospitalController.searchHospitals);

// Get hospitals by scheme
router.get('/scheme/:schemeId', hospitalController.getHospitalsByScheme);

// Verify hospital
router.patch('/:id/verify', hospitalController.verifyHospital);

module.exports = router;
