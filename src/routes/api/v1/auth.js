const router = require('express').Router();
const {
  register, login, refreshToken, getMe, logout,
  verifyEmail, forgotPassword, resetPassword,
} = require('../../../controllers/authController');
const { protect } = require('../../../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.get('/verify-email/:token', verifyEmail);     // GET  /api/auth/verify-email/:token
router.post('/forgot-password', forgotPassword);     // POST /api/auth/forgot-password
router.post('/reset-password/:token', resetPassword); // POST /api/auth/reset-password/:token

module.exports = router;
