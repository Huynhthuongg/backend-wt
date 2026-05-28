const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const Content = require('../models/Content');

exports.createComment = async (req, res, next) => {
  try {
    const { content, targetType, targetId, parentId } = req.body;
    const comment = await Comment.create({
      content, targetType, targetId,
      parentId: parentId || null,
      author: req.user._id,
    });

    await comment.populate('author', 'username avatar');

    // Tạo notification cho chủ content
    if (targetType === 'Content') {
      const post = await Content.findById(targetId).select('author title');
      if (post && post.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: 'comment',
          title: 'Bình luận mới',
          message: `${req.user.username} đã bình luận về "${post.title}"`,
          link: `/content/${targetId}`,
        });
      }
    }

    res.status(201).json({ success: true, data: comment });
  } catch (err) { next(err); }
};

exports.getComments = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.find({ targetType, targetId, parentId: null })
      .populate('author', 'username avatar')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Lấy replies cho mỗi comment
    const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
      const replies = await Comment.find({ parentId: comment._id })
        .populate('author', 'username avatar')
        .sort('createdAt');
      return { ...comment.toObject(), replies };
    }));

    const total = await Comment.countDocuments({ targetType, targetId, parentId: null });
    res.json({ success: true, total, page: Number(page), data: commentsWithReplies });
  } catch (err) { next(err); }
};

exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Forbidden' });
    comment.content = req.body.content;
    comment.isEdited = true;
    await comment.save();
    res.json({ success: true, data: comment });
  } catch (err) { next(err); }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Forbidden' });
    await Comment.deleteMany({ parentId: comment._id }); // xóa replies
    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) { next(err); }
};

exports.likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    const idx = comment.likes.indexOf(req.user._id);
    if (idx === -1) comment.likes.push(req.user._id);
    else comment.likes.splice(idx, 1);
    await comment.save();
    res.json({ success: true, likes: comment.likes.length });
  } catch (err) { next(err); }
};
