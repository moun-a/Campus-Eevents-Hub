const db = require('../config/db');

// Get comments for an event
const getEventComments = (req, res) => {
  const { eventId } = req.params;
  
  const sql = `
    SELECT 
      c.*,
      u.name as user_name
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.event_id = ?
    ORDER BY c.created_at DESC
  `;

  db.query(sql, [eventId], (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

// Add a comment
const addComment = (req, res) => {
  const { eventId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  const sql = `
    INSERT INTO comments (content, user_id, event_id)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [content, userId, eventId], (err, result) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: 'Error adding comment' });
    }

    // Get the newly created comment with user info
    const getCommentSql = `
      SELECT 
        c.*,
        u.name as user_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;

    db.query(getCommentSql, [result.insertId], (err, results) => {
      if (err) return res.status(500).json({ error: 'Error retrieving comment' });
      res.status(201).json(results[0]);
    });
  });
};

// Update a comment
const updateComment = (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  // Check if user is the comment author
  db.query('SELECT user_id FROM comments WHERE id = ?', [commentId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Comment not found' });
    if (results[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this comment' });
    }

    const sql = 'UPDATE comments SET content = ? WHERE id = ?';
    
    db.query(sql, [content, commentId], (err) => {
      if (err) return res.status(500).json({ error: 'Error updating comment' });
      res.json({ message: 'Comment updated successfully' });
    });
  });
};

// Delete a comment
const deleteComment = (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId;

  // Check if user is the comment author
  db.query('SELECT user_id FROM comments WHERE id = ?', [commentId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Comment not found' });
    if (results[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    db.query('DELETE FROM comments WHERE id = ?', [commentId], (err) => {
      if (err) return res.status(500).json({ error: 'Error deleting comment' });
      res.json({ message: 'Comment deleted successfully' });
    });
  });
};

module.exports = {
  getEventComments,
  addComment,
  updateComment,
  deleteComment
}; 