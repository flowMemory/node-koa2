require('module-alias/register')

const Koa = require('koa');
// 解析json参数
const parser = require('koa-bodyparser')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')
const app = new Koa();


// 先启用全局监听异常方法
app.use(catchError)
app.use(parser())

// 调用静态方法，初始化路由注册
InitManager.initCore(app)

// 监听的端口
app.listen(3000);