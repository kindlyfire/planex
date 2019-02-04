const Sequelize = require('sequelize')

module.exports = (s) => {
    s.models.Schedule = s.db.define('schedule', {
        name: Sequelize.STRING,

        // 1 = monday, 5 = friday
        start_day: Sequelize.INTEGER,

        // Number of days in the schedule
        days: Sequelize.INTEGER
    })
}
