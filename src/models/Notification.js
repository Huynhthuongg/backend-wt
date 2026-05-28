const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type:       {
    type: String,
    enum: ['comment', 'reaction', 'follow', 'mention', 'system', 'vendor_approved', 'content_published'],
    required: true,
  },
  title:      { type: String, required: true },
  message:    { type: String, required: true },
  link:       { type: String },
  isRead:     { type: Boolean, default: false },
  data:       { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
