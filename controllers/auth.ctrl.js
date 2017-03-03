const { user } = require('../config');
const md5 = require('md5');

module.exports = {
  login,
  checkState,
  logout
};

function* login(next) {
  let { username, password } = this.request.fields;
  if (username != user.username || md5(password) != user.password) {
    this.body = {
      status: 'AUTH_ERR',
      msg: '用户名或密码错误'
    };
    return;
  } else {
    this.session.logined = true;
    this.body = {
      status: 'OK'
    };
    return;
  }
}

function* logout(next) {
  this.session = null;
  this.body = {
    status: 'OK'
  };
  return;
}

function* checkState(next) {
  this.body = {
    status: 'OK',
    online: this.session.logined
  };
  return;
}
