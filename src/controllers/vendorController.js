const Vendor = require('../models/Vendor');
const crypto = require('crypto');

exports.createVendor = async (req, res, next) => {
  try {
    const apiKey = crypto.randomBytes(32).toString('hex');
    const vendor = await Vendor.create({ ...req.body, apiKey, owner: req.user._id });
    res.status(201).json({ success: true, data: vendor });
  } catch (err) { next(err); }
};

exports.getAllVendors = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    const total = await Vendor.countDocuments(query);
    const vendors = await Vendor.find(query)
      .populate('owner', 'username email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, page: Number(page), data: vendors });
  } catch (err) { next(err); }
};

exports.getVendorById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('owner', 'username email');
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data: vendor });
  } catch (err) { next(err); }
};

exports.updateVendorStatus = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data: vendor });
  } catch (err) { next(err); }
};
