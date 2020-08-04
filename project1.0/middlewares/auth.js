// 解析HttpBasicAuth的库
const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

class Auth {
    constructor(level) {
        // 等级权限等级
        this.level = level || 1
        Auth.USER = 8
        Auth.ADMIN = 16
        Auth.SUPER_ADMIN = 32
    }

    // 判断权限要求 - 接收客户端传递的token 身份验证机制之一：HttpBasicAuth 通过header传递
    get m() {
        return async (ctx, next) => {
            
            // ctx.req是 nodejs 原生的request对象，通过basicAuth库解析request对象，获取token
            const userToken = basicAuth(ctx.req)

            let errMsg = 'token不合法'

            if (!userToken || !userToken.name) {
                throw new global.errs.Forbbiden(errMsg)
            }
            try {
                // 校验token
                var decode = jwt.verify(userToken.name, global.config.security.secretKey)
            } catch (error) {
                if (error.name == 'TokenExpiredError'){
                    errMsg = 'token已过期'
                }
                throw new global.errs.Forbbiden(errMsg)
            }

            // 用户令牌权限不足
            if(decode.scope < this.level){
                errMsg = '权限不足'
                throw new global.errs.Forbbiden(errMsg)
            }

            // uid,scope 通过后把用户身份，权限记录在ctx对象上，方便其他地方调用
            ctx.auth = {
                uid:decode.uid,
                scope:decode.scope
            }

            await next()
        }
    }

    // 校验token
    static verifyToken(token){
        try{
            jwt.verify(token, global.config.security.secretKey)
            return true
        }
        catch (error){
            return false
        }

    }
}

module.exports = {
    Auth
}