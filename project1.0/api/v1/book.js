const Router = require('koa-router');
const router = new Router();
console.log(router)

router.get('/v1/api/book', (ctx, next) => {
    console.log(ctx.path)
});

module.exports = router