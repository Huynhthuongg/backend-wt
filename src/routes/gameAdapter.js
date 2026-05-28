const express = require('express');
const router = express.Router();

function ok(path, body = {}) {
  const now = Math.floor(Date.now() / 1000);
  const common = {
    path,
    token: 'LOCAL_DEMO_TOKEN',
    access_token: 'LOCAL_DEMO_TOKEN',
    user_id: 1,
    uid: 1,
    id: 1,
    nickname: 'Demo User',
    username: 'demo',
    mobile: '',
    email: '',
    avatar: '',
    balance: '999999.00',
    gold: '999999.00',
    coin: '999999.00',
    safe_gold: '0.00',
    currency: 'VND',
    list: [],
    rows: [],
    items: [],
    records: [],
    config: {},
    game_config: {},
    vendor: [],
    vendors: [],
    games: [],
    notices: [],
    banners: [],
    popups: [],
    activities: [],
    ...body
  };

  return {
    code: 0,
    status: 0,
    success: true,
    msg: 'ok',
    message: 'ok',
    time: now,
    timestamp: now,
    data: common,
    result: common
  };
}

router.use((req, res, next) => {
  const path = req.path || '';
  if (
    path.startsWith('/api/') ||
    path.startsWith('/user/') ||
    path.startsWith('/plat/') ||
    path.startsWith('/vendor/') ||
    path.startsWith('/game/') ||
    path.startsWith('/activity/') ||
    path.startsWith('/notice_') ||
    path === '/login' ||
    path === '/register'
  ) {
    console.log('[GAME ADAPTER]', req.method, req.originalUrl);
    return res.json(ok(req.originalUrl));
  }
  next();
});

module.exports = router;
