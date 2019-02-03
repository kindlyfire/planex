const Sequelize = require('sequelize')

module.exports = (s) => {
    s.models.ExamInstance = s.db.define(
        'exam-instances',
        {
            description: Sequelize.STRING,
            autoadd_classes: Sequelize.INTEGER
        },
        {
            tableName: 'exam_instances'
        }
    )
}
