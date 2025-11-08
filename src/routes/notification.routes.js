const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { validate } = require('../middleware/validator');

router.post('/', validate('sendNotification'), notificationController.sendNotification);
router.get('/', validate('searchQuery'), notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;
