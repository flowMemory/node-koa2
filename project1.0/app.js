const Koa = require('koa');
const InitManager = require('./core/init')
const app = new Koa();

// 调用静态方法，初始化路由注册
InitManager.initCore(app)

app.listen(3000);