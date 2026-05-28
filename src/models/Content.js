const mongoose = require('mongoose');
const slugify = require('slugify');

const contentSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, unique: true },
  body:        { type: String, required: true },
  excerpt:     { type: String },
  coverImage:  { type: String },
  status:      { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  category:    { type: String, required: true },
  tags:        [{ type: String }],
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor:      { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  views:       { type: Number, default: 0 },
  featured:    { type: Boolean, default: false },
  publishedAt: { type: Date },
}, { timestamps: true });

contentSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

contentSchema.index({ title: 'text', body: 'text', tags: 'text' });

module.exports = mongoose.model('Content', contentSchema);
