const config = {
    // 开发环境 prod
    environment: 'dev',
    // 数据库连接配置
    database:{
        dbName:'7yue',
        host:'localhost',
        port:3306,
        user:'root',
        password:'123456',
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