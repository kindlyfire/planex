const Sequelize = require('sequelize')

module.exports = (s) => {
    s.models.Teacher = s.db.define('teachers', {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        size: Sequelize.INTEGER,

        schedule_id: {
            type: Sequelize.INTEGER,
            references: {
                model: s.models.Schedule,
                key: 'id'
            }
        }
    })
}
