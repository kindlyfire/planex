const Sequelize = require('sequelize')

module.exports = (s) => {
    s.models.ClassGroup = s.db.define('class_groups', {
        name: Sequelize.STRING,

        schedule_id: {
            type: Sequelize.INTEGER,
            references: {
                model: s.models.Schedule,
                key: 'id'
            }
        },

        updated_date: Sequelize.DATE,
        created_date: Sequelize.DATE
    })
}
