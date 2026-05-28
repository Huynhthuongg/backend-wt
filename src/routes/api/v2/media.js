const router = require('express').Router();
const { protect, authorize } = require('../../../middlewares/auth');
const { upload } = require('../../../config/cloudinary');
const Media = require('../../../models/Media');

// POST /api/v2/media/bulk - Upload nhiều file
router.post('/bulk', protect, authorize('editor', 'vendor', 'admin'), upload.array('files', 10), async (req, res, next) => {
  try {
    if (!req.files?.length)
      return res.status(400).json({ success: false, message: 'No files uploaded' });

    const mediaItems = await Promise.all(req.files.map(file => {
      const type = file.mimetype.startsWith('image/') ? 'image'
        : file.mimetype.startsWith('video/') ? 'video'
        : file.mimetype.startsWith('audio/') ? 'audio' : 'document';
      return Media.create({
        title: file.originalname, type,
        url: file.path, publicId: file.filename,
        size: file.size, format: file.mimetype,
        uploadedBy: req.user._id, isPublic: true,
      });
    }));

    res.status(201).json({ success: true, count: mediaItems.length, data: mediaItems });
  } catch (err) { next(err); }
});

// GET /api/v2/media/analytics
router.get('/analytics', protect, authorize('admin'), async (req, res, next) => {
  try {
    const stats = await Media.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalSize: { $sum: '$size' },
        },
      },
    ]);
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
});

module.exports = router;
