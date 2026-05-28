const mongoose = require('mongoose');
const slugify = require('slugify');

const vendorSchema = new mongoose.Schema({
  name:         { type: String, required: true, unique: true },
  slug:         { type: String, unique: true },
  description:  { type: String },
  logo:         { type: String },
  website:      { type: String },
  contactEmail: { type: String },
  owner:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:       { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },
  apiKey:       { type: String, select: false },
  categories:   [{ type: String }],
  totalMedia:   { type: Number, default: 0 },
  totalContent: { type: Number, default: 0 },
}, { timestamps: true });

vendorSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema);
