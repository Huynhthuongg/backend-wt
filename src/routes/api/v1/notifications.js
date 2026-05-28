const router = require('express').Router();
const { getNotifications, markAsRead, deleteNotification } = require('../../../controllers/notificationController');
const { protect } = require('../../../middlewares/auth');

router.use(protect);

router.get('/', getNotifications);                           // GET    /api/notifications
router.patch('/read', markAsRead);                           // PATCH  /api/notifications/read
router.delete('/:id', deleteNotification);                   // DELETE /api/notifications/:id

module.exports = router;
