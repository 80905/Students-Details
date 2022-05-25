const express = require('express');

const authController = require('../controllers/authController');
const notificationController = require('../controllers/notificationController');
const router = express.Router();

router.route('/').get(notificationController.getAllNotification).post(notificationController.createNotification);

router.route('/:id').delete(notificationController.deleteNotifications);

module.exports = router;
