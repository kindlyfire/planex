const Sequelize = require('sequelize')

module.exports = (s) => {
	s.models.Teacher = s.db.define('teachers', {
		name: Sequelize.STRING,
		email: Sequelize.STRING,
		size: Sequelize.INTEGER,

		// An array of days each containing an array of periods of unavailability
		// WARN: Can not be consistent with schedule.days. Do not trust length
		availability_json: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: '[]'
		}
	})
}
