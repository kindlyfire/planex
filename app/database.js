const mysql = require('mysql2/promise')
const Sequelize = require('sequelize')

module.exports = async (s) => {
    const db = new Sequelize(
        s.config.mysql.database,
        s.config.mysql.user,
        s.config.mysql.password,
        {
            host: s.config.mysql.host,
            dialect: 'mysql',

            pool: {
                max: 5,
                min: 0
            },

            define: {
                underscored: true
            }
        }
    )

    await db.authenticate()

    return db
}
