const Sequelize = require('sequelize')

module.exports = {
	install(db, m) {
		m.ExamInstance = db.define(
			'exam-instances',
			{
				description: Sequelize.STRING,
				autoadd_classes: Sequelize.INTEGER,
				can_parallel: Sequelize.INTEGER
			},
			{
				tableName: 'exam_instances'
			}
		)
	}
}
