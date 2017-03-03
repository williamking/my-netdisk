const FileCtrl = require('../controllers/file.ctrl.js');
const { requireAuth } = require('../middlewares/auth');

let methods = {
  put: 'POST'
}

module.exports = function(api) {
  api.resource('files', {
    index: [requireAuth, FileCtrl.showFile],
    create: [requireAuth, FileCtrl.createFile],
    update: [requireAuth, FileCtrl.receiveFile],
    show: [requireAuth, FileCtrl.downloadFile]
  });
};
