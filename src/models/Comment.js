const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content:    { type: String, required: true, maxlength: 2000 },
  author:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['Content', 'Media'], required: true },
  targetId:   { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'targetType' },
  parentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  likes:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isEdited:   { type: Boolean, default: false },
}, { timestamps: true });

commentSchema.index({ targetId: 1, targetType: 1 });

module.exports = mongoose.model('Comment', commentSchema);
