const User = require('../models/User');
const Media = require('../models/Media');
const Content = require('../models/Content');
const Vendor = require('../models/Vendor');

exports.getDashboard = async (req, res, next) => {
  try {
    const [users, media, contents, vendors] = await Promise.all([
      User.countDocuments(),
      Media.countDocuments(),
      Content.countDocuments(),
      Vendor.countDocuments(),
    ]);
    res.json({
      success: true,
      data: { stats: { users, media, contents, vendors }, timestamp: new Date() },
    });
  } catch (err) { next(err); }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, page: Number(page), data: users });
  } catch (err) { next(err); }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, { role: req.body.role }, { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};
