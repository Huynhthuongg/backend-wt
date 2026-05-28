const jwt = require('jsonwebtoken');

exports.signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' });

exports.sendTokenResponse = (user, statusCode, res) => {
  const token = exports.signToken(user._id);
  const refreshToken = exports.signRefreshToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};
