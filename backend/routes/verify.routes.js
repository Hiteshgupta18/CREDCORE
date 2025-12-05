const express = require('express');
const router = express.Router();
const validationController = require('../controllers/validation.controller');

// General document/hospital verification endpoint
router.post('/', validationController.verifyDocument);

module.exports = router;
