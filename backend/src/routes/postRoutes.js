const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.route('/')
    .get(postController.getAllPosts)
    .post(postController.createPost);

router.post('/:id/like', postController.toggleLike);

module.exports = router;
