const Router = require('koa-router');
const {PositiveIntegerValidator, ClassicValidator} = require('../../validators/validator');
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
    let latest = await Flow.findLatest()
    let art = await Art.getData(latest.art_id, latest.type)

    // 查询用户是否喜欢期刊
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
    const likePrevious = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
    art.setDataValue('index', flow.index)
    art.setDataValue('like_status', likePrevious)
    ctx.body = art
})

// 获取某一期期刊
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
    const likePrevious = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
    art.setDataValue('index', flow.index)
    art.setDataValue('like_status', likePrevious)
    ctx.body = art
})

// 获取某一期 - 前端可缓存(因为数据基本上不会改变)
router.get('/:type/:id', new Auth().m, async ctx=>{
    const v = await new ClassicValidator().validate(ctx)
    const id = v.get('path.id')
    const type = parseInt(v.get('path.type'))

    // 这里为什么写法变了?
    const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)

    artDetail.art.setDataValue('like_status', artDetail.like_status)
    ctx.body = artDetail.art
})

// 获取某一期的点赞数 - 需要每次请求服务端,因为期刊的点赞总数受所有用户影响
router.get('/:type/:id/favor', new Auth().m, async ctx => {
    const v = await new ClassicValidator().validate(ctx)
    const id = v.get('path.id')
    const type = parseInt(v.get('path.type'))

    // 这里为什么写法变了?
    const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)

    ctx.body = {
        fav_nums: artDetail.art.fav_nums,
        like_status: artDetail.like_status
    }
})


// 获取用户的所有喜爱期刊的集合列表
router.get('/favor', new Auth().m, async ctx => {
    const uid = ctx.auth.uid
    ctx.body = await Favor.getMyClassicFavors(uid)
})




module.exports = router