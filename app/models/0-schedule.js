const Sequelize = require('sequelize')

module.exports = (s) => {
    s.models.Schedule = s.db.define('schedule', {
        name: Sequelize.STRING
    })
}
