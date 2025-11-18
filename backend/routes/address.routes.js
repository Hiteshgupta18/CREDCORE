const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');

// Get all addresses
router.get('/', addressController.getAllAddresses);

// Get address by ID
router.get('/:id', addressController.getAddressById);

// Create new address
router.post('/', addressController.createAddress);

// Update address
router.put('/:id', addressController.updateAddress);

// Delete address
router.delete('/:id', addressController.deleteAddress);

// Get addresses by hospital
router.get('/hospital/:hospitalId', addressController.getAddressesByHospital);

// Validate address using Jaccard similarity
router.post('/validate', addressController.validateAddress);

// Bulk validate addresses
router.post('/validate/bulk', addressController.bulkValidateAddresses);

module.exports = router;
