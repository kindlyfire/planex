const dateFormat = require('dateformat')

const solve = require('../tasks/solve')

module.exports = (s) => {
	const { Schedule, Solution } = s.models

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

		// Delete old not-starred solutions
		await Solution.destroy({
			where: {
				starred: 0
			}
		})

		// Create new solution
		let sol = await Solution.create({
			schedule_id: schedule.id,
			status: 'running',
			name:
				'Solution du ' +
				dateFormat(new Date(), "yyyy-mm-dd' à 'HH:MM:ss")
		})

		// Call solver
		solve(s, schedule, sol)

		ctx.body = { data: sol }
	})
}
