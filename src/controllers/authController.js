const crypto = require('crypto');
const User = require('../models/User');
const { sendTokenResponse, signToken } = require('../utils/jwt');
const { sendEmail, emailTemplates } = require('../config/email');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      username, email, password,
      emailVerifyToken: verifyToken,
      emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    // Gửi email xác thực
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
    const tmpl = emailTemplates.verifyEmail(username, verifyUrl);
    await sendEmail({ to: email, ...tmpl }).catch(() => {}); // không block nếu lỗi email

    sendTokenResponse(user, 201, res);
  } catch (err) { next(err); }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      emailVerifyToken: req.params.token,
      emailVerifyExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();

    const tmpl = emailTemplates.welcomeEmail(user.username);
    await sendEmail({ to: user.email, ...tmpl }).catch(() => {});

    res.json({ success: true, message: 'Email đã được xác thực thành công' });
  } catch (err) { next(err); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: 'Email không tồn tại' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 giờ
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const tmpl = emailTemplates.forgotPassword(user.username, resetUrl);
    await sendEmail({ to: user.email, ...tmpl });

    res.json({ success: true, message: 'Email đặt lại mật khẩu đã được gửi' });
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    sendTokenResponse(user, 200, res);
  } catch (err) { next(err); }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    const token = signToken(user._id);
    res.json({ success: true, token });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
