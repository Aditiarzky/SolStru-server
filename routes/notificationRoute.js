const express = require('express');
const router = express.Router();
const NotificationController = require('../controller/notificationController');
const AuthenticateToken = require('../middleware/authMiddleware');

router.get('/', AuthenticateToken, NotificationController.getNotification);
router.post('/add', AuthenticateToken, NotificationController.create);
router.patch('/:id/baca', AuthenticateToken, NotificationController.tandaiDibaca);
router.delete('/:id', AuthenticateToken, NotificationController.hapus);

module.exports = router;
