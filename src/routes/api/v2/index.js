const router = require('express').Router();
const mediaRoutes = require('./media');
const contentRoutes = require('./content');

router.get('/', (req, res) => res.json({
  version: 'v2',
  status: 'active',
  features: ['bulk-upload', 'advanced-search', 'analytics', 'bulk-publish'],
}));

router.use('/media', mediaRoutes);
router.use('/content', contentRoutes);

module.exports = router;
