const { getDB } = require('../db/connection');
const { ObjectId } = require('mongodb');

// GET an event by its unique ID
async function getEventById(req, res) {
  const { id } = req.query;
  try {
    const event = await getDB().collection('events').findOne({ _id: new ObjectId(id) });
    
    res.json(event);
  } catch (error) {
    res.status(500).send('Error fetching event');
  }
}

// GET latest events with pagination
// GET latest events with pagination
async function getLatestEvents(req, res) {
    const { type, limit = 5, page = 1 } = req.query;
    
    console.log(`Request received: type=${type}, limit=${limit}, page=${page}`);

    try {
        let query = {};
        if (type === 'latest') {
            query = { type: 'event' };  // Ensure 'event' matches actual 'type' values in MongoDB
        }

        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);

        // Validation check for limit and page values
        if (isNaN(limitInt) || isNaN(pageInt) || limitInt <= 0 || pageInt <= 0) {
            return res.status(400).json({ error: "Invalid limit or page number. Must be a positive integer." });
        }

        console.log(`Query being used:`, query);

        const events = await getDB()
            .collection('events') // Ensure 'events' is the correct collection name in MongoDB
            .find(query)
            .sort({ schedule: -1 })  // Ensure 'schedule' is a valid field
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt)
            .toArray();

        console.log(`Pagination applied: skip=${(pageInt - 1) * limitInt}, limit=${limitInt}`);
        console.log('Events fetched:', events);

        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'No events found' });
        }

        res.json({
            page: pageInt,
            limit: limitInt,
            totalEvents: events.length,
            events
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Error fetching events' });
    }
}


// POST: Create a new event
async function createEvent(req, res) {
  const event = req.body;
  try {
    const result = await getDB().collection('events').insertOne(event);
    
    res.json({ id: result.insertedId });
    console.log("success");
  } catch (error) {
    res.status(500).send('Error creating event');
  }
}

// PUT: Update an existing event
async function updateEvent(req, res) {
  const { id } = req.params;
  const updates = req.body;
  try {
    await getDB().collection('events').updateOne({ _id: new ObjectId(id) }, { $set: updates });
    res.send('Event updated');
  } catch (error) {
    res.status(500).send('Error updating event');
  }
}

// DELETE: Remove an event by ID
async function deleteEvent(req, res) {
  const { id } = req.params;
  try {
    await getDB().collection('events').deleteOne({ _id: new ObjectId(id) });
    res.send('Event deleted');
  } catch (error) {
    res.status(500).send('Error deleting event');
  }
}

module.exports = { getEventById, getLatestEvents, createEvent, updateEvent, deleteEvent };
