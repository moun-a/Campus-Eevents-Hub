const db = require('../config/db');

// Get all events
const getAllEvents = (req, res) => {
  const sql = `
    SELECT 
      e.*, 
      c.name as category_name,
      u.name as creator_name,
      COUNT(DISTINCT a.user_id) as attendees_count
    FROM events e
    LEFT JOIN categories c ON e.category_id = c.id
    LEFT JOIN users u ON e.creator_id = u.id
    LEFT JOIN attendees a ON e.id = a.event_id
    GROUP BY e.id
    ORDER BY e.date DESC, e.time DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

// Get single event
const getEvent = (req, res) => {
  const { id } = req.params;
  
  const sql = `
    SELECT 
      e.*, 
      c.name as category_name,
      u.name as creator_name,
      COUNT(DISTINCT a.user_id) as attendees_count
    FROM events e
    LEFT JOIN categories c ON e.category_id = c.id
    LEFT JOIN users u ON e.creator_id = u.id
    LEFT JOIN attendees a ON e.id = a.event_id
    WHERE e.id = ?
    GROUP BY e.id
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(results[0]);
  });
};

// Create event
const createEvent = (req, res) => {
  const { title, description, date, time, location, category_id } = req.body;
  const creator_id = req.user.userId;

  if (!title || !date || !time || !location || !category_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO events (title, description, date, time, location, category_id, creator_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, description, date, time, location, category_id, creator_id], (err, result) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: 'Error creating event' });
    }
    res.status(201).json({ message: 'Event created', eventId: result.insertId });
  });
};

// Update event
const updateEvent = (req, res) => {
  const { id } = req.params;
  const { title, description, date, time, location, category_id } = req.body;
  const userId = req.user.userId;

  // Check if user is the creator
  db.query('SELECT creator_id FROM events WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Event not found' });
    if (results[0].creator_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    const sql = `
      UPDATE events 
      SET title = ?, description = ?, date = ?, time = ?, location = ?, category_id = ?
      WHERE id = ?
    `;

    db.query(sql, [title, description, date, time, location, category_id, id], (err) => {
      if (err) return res.status(500).json({ error: 'Error updating event' });
      res.json({ message: 'Event updated successfully' });
    });
  });
};

// Delete event
const deleteEvent = (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  // Check if user is the creator
  db.query('SELECT creator_id FROM events WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Event not found' });
    if (results[0].creator_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    db.query('DELETE FROM events WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: 'Error deleting event' });
      res.json({ message: 'Event deleted successfully' });
    });
  });
};

// Get user's events
const getUserEvents = (req, res) => {
  const userId = req.user.userId;
  
  const sql = `
    SELECT 
      e.*, 
      c.name as category_name,
      COUNT(DISTINCT a.user_id) as attendees_count
    FROM events e
    LEFT JOIN categories c ON e.category_id = c.id
    LEFT JOIN attendees a ON e.id = a.event_id
    WHERE e.creator_id = ?
    GROUP BY e.id
    ORDER BY e.date DESC, e.time DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

module.exports = {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getUserEvents
}; 