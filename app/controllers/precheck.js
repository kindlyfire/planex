const dateFormat = require('dateformat')

const createData = require('../tasks/solve/create_data')
const precheck = require('../tasks/solve/precheck')

module.exports = (s) => {
	const { Schedule } = s.models

	s.router.get('/api/actions/precheck', async (ctx, next) => {
		let scheduleId = ctx.query.schedule_id

		if (!scheduleId) {
			ctx.body = {
				status: 400,
				error: 'scheduleId not provided'
			}
			ctx.status = 400
			return
		}

		let schedule = await Schedule.findOne({ where: { id: scheduleId } })

		if (!schedule) {
			ctx.body = {
				status: 400,
				error: 'scheduleId not valid'
			}
			ctx.status = 400
			return
		}

		let solverData = await createData(s, schedule)
		let errors = await precheck(s, solverData)

		ctx.body = { data: errors }
	})
}
