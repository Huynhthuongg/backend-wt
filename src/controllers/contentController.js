const Content = require('../models/Content');

exports.createContent = async (req, res, next) => {
  try {
    const content = await Content.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, data: content });
  } catch (err) { next(err); }
};

exports.getAllContent = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, category, search, featured } = req.query;
    const query = { status: status || 'published' };
    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured === 'true';
    if (search) query.$text = { $search: search };

    const total = await Content.countDocuments(query);
    const contents = await Content.find(query)
      .populate('author', 'username avatar')
      .sort('-publishedAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), data: contents });
  } catch (err) { next(err); }
};

exports.getContentBySlug = async (req, res, next) => {
  try {
    const content = await Content.findOneAndUpdate(
      { slug: req.params.slug }, { $inc: { views: 1 } }, { new: true }
    ).populate('author', 'username avatar');
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    res.json({ success: true, data: content });
  } catch (err) { next(err); }
};

exports.updateContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    if (content.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Forbidden' });
    Object.assign(content, req.body);
    await content.save();
    res.json({ success: true, data: content });
  } catch (err) { next(err); }
};

exports.deleteContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    if (content.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Forbidden' });
    await content.deleteOne();
    res.json({ success: true, message: 'Content deleted successfully' });
  } catch (err) { next(err); }
};
