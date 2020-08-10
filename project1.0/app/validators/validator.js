// 使用 validator  做路由参数检验
// validator 封装了路由参数的获取，可以通过validator直接获取路由的各种参数
// lin-validator 做了参数类型的转换 
// validtor 引用了http-exception 自动做错误处理
// 检验逻辑顺序：validator -> http-exception -> exception 
const { LinValidator, Rule } = require('../../core/lin-validator-v2')
const { User } = require('../models/user')
const { LoginType, ArtType } = require('../lib/enum')

class PositiveIntegerValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isInt', '需要是正整数', {
                min: 1
            }),
        ]
    }
}

// 注册校验
class RegisterValidator extends LinValidator {
    constructor() {
        super()
        this.email = [
            new Rule('isEmail', '不符合Email规范')
        ]
        this.password1 = [
            // 用户指定范围 123456 $^
            new Rule('isLength', '密码至少6个字符，最多32个字符', {
                min: 6,
                max: 32
            }),
            new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')

        ]
        this.password2 = this.password1
        this.nickname = [
            new Rule('isLength', '昵称不符合长度规范', {
                min: 4,
                max: 32
            }),
        ]
    }

    validatePassword(vals) {
        const psw1 = vals.body.password1
        const psw2 = vals.body.password2
        if (psw1 !== psw2) {
            throw new Error('两个密码必须相同')
        }
    }

    async validateEmail(vals) {
        const email = vals.body.email
        // 向数据库查询
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (user) {
            throw new Error('email已存在')
        }
    }
}

// 登录接口
class TokenValidator extends LinValidator {
    constructor() {
        // 隐藏的错误
        // Java
        // JS Python 
        super()
        this.account = [
            new Rule('isLength', '不符合账号规则', {
                min: 4,
                max: 32
            })
        ]
        this.secret = [
            //    validator.js
            new Rule('isOptional'),
            new Rule('isLength', '至少6个字符', {
                min: 6,
                max: 128
            })
        ]

    }

    // 类下面的原型方式 --  这个方法会被自动执行吗？
    validateLoginType(vals) {
        if (!vals.body.type) {
            throw new Error('type是必须参数')
        }
        if (!LoginType.isThisType(vals.body.type)) {
            throw new Error('type参数不合法')
        }
    }
}

// 非空验证
class NotEmptyValidator extends LinValidator {
    constructor() {
        super()
        this.token = [
            new Rule('isLength', '不允许为空', {
                min: 1
            })
        ]
    }
}

// 检验期刊类型，并做int转型
function checkType(vals) {
    let type = vals.body.type || vals.path.type
    if (!type) {
        throw new Error('type是必须参数')
    }
    type = parseInt(type)

    if (!LoginType.isThisType(type)) {
        throw new Error('type参数不合法')
    }
}

function checkArtType(vals) {
    let type = vals.body.type || vals.path.type
    if (!type) {
        throw new Error('type是必须参数')
    }
    type = parseInt(type)

    if (!ArtType.isThisType(type)) {
        throw new Error('type参数不合法')
    }
}

// 采用类的方式兼容不同接口期刊传参的检验 - 不推荐（函数解耦）
class Checker {
    constructor(type) {
        this.enumType = type
    }

    check(vals) {
        let type = vals.body.type || vals.path.type
        if (!type) {
            throw new Error('type是必须参数')
        }
        type = parseInt(type)

        if (!this.enumType.isThisType(type)) {
            throw new Error('type参数不合法')
        }

    }
}


class LikeValidator extends PositiveIntegerValidator {
    constructor() {
        super()
        this.validateType = checkArtType
        // const checker = new Checker(ArtType)
        // this.validateType = checker.check.bind(checker)
    }
}

class ClassicValidator extends LikeValidator {

}


module.exports = {
    PositiveIntegerValidator,
    RegisterValidator,
    TokenValidator,
    NotEmptyValidator,
    ClassicValidator
}