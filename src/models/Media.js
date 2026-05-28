const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  type:        { type: String, enum: ['image', 'video', 'document', 'audio'], required: true },
  url:         { type: String, required: true },
  publicId:    { type: String, required: true },
  thumbnail:   { type: String, default: '' },
  size:        { type: Number },
  format:      { type: String },
  tags:        [{ type: String }],
  category:    { type: String, default: 'general' },
  uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor:      { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  isPublic:    { type: Boolean, default: true },
  views:       { type: Number, default: 0 },
  downloads:   { type: Number, default: 0 },
}, { timestamps: true });

mediaSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Media', mediaSchema);
