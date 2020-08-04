const Router = require('koa-router');
const {PositiveIntegerValidator} = require('../../validators/validator');
const {Auth} = require('../../../middlewares/auth');
const {Flow} = require('@models/flow');
const {Art} = require('@models/art');
const {Favor} = require('@models/favor')

const router = new Router({
    prefix: '/v1/api/classic'
})

// 获取最新一期
router.get('/latest', new Auth().m, async (ctx, next) => {
    // test no await
    let latest = Flow.findLatest()

    Art.getData(latest.art_id, latest.type, null)
    const likeLatest = await Favor.userLikeIt(latest.art_id, latest.type, ctx.auth.uid)
    art.setDataValue('index', latest.index)
    art.setDataValue('like_status', likeLatest)
    ctx.body = art
});

// 获取下一期
router.get('/:index/next', new Auth().m, async (ctx) => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    })
    const index = v.get('path.index')
    const flow = await Flow.findOne({
        where: {
            index: index + 1
        }
    })
    if (!flow) {
        throw new global.errs.NotFound()
    }
    const art = await Art.getData(flow.art_id, flow.type)
    const likeNext = await Favor.userLikeIt(
        flow.art_id, flow.type, ctx.auth.uid)
    art.setDataValue('index', flow.index)
    art.setDataValue('like_status', likeNext)
    // art.exclude = ['index','like_status']
    ctx.body = art
})

// 获取下一期
router.get('/:index/previous', new Auth().m, async (ctx) => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    })
    const index = v.get('path.index')
    const flow = await Flow.findOne({
        where: {
            index: index - 1
        }
    })
    if (!flow) {
        throw new global.errs.NotFound()
    }
    const art = await Art.getData(flow.art_id, flow.type)
    const likePrevious = await Favor.userLikeIt(
        flow.art_id, flow.type, ctx.auth.uid)
    art.setDataValue('index', flow.index)
    art.setDataValue('like_status', likePrevious)
    ctx.body = art
})

module.exports = router