const router = require('express').Router();
const { protect, authorize } = require('../../../middlewares/auth');
const Content = require('../../../models/Content');

// GET /api/v2/content/search - Tìm kiếm nâng cao
router.get('/search', async (req, res, next) => {
  try {
    const { q, category, tags, from, to, page = 1, limit = 20 } = req.query;
    const match = { status: 'published' };
    if (q) match.$text = { $search: q };
    if (category) match.category = category;
    if (tags) match.tags = { $in: tags.split(',') };
    if (from || to) {
      match.publishedAt = {};
      if (from) match.publishedAt.$gte = new Date(from);
      if (to) match.publishedAt.$lte = new Date(to);
    }

    const [result] = await Content.aggregate([
      { $match: match },
      { $sort: { publishedAt: -1 } },
      {
        $facet: {
          data: [{ $skip: (Number(page) - 1) * Number(limit) }, { $limit: Number(limit) }],
          total: [{ $count: 'count' }],
        },
      },
    ]);

    res.json({
      success: true,
      total: result.total[0]?.count || 0,
      page: Number(page),
      data: result.data,
    });
  } catch (err) { next(err); }
});

// PATCH /api/v2/content/bulk-publish
router.patch('/bulk-publish', protect, authorize('editor', 'admin'), async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids?.length)
      return res.status(400).json({ success: false, message: 'No content IDs provided' });
    await Content.updateMany(
      { _id: { $in: ids } },
      { status: 'published', publishedAt: new Date() }
    );
    res.json({ success: true, message: `${ids.length} contents published successfully` });
  } catch (err) { next(err); }
});

module.exports = router;
