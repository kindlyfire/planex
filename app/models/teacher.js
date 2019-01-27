const Sequelize = require('sequelize')

module.exports = (s) => {
    s.models.Teacher = s.db.define('teachers', {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        size: Sequelize.INTEGER
    })
}
