const Sequelize = require('sequelize')

module.exports = (s) => {
    s.models.Class = s.db.define('classes', {
        name: Sequelize.STRING
    })
}
