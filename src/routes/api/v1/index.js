const router = require('express').Router();
const authRoutes = require('./auth');
const mediaRoutes = require('./media');
const contentRoutes = require('./content');

router.get('/', (req, res) => res.json({ version: 'v1', status: 'active' }));
router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);
router.use('/content', contentRoutes);

module.exports = router;
