const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

router.get('/slots', availabilityController.getAvailableSlots);
router.get('/', availabilityController.getAvailability);
router.put('/', availabilityController.updateAvailability);

module.exports = router;