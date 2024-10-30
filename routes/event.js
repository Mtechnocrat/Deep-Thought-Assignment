const express = require('express');
const router = express.Router();
const {
  getEventById,
  getLatestEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controller/eventController');

// GET an event by its unique ID
router.get('/events/:id', getEventById);

// GET latest events with pagination
router.get('/events', (req, res) => {
  // Set default values if not provided
  req.query.type = req.query.type || 'latest';
  req.query.limit = req.query.limit || '5';
  req.query.page = req.query.page || '1';
  
  getLatestEvents(req, res);
});

// POST: Create a new event
router.post('/events', createEvent);

// PUT: Update an existing event
router.put('/events/:id', updateEvent);

// DELETE: Remove an event by ID
router.delete('/events/:id', deleteEvent);

module.exports = router;