const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
    static initCore(app){
        //入口方法
        InitManager.app = app
        InitManager.initLoadRouters()
        // InitManager.loadHttpException()
    }

    // 自动注册路由
    static initLoadRouters(){
        const apiDirectory = `${process.cwd()}/api`
        requireDirectory(module, apiDirectory, {
            visit: whenLoadModule
        })
        
        function whenLoadModule(obj) {
            if(obj instanceof Router ){
                InitManager.app.use(obj.routes())
            }
        }
    }

    // static loadHttpException(){
    //     const errors = require('./http-exception')
    //     global.errs = errors
    // }
}

module.exports = InitManager