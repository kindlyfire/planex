
let model = require('./model')

module.exports = (s) => {
    let schedule = model(s, {
        tableName: 'schedules'
    })

    s.models.schedule = schedule
}