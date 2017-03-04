const { requireAuth } = require('../middlewares/auth');
const ShareCtrl = require('../controllers/share.ctrl.js');

module.exports = function(api) {
  api.resource('shares', {
    create: [requireAuth, ShareCtrl.createShare],
    show: ShareCtrl.getShare,
  });
  let router = api.loadMethods();
  router.get('/shares/download', ShareCtrl.downloadShare);
};
