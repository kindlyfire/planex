let model = require('./model')

module.exports = (s) => {
    let teacher = model(s, {
        tableName: 'teachers',
        emptyRow: {
            id: null,
            schedule_id: null,

            name: '',
            email: '',
            size: 1,

            updated_date: '',
            created_date: ''
        },
        validate: {
            name() {}
        }
    })

    s.models.teacher = teacher
}
