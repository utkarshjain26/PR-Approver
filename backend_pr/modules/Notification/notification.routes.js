const router = require('express').Router();
const { verifyToken } = require('../../middleware/verifyToken');
const { notificationController } = require('./notification.controller');

router.get("/", notificationController.getNotifications);

router.get("/:id/new",notificationController.getNewNotification);

router.put("/:id", notificationController.updateNotificationStatus);

exports.notificationRouter = router;