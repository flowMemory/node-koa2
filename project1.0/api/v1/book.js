const Router = require('koa-router');
const {HttpException, ParameterException} = require('../../core/http-exception');
const router = new Router();

router.get('/v1/api/book', (ctx, next) => {
    if(true) {
        const error = new HttpException('not book',999,404)
        throw error
    }
    console.log(ctx.path)
});

module.exports = router