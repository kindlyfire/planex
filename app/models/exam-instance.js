const Sequelize = require('sequelize')

module.exports = (s) => {
    s.models.ExamInstance = s.db.define(
        'exam-instances',
        {
            description: Sequelize.STRING
        },
        {
            tableName: 'exam_instances'
        }
    )
}
