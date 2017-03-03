const AuthCtrl = require('../controllers/auth.ctrl.js');

module.exports = function(api) {
  api.resource('auths', {
    index: AuthCtrl.checkState,
    create: AuthCtrl.login,
    remove: AuthCtrl.logout
  });
};
