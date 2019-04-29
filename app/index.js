const globby = require('globby')
const chalk = require('chalk')

let s = require('./server')
let database = require('./database')
let api = require('./api')

module.exports = async (config) => {
	s.config = config
	s.models = {}
	s.model = (name) => s.models[name]

	s.db = await database(s)
	console.log(chalk`{yellow [INIT] Connected to database}`)

	let autoloadDirectories = ['middleware', 'controllers']

	for (let dir of autoloadDirectories) {
		let files = await globby(__dirname + '/' + dir + '/**/*.js')
		for (let file of files) {
			await require(file)(s)
		}

		console.log(
			chalk`{yellow [INIT] Loaded ${files.length} file${
				files.length === 1 ? ' ' : 's'
			} from directory /app/${dir}}`
		)
	}

	api({
		prefix: '/api',
		router: s.router,
		models: s.models
	})

	s.app.listen(3000)

	console.log(
		chalk`{yellow [INIT] Listening at} {white http://localhost:${3000}/}\n`
	)
}
