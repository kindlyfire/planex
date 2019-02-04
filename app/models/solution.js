const Sequelize = require('sequelize')

module.exports = (s) => {
    s.models.Solution = s.db.define('solutions', {
        status: Sequelize.STRING,
        starred: Sequelize.INTEGER,
        solution_data: Sequelize.STRING,
        solver_output: Sequelize.STRING
    })
}
