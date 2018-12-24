
let model = require('./model')

module.exports = (s) => {
    let solution = model(s, {
        tableName: 'solutions',
        emptyRow: {
            id: null,
            schedule_id: null,
            status: '',
            solution_data: '',
            solver_output: '',
            
            updated_date: '',
            created_date: ''
        }
    })

    s.models.solution = solution
}