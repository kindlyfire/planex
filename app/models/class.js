const Sequelize = require('sequelize')

module.exports = (s) => {
    s.models.Class = s.db.define('classes', {
        name: Sequelize.STRING,

        schedule_id: {
            type: Sequelize.INTEGER,
            references: {
                model: s.models.Schedule,
                key: 'id'
            }
        },

        group_id: {
            type: Sequelize.INTEGER,
            references: {
                model: s.models.ClassGroup,
                key: 'id'
            }
        },

        updated_date: Sequelize.DATE,
        created_date: Sequelize.DATE
    })
}
