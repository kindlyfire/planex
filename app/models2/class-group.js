let model = require('./model')

module.exports = (s) => {
    let classGroup = model(s, {
        tableName: 'class_groups',
        emptyRow: {
            id: null,
            schedule_id: null,

            name: '',

            updated_date: '',
            created_date: ''
        }
    })

    s.models.classGroup = classGroup
}
