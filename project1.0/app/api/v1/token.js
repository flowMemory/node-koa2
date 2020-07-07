const Router = require('koa-router')
const {TokenValidator, NotEmptyValidator} = require('../../validators/validator')
// 登录枚举
const {LoginType} = require('../../lib/enum')
const {User} = require('../../models/user')
// 微信服务
const { WXManager } = require('../../services/wx')
// token生成
const { generateToken } = require('../../../core/util')
// 权限管理
const {Auth} = require('../../../middlewares/auth')

const router = new Router({
    prefix: '/v1/token'
})

// 获取 token 接口 ：登录接口
router.post('/', async (ctx) => {
    // 验证登录
    const v = await new TokenValidator().validate(ctx)
    let token;
    switch (v.get('body.type')) {
        case LoginType.USER_EMAIL:
            token = await emailLogin(v.get('body.account'), v.get('body.secret'))
            break
        case LoginType.USER_MINI_PROGRAM:
            token = await WXManager.codeToToken(v.get('body.account'))
            break
        case LoginType.ADMIN_EMAIL:
            break
        default:
            throw new global.errs.ParameterException('没有相应的处理函数')
    }
    // 返回token
    ctx.body = {
        token
    }
})

// 校验token ：二次token登录，验证token
router.post('/verify', async (ctx)=>{
    // token
    const v = await new NotEmptyValidator().validate(ctx)
    const result = Auth.verifyToken(v.get('body.token'))
    ctx.body = {
        is_valid:result
    }
})

// email登录方式处理 :  获取token 
async function emailLogin(account, secret) {
    // 查询库检验账号密码
    const user = await User.verifyEmailPassword(account, secret)

    // 合法后生成token：最终返回token给客服端
    return token = generateToken(user.id, Auth.USER)
}

module.exports = router