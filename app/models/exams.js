const Sequelize = require('sequelize')

module.exports = (s) => {
    s.models.Exam = s.db.define('exams', {
        name: Sequelize.STRING,
        length: Sequelize.INTEGER
    })
}
