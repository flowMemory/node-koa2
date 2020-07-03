const Router = require('koa-router');
const {PositiveIntegerValidator} = require('../validators/validator');

const router = new Router({
    prefix: '/v1/api/book'
})

router.get('/hot', async (ctx, next) => {
    if(true) {
        const v = await new PositiveIntegerValidator().validate(ctx)
        const id = v.get("query.id")
        console.log(id)
        ctx.body = id
    }
    console.log(ctx.path)
});

module.exports = router