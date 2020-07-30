const {Sequelize, Model} = require('sequelize')
const {sequelize} = require('../../core/db')

// 典型的业务实体表

// 表共用字段
const classicFields = {
    image: {
        type:Sequelize.STRING,
    },
    content: Sequelize.STRING,
    pubdate: Sequelize.DATEONLY,
    fav_nums: {
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    title: Sequelize.STRING,
    type: Sequelize.TINYINT,
}

// 初始化表模型 - music
class Music extends Model {

}
const musicFields = Object.assign({ url: Sequelize.STRING }, classicFields)
Music.init(musicFields, {sequelize, tableName: 'music'})


// 初始化表模型 - movic
class Movie extends Model {

}
Movie.init(classicFields, {sequelize, tableName: 'movie'})


// 初始化表模型 - music
class Sentence extends Model {

}
Sentence.init(classicFields, {sequelize, tableName: 'sentence'})

module.exports = {
    Music,
    Movie,
    Sentence
}