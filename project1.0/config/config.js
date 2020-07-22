const config = {
    // 开发环境 prod
    environment: 'dev',
    // 数据库连接配置
    database:{
        dbName:'flowmemory',
        host:'localhost',
        port:3306,
        user:'root',
        password:'island123',
    },
    wx:{
        appId:'wx7f9561a1a4644e8a',
        appSecret:'0ee2dbcb71922a5c0847d778c4128a84',
        loginUrl:'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    },
    // token 密钥，有效时间：一个月
    security:{
        secretKey:"abcdefg",
        expiresIn:60*60*24*30
    }
}

module.exports = {
    config
}