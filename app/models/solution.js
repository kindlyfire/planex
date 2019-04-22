const Sequelize = require('sequelize')

module.exports = {
	install(db, m) {
		m.Solution = db.define('solutions', {
			name: Sequelize.STRING,
			status: Sequelize.STRING,
			starred: Sequelize.INTEGER,
			solution_data: Sequelize.STRING,
			solver_output: Sequelize.STRING,

			// Number of days in the schedule
			// Needed to make the solution self-sufficient
			days: Sequelize.INTEGER
		})
	}
}
