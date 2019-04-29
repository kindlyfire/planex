const Sequelize = require('sequelize')

module.exports = {
	install(db, m) {
		m.Constraint = db.define('constraints', {
			type: Sequelize.STRING,
			data_json: Sequelize.STRING
		})
	}
}
