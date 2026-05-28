const Media = require('../models/Media');
const { cloudinary } = require('../config/cloudinary');

exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: 'No file uploaded' });

    const { title, description, tags, category, isPublic } = req.body;
    const fileType = req.file.mimetype.startsWith('image/') ? 'image'
      : req.file.mimetype.startsWith('video/') ? 'video'
      : req.file.mimetype.startsWith('audio/') ? 'audio' : 'document';

    const media = await Media.create({
      title: title || req.file.originalname,
      description,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      category: category || 'general',
      type: fileType,
      url: req.file.path,
      publicId: req.file.filename,
      size: req.file.size,
      format: req.file.mimetype,
      isPublic: isPublic !== 'false',
      uploadedBy: req.user._id,
    });

    res.status(201).json({ success: true, data: media });
  } catch (err) { next(err); }
};

exports.getAllMedia = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, category, search } = req.query;
    const query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (search) query.$text = { $search: search };
    if (!req.user || req.user.role === 'user') query.isPublic = true;

    const total = await Media.countDocuments(query);
    const media = await Media.find(query)
      .populate('uploadedBy', 'username avatar')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), data: media });
  } catch (err) { next(err); }
};

exports.getMediaById = async (req, res, next) => {
  try {
    const media = await Media.findByIdAndUpdate(
      req.params.id, { $inc: { views: 1 } }, { new: true }
    ).populate('uploadedBy', 'username avatar');
    if (!media) return res.status(404).json({ success: false, message: 'Media not found' });
    res.json({ success: true, data: media });
  } catch (err) { next(err); }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: 'Media not found' });
    if (media.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Forbidden' });
    await cloudinary.uploader.destroy(media.publicId, { resource_type: 'auto' });
    await media.deleteOne();
    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (err) { next(err); }
};
