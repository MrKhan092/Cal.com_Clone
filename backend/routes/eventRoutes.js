const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getEventTypes);
router.post('/', eventController.createEventType);
router.put('/:id', eventController.updateEventType);
router.delete('/:id', eventController.deleteEventType);

module.exports = router;