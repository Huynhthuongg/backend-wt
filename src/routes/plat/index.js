const router = require('express').Router();
const { protect, authorize } = require('../../middlewares/auth');
const { getDashboard, getAllUsers, updateUserRole, toggleUserStatus } = require('../../controllers/platController');

// Tất cả /plat routes yêu cầu admin
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);          // GET  /plat/dashboard
router.get('/users', getAllUsers);               // GET  /plat/users
router.put('/users/:id/role', updateUserRole);   // PUT  /plat/users/:id/role
router.put('/users/:id/toggle', toggleUserStatus); // PUT /plat/users/:id/toggle

module.exports = router;
