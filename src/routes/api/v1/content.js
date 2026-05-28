const router = require('express').Router();
const { createContent, getAllContent, getContentBySlug, updateContent, deleteContent } = require('../../../controllers/contentController');
const { protect, authorize } = require('../../../middlewares/auth');

router.get('/', getAllContent);
router.get('/:slug', getContentBySlug);
router.post('/', protect, authorize('editor', 'vendor', 'admin'), createContent);
router.put('/:id', protect, updateContent);
router.delete('/:id', protect, deleteContent);

module.exports = router;
