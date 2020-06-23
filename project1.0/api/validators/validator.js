// 使用 validator  做路由参数检验
// validator 封装了路由参数的获取，可以通过validator直接获取路由的各种参数
// lin-validator 做了参数类型的转换 
// validtor 引用了http-exception 自动做错误处理
// 检验逻辑顺序：validator -> http-exception -> exception 
const { LinValidator, Rule } = require('../../core/lin-validator')

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

module.exports = {
    PositiveIntegerValidator
}