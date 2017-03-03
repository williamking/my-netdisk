module.exports = {
  requireAuth
};

function* requireAuth(next) {
  if (this.path === '/') {
    yield next;
    return;
  }
  if (this.session.logined) {
    yield next;
  } else {
    this.body = {
      status: 'REQUIRE_AUTH',
      msg: '请登录'
    };
    return;
  }
}
