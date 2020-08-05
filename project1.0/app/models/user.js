// 密码加密工具
const bcrypt = require('bcryptjs') 
// 库方法
const {Sequelize,Model} = require('sequelize')

// 自己写的实例
const {sequelize} = require('../../core/db')

// 数据库 用户模块表
class User extends Model {

    // 数据库层查询账号唯一性 登录校验
    static async verifyEmailPassword(email, plainPassword) {
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (!user) {
            throw new global.errs.AuthFailed('账号不存在')
        }

        // user.password === plainPassword  检验密码的一致性
        const correct = bcrypt.compareSync(plainPassword, user.password)
        if(!correct){
            throw new global.errs.AuthFailed('密码不正确')
        }
        return user
    }

    // wx登录业务
    static async getUserByOpenid(openid){
        const user = await User.findOne({
            where:{
                openid
            }
        })
        return user
    }

    // 通过openid注册
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
        unique: true   // 唯一性
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
    tableName: 'user'  // 表名称
})

// 导出模块，其他组件可调用库方法，和类方法
module.exports = {
    User
}

// 数据迁移 SQL 更新 风险