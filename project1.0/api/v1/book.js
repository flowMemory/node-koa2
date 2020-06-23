const Router = require('koa-router');
const {PositiveIntegerValidator} = require('../validators/validator');
const router = new Router();

router.get('/v1/api/book', async (ctx, next) => {
    if(true) {
        //console.log(ctx.query.id)
        // 校验
        const v = await new PositiveIntegerValidator().validate(ctx)
        // 取参数
        const id = v.get("body.id")
        console.log(id)
        ctx.body = id
    }
    console.log(ctx.path)
});

module.exports = router