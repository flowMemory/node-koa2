const {Sequelize, Model} = require('sequelize')
const {sequelize} = require('../../core/db')

// 记录在排期的期刊数据

class Flow extends Model {
    static async findLatest() {
        const latest = await Flow.findOne({
            order: [
                ['index', 'DESC']
            ]
        })
        return latest
    }
}

// Fields 字段
const flwoSheetFields = {
    index: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER
}

Flow.init(flwoSheetFields, {sequelize, tableName: "flow"})

module.exports = {
    Flow
}