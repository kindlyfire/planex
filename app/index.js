const globby = require('globby')

let s = require('./server')
let database = require('./database')

module.exports = async (config) => {
    s.config = config
    s.db = await database(s)
    s.models = {}
    s.model = (name) => s.models[name]

    let models = await globby([
        __dirname + '/models/**/*.js',
        '!' + __dirname + '/models/model.js'
    ])
    for (model of models) {
        require(model)(s)
    }

    let controllers = await globby(__dirname + '/middleware/**/*.js')
    for (controller of controllers) {
        require(controller)(s)
    }

    controllers = await globby(__dirname + '/controllers/**/*.js')
    for (controller of controllers) {
        require(controller)(s)
    }

    s.app.listen(3000)
    console.log('Listening on http://localhost:' + 3000 + '/')
}
