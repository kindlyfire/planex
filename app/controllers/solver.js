const dateFormat = require('dateformat')

const { solve } = require('../tasks/solve')

module.exports = (s) => {
	const { Schedule, Solution } = s.models

	const solve = async (schedule) => {}

	s.router.post('/api/actions/start_solver', async (ctx, next) => {
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

		let sol = await Solution.create({
			schedule_id: schedule.id,
			status: 'running',
			name:
				'Solution du ' +
				dateFormat(new Date(), "yyyy-mm-dd' à 'HH:MM:ss")
		})

		ctx.body = { data: sol }

		// Call solver
		solve(s, schedule, sol)
	})
}
