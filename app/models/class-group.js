const Sequelize = require('sequelize')

module.exports = (s) => {
    s.models.ClassGroup = s.db.define(
        'class-groups',
        {
            name: Sequelize.STRING,

            schedule_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: s.models.Schedule,
                    key: 'id'
                }
            }
        },
        {
            tableName: 'class_groups'
        }
    )
}
