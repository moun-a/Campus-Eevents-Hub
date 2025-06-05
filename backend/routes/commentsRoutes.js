const express = require('express');
const router = express.Router();
const {
  getEventComments,
  addComment,
  updateComment,
  deleteComment
} = require('../controllers/commentsController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/event/:eventId', getEventComments);

// Protected routes (require authentication)
router.use(authMiddleware);
router.post('/event/:eventId', addComment);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);

module.exports = router;
