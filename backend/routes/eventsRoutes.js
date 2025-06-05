const express = require('express');
const router = express.Router();
const { 
  getAllEvents, 
  getEvent, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  getUserEvents
} = require('../controllers/eventsController');
const Event = require('../models/Event');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEvent);

// Protected routes (require authentication)
router.use(authMiddleware);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.get('/user/events', getUserEvents);

// Register for an event
router.post('/:id/register', async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id; // Get user from auth middleware

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if already registered
        const isRegistered = await event.hasAttendee(userId);
        if (isRegistered) {
            return res.status(409).json({ error: 'Already registered for this event' });
        }

        // Check max attendees
        if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
            return res.status(400).json({ error: 'Event is full' });
        }

        // Register user and update attendee count
        await event.addAttendee(userId);
        await event.increment('currentAttendees');

        res.status(201).json({ message: 'Successfully registered for event' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register for event' });
    }
});

// Get event attendees
router.get('/:id/attendees', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'attendees',
                attributes: ['id', 'name', 'email']
            }]
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event.attendees);
    } catch (error) {
        console.error('Error fetching attendees:', error);
        res.status(500).json({ error: 'Failed to fetch attendees' });
    }
});

// Unregister from event
router.delete('/:id/unregister', async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id; // Get user from auth middleware

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if registered
        const isRegistered = await event.hasAttendee(userId);
        if (!isRegistered) {
            return res.status(404).json({ error: 'Not registered for this event' });
        }

        // Unregister user and update attendee count
        await event.removeAttendee(userId);
        await event.decrement('currentAttendees');

        res.json({ message: 'Successfully unregistered from event' });
    } catch (error) {
        console.error('Unregistration error:', error);
        res.status(500).json({ error: 'Failed to unregister from event' });
    }
});

module.exports = router;




// POST /events/:id/register - Inscription à un événement
router.post('/:id/register', (req, res) => {
  const eventId = req.params.id;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'ID utilisateur requis' });
  }

  const sql = `
    INSERT INTO attendees (user_id, event_id)
    VALUES (?, ?)
  `;

  db.query(sql, [user_id, eventId], (err, result) => {
   if (err) {
  console.error("Erreur SQL:", err); // Affiche l'erreur complète dans la console
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Déjà inscrit à cet événement' });
  }
  return res.status(500).json({ error: err.message }); // Renvoie le vrai message au frontend
}


    res.status(201).json({ message: 'Inscription réussie' });
  });
});


// GET /events/:id/attendees - Liste des participants
router.get('/:id/attendees', (req, res) => {
  const eventId = req.params.id;

  const sql = `
    SELECT u.id, u.name, u.email
    FROM attendees a
    JOIN users u ON a.user_id = u.id
    WHERE a.event_id = ?
  `;

  db.query(sql, [eventId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur SQL' });
    res.json(results);
  });
});



// DELETE /events/:id/unregister - Se désinscrire d'un événement
router.delete('/:id/unregister', (req, res) => {
  const eventId = req.params.id;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'ID utilisateur requis' });
  }

  const sql = `
    DELETE FROM attendees
    WHERE event_id = ? AND user_id = ?
  `;

  db.query(sql, [eventId, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erreur SQL' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Inscription non trouvée" });
    }

    res.json({ message: 'Désinscription réussie' });
  });
});
