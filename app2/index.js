
const globby = require('globby')

let { app, router } = require('./server')
let database = require('./database')

module.exports = async (options) => {
    let App = require('./app')({
        options,
        app,
        router,
        db: database
    })

    let models = await globby([__dirname + '/models/**/*.js', '!' + __dirname + '/models/model.js'])
    for (model of models) {
        require(model)(s)
    }

    app.listen(3000)
    console.log('Listening on port ' + 3000)
}