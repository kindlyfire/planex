
const mysql = require('mysql2/promise')

module.exports = async (s) => {
    const pool = mysql.createPool(s.config.mysql)

    let conn = await pool.getConnection()
    conn.release()

    return pool
}