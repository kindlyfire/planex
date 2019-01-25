const globby = require('globby')

let s = require('./server')
let database = require('./database')

module.exports = async (config) => {
    s.config = config
    s.db = await database(s)
    s.models = {}
    s.model = (name) => s.models[name]

    let autoloadDirectories = ['models', 'middleware', 'controllers']

    for (let dir of autoloadDirectories) {
        let files = await globby(__dirname + '/' + dir + '/**/*.js')

        for (let file of files) {
            require(file)(s)
        }
    }

    s.app.listen(3000)

    console.log('Listening on http://localhost:' + 3000 + '/')
}
