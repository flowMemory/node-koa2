const bcrypt = require('bcryptjs')
const {Sequelize,Model} = require('sequelize')
const {sequelize} = require('../../core/db')

// 数据库 用户模块
class User extends Model {

    // 登录校验
    static async verifyEmailPassword(email, plainPassword) {
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (!user) {
            throw new global.errs.AuthFailed('账号不存在')
        }
        // user.password === plainPassword
        const correct = bcrypt.compareSync(
            plainPassword, user.password)
        if(!correct){
            throw new global.errs.AuthFailed('密码不正确')
        }
        return user
    }

    // wx业务
    static async getUserByOpenid(openid){
        const user = await User.findOne({
            where:{
                openid
            }
        })
        return user
    }

    static async registerByOpenid(openid) {
        return await User.create({
            openid
        })
    }
}

// 存储数据库，字段规范
User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nickname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING(128),
        unique: true
    },
    password: {
        //扩展 设计模式 观察者模式
        //ES6 Reflect Vue3.0 
        type: Sequelize.STRING,
        set(val) {
            // 密码加密存储
            const salt = bcrypt.genSaltSync(10)
            const psw = bcrypt.hashSync(val, salt)
            this.setDataValue('password', psw)
        }
    },
    openid: {
        type: Sequelize.STRING(64),
        unique: true
    },
}, {
    sequelize,
    tableName: 'user'
})

module.exports = {
    User
}

// 数据迁移 SQL 更新 风险