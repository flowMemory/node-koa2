const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
    static initCore(app){
        //入口方法
        InitManager.app = app
        InitManager.loadConfig()
        InitManager.initLoadRouters()
        // InitManager.loadHttpException()
    }

    static loadConfig(path = '') {
        const configPath = path || process.cwd() + '/config/config.js'
        const { serveConfig } = require(configPath)
        global.serveConfig = serveConfig
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