const express = require('express');
const authController = require('../controller/authController');
const protectedRoute = require('../middleware/protectedRoute');
const router = express.Router();

const {signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, updateProfilePic, updateUserName} = authController;

router.get('/check', protectedRoute, checkAuth);

router.post('/signup', signup);

router.post('/verify-email', verifyEmail);

router.post('/login', login);

router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:resetToken', resetPassword);

router.put('/update-profilepic', protectedRoute, updateProfilePic);

router.put('/update-username', protectedRoute, updateUserName);


module.exports = router;