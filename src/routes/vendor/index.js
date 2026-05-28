const router = require('express').Router();
const { protect, authorize } = require('../../middlewares/auth');
const { createVendor, getAllVendors, getVendorById, updateVendorStatus } = require('../../controllers/vendorController');

router.get('/', getAllVendors);                                          // GET  /vendor
router.get('/:id', getVendorById);                                      // GET  /vendor/:id
router.post('/', protect, createVendor);                                // POST /vendor
router.put('/:id/status', protect, authorize('admin'), updateVendorStatus); // PUT /vendor/:id/status

module.exports = router;
