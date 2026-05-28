const router = require('express').Router();
const authRoutes = require('./auth');
const mediaRoutes = require('./media');
const contentRoutes = require('./content');
const commentRoutes = require('./comments');
const reactionRoutes = require('./reactions');
const notificationRoutes = require('./notifications');
const categoryRoutes = require('./categories');

router.get('/', (req, res) => res.json({ version: 'v1', status: 'active' }));
router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);
router.use('/content', contentRoutes);
router.use('/comments', commentRoutes);
router.use('/reactions', reactionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
