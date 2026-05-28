const router = require('express').Router();
const { createComment, getComments, updateComment, deleteComment, likeComment } = require('../../../controllers/commentController');
const { protect } = require('../../../middlewares/auth');

router.get('/:targetType/:targetId', getComments);           // GET  /api/comments/:targetType/:targetId
router.post('/', protect, createComment);                    // POST /api/comments
router.put('/:id', protect, updateComment);                  // PUT  /api/comments/:id
router.delete('/:id', protect, deleteComment);               // DELETE /api/comments/:id
router.post('/:id/like', protect, likeComment);              // POST /api/comments/:id/like

module.exports = router;
