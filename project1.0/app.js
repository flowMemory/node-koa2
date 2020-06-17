const Koa = require('koa');
const Router = require('@koa/router');
const app = new Koa();
const router = new Router();

router.get('/v1/api/book', (ctx, next) => {
    console.log(ctx.path)
});

app.use(router.routes());
app.listen(3000);