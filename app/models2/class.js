let model = require('./model')

module.exports = (s) => {
    let cls = model(s, {
        tableName: 'classes',
        emptyRow: {
            id: null,
            schedule_id: null,

            name: '',

            updated_date: '',
            created_date: ''
        }
    })

    s.models.class = cls
}
