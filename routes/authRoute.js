const express = require('express');
const router = express.Router();
const AuthController = require('../controller/authController.js');
const AuthenticateToken = require('../middleware/authMiddleware.js');

router.post("/login", AuthController.login);
router.post("/logout", AuthenticateToken, AuthController.logout);
router.post('/register', AuthController.register);
router.post('/refresh-token', AuthController.refreshToken);
router.get('/status', AuthenticateToken, AuthController.statusAuth);


module.exports = router;
