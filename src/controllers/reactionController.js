const Reaction = require('../models/Reaction');

exports.toggleReaction = async (req, res, next) => {
  try {
    const { targetType, targetId, type } = req.body;
    const existing = await Reaction.findOne({ user: req.user._id, targetType, targetId });

    if (existing) {
      if (existing.type === type) {
        // Bỏ reaction
        await existing.deleteOne();
        return res.json({ success: true, action: 'removed', type: null });
      }
      // Đổi loại reaction
      existing.type = type;
      await existing.save();
      return res.json({ success: true, action: 'changed', type });
    }

    await Reaction.create({ user: req.user._id, targetType, targetId, type });
    res.status(201).json({ success: true, action: 'added', type });
  } catch (err) { next(err); }
};

exports.getReactions = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.params;
    const reactions = await Reaction.aggregate([
      { $match: { targetType, targetId: require('mongoose').Types.ObjectId.createFromHexString(targetId) } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    // Reaction của user hiện tại
    let myReaction = null;
    if (req.user) {
      const mine = await Reaction.findOne({ user: req.user._id, targetType, targetId });
      myReaction = mine?.type || null;
    }

    res.json({ success: true, data: reactions, myReaction });
  } catch (err) { next(err); }
};
