const express = require('express');
const protectedRoute = require('../middleware/protectedRoute');
const { getUsersForSidebar, getMessages, sendMessage } = require('../controller/messageController');
const router = express.Router();

router.get('/users', protectedRoute, getUsersForSidebar);

router.get('/:id', protectedRoute, getMessages);

router.post('/send/:id', protectedRoute, sendMessage);

module.exports = router;