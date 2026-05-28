const router = require('express').Router();
const { protect } = require('../../middlewares/auth');
const User = require('../../models/User');
const Media = require('../../models/Media');
const Content = require('../../models/Content');
const { upload } = require('../../config/cloudinary');

// GET /user/profile
router.get('/profile', protect, (req, res) => {
  res.json({ success: true, data: req.user });
});

// PUT /user/profile
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { username, email }, { new: true, runValidators: true }
    );
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

// PUT /user/avatar
router.put('/avatar', protect, upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const user = await User.findByIdAndUpdate(
      req.user._id, { avatar: req.file.path }, { new: true }
    );
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

// PUT /user/password
router.put('/password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) { next(err); }
});

// GET /user/my-media
router.get('/my-media', protect, async (req, res, next) => {
  try {
    const media = await Media.find({ uploadedBy: req.user._id }).sort('-createdAt');
    res.json({ success: true, count: media.length, data: media });
  } catch (err) { next(err); }
});

// GET /user/my-content
router.get('/my-content', protect, async (req, res, next) => {
  try {
    const contents = await Content.find({ author: req.user._id }).sort('-createdAt');
    res.json({ success: true, count: contents.length, data: contents });
  } catch (err) { next(err); }
});

module.exports = router;
