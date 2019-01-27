const Sequelize = require('sequelize')

module.exports = (s) => {
    s.models.ClassGroup = s.db.define(
        'class-groups',
        {
            name: Sequelize.STRING
        },
        {
            tableName: 'class_groups'
        }
    )
}
