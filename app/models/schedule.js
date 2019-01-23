let model = require('./model')

module.exports = (s) => {
    let schedule = model(s, {
        tableName: 'schedules',
        emptyRow: {
            id: null,
            name: '',
            updated_date: '',
            created_date: ''
        }
    })

    s.models.schedule = schedule
}
