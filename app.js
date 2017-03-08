const koa = require('koa');
const app = new koa();
const serve = require('koa-static');
const send = require('koa-send');
const Router = require('koa-rest-router');
const routerPaths = ['./routers/files', './routers/authentication',
  './routers/shares'];
const mongoose = require('mongoose');
const bodyParse = require('koa-better-body');
const session = require('koa-session');
const convert = require('koa-convert');
const compress = require('koa-compress');

setMiddleWares();
setRouter();
setDb();

app.keys = ['ni ke wang nai zi ma'];

let port = 8000;

app.listen(port, '127.0.0.1', () => {
  console.log(`server listening to port ${port}`);
});

// set middlewares
function setMiddleWares() {
  app.use(compress());
  app.use(convert(session(app)));
  app.use(serve('public'));
  app.use(bodyParse());
}

// set routers
function setRouter() {
  let basic = Router();
  let api = Router({
    prefix: 'api'
  });

  for (let path of routerPaths) {
    let rt = require(path);
    rt(api);
  }

  let router = basic.loadMethods();
  router.get('/*', function* (next) {
    if (this.status == 404) {
      yield send(this, 'index.html');
    }
  });
  app.use(api.middleware());
  app.use(router.middleware());
}

function setDb() {
  if (process.env.NODE_ENV == 'development') {
    mongoose.connect('mongodb://localhost:51017/my-files');
  } else {
    mongoose.connect('mongodb://localhost/my-files');
  }
}
