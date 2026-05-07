const express = require('express');
const router = express.Router();
const {protect, admin} = require("../middlewares/auth.js");
const {getAllEvent, getEventById, createEvent, updateEvent, deleteEvent} = require("../controllers/eventController.js");

router.get('/', getAllEvent);
router.get('/:id', getEventById);
router.post('/', protect, admin, createEvent);
router.put('/:id', protect, admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;
