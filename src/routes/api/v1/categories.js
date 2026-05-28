const router = require('express').Router();
const { createCategory, getAllCategories, getCategoryBySlug, updateCategory, deleteCategory } = require('../../../controllers/categoryController');
const { protect, authorize } = require('../../../middlewares/auth');

router.get('/', getAllCategories);                                              // GET    /api/categories
router.get('/:slug', getCategoryBySlug);                                       // GET    /api/categories/:slug
router.post('/', protect, authorize('admin'), createCategory);                 // POST   /api/categories
router.put('/:id', protect, authorize('admin'), updateCategory);               // PUT    /api/categories/:id
router.delete('/:id', protect, authorize('admin'), deleteCategory);            // DELETE /api/categories/:id

module.exports = router;
