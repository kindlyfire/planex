const Sequelize = require('sequelize')

module.exports = {
	install(db, m) {
		m.Class = db.define('classes', {
			name: Sequelize.STRING
		})
	},

	associate(db, m) {}
}
