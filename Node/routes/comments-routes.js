const express = require('express');
const commentsController = require('../controllers/comments-controller');
const router = express.Router();

// Get comments for a place
router.get('/place/:pid', commentsController.getCommentsByPlaceId);
// Add a comment
router.post('/', commentsController.createComment);

module.exports = router;
