const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', forumController.getAllTopics);
router.get('/mine', verifyToken, forumController.getMyTopics);
router.post('/', verifyToken, forumController.createTopic);
router.put('/:id', verifyToken, forumController.updateMyTopic);
router.delete('/:id', verifyToken, forumController.deleteMyTopic);

module.exports = router;
