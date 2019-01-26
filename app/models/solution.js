const Sequelize = require('sequelize')

module.exports = (s) => {
    s.models.Solution = s.db.define('solutions', {
        status: Sequelize.STRING,
        solution_data: Sequelize.STRING,
        solver_output: Sequelize.STRING,

        schedule_id: {
            type: Sequelize.INTEGER,
            references: {
                model: s.models.Schedule,
                key: 'id'
            }
        }
    })
}
