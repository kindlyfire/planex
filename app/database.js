//
//     Connect database & load models
//

const Sequelize = require('sequelize')
const globby = require('globby')
const path = require('path')

module.exports = async (s) => {
	const db = new Sequelize(
		s.config.mysql.database,
		s.config.mysql.user,
		s.config.mysql.password,
		{
			host: s.config.mysql.host,
			dialect: 'mysql',

			pool: {
				max: 5,
				min: 0
			},

			define: {
				underscored: true
			},

			operatorsAliases: Sequelize.Op,
			logging: false
		}
	)

	await db.authenticate()
	await loadModels(db, s.models)

	return db
}

const loadModels = async (db, models) => {
	const files = await globby(path.join(__dirname, 'models'))
	const mods = files.map((f) => require(f))

	// Call install on all of them
	for (let mod of mods.filter((m) => typeof m.install === 'function')) {
		mod.install(db, models)
	}

	// Call associate on all of them
	for (let mod of mods.filter((m) => typeof m.associate === 'function')) {
		mod.associate(db, models)
	}

	return models
}
