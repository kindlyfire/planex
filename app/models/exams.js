const Sequelize = require('sequelize')

module.exports = {
	install(db, m) {
		m.Exam = db.define('exams', {
			name: Sequelize.STRING,
			length: Sequelize.INTEGER,
			can_parallel: Sequelize.INTEGER
		})
	}
}
