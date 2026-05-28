const router = require('express').Router();
const { toggleReaction, getReactions } = require('../../../controllers/reactionController');
const { protect } = require('../../../middlewares/auth');

router.get('/:targetType/:targetId', getReactions);          // GET  /api/reactions/:targetType/:targetId
router.post('/', protect, toggleReaction);                   // POST /api/reactions

module.exports = router;
