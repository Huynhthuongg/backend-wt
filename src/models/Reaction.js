const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['Content', 'Media', 'Comment'], required: true },
  targetId:   { type: mongoose.Schema.Types.ObjectId, required: true },
  type:       { type: String, enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'], required: true },
}, { timestamps: true });

// Mỗi user chỉ react 1 lần trên 1 target
reactionSchema.index({ user: 1, targetId: 1, targetType: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);
