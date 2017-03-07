const Share = require('../models/Share.js');
const fs = require('co-fs');
const path = require('path');

module.exports = {
  createShare,
  getShare,
  downloadShare
};

function* downloadShare(next) {
  let { id } = this.query;
  let share;
  try {
    share = yield Share.getById(id);
  } catch (e) {
    console.log(e);
    this.body = {
      status: 'DATABASE_ERR',
      err: JSON.stringify(e)
    };
    return;
  }
  if (!share) {
    this.body = {
      status: 'NO_SAHRE',
      msg: '改分享不存在或被取消'
    };
  } else {
    let file = share.file;
    let data;
    try {
      data = yield fs.readFile(path.join(__dirname, file.path));
    } catch (e) {
      throw e;
    }
    this.req.setTimeout(1000 * 3600, () => console.log('fuck'));
    this.attachment(file.filename);
    this.body = data;
    return;
  }
}

function* getShare(next) {
  let id = this.params.share;
  let share;
  try {
    share = yield Share.getById(id);
  } catch (e) {
    console.log(e);
    this.body = {
      status: 'DATABASE_ERR',
      err: JSON.stringify(e)
    };
    return;
  }
  if (!share) {
    this.body = {
      status: 'NO_SAHRE',
      msg: '改分享不存在或被取消'
    };
  } else {
    this.body = {
      status: 'OK',
      share
    };
  }
  return;
}

function* createShare(next) {
  let { id } = this.request.fields;
  let share;
  try {
    share = yield Share.getByFile(id);
  } catch (e) {
    this.body = {
      status: 'DATABASE_ERR',
      err: e
    };
    return;
  }
  this.body = {
    status: 'OK',
    share_id: share._id
  };
}
