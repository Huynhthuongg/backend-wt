const router = require('express').Router();
const { uploadMedia, getAllMedia, getMediaById, deleteMedia } = require('../../../controllers/mediaController');
const { protect, authorize } = require('../../../middlewares/auth');
const { upload } = require('../../../config/cloudinary');

router.get('/', getAllMedia);
router.get('/:id', getMediaById);
router.post('/', protect, authorize('editor', 'vendor', 'admin'), upload.single('file'), uploadMedia);
router.delete('/:id', protect, deleteMedia);

module.exports = router;
