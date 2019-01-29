const chalk = require('chalk')

const err = (msg) => console.log(chalk`{red [ERR]} ${msg}`)
let config

// Try to load configuration file
// Graceful quit on error
try {
    config = require('./config')
} catch (e) {
    err('Could not load config file config.js')
    err(
        'Please create file config.js from template config.default.js and fill in correctly'
    )

    // Quit
    return
}

require('./app')(config)
