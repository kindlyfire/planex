const Sequelize = require('sequelize')

module.exports = (s) => {
	s.models.Constraint = s.db.define('constraints', {
		type: Sequelize.STRING,
		data_json: Sequelize.STRING
	})
}
