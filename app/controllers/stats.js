module.exports = (s) => {
	const {
		Schedule,
		Teacher,
		ClassGroup,
		Class,
		Constraint,
		Exam,
		ExamInstance,
		Solution
	} = s.models

	s.router.get('/api/actions/stats', async (ctx, next) => {
		let scheduleId = ctx.query.schedule_id

		if (!scheduleId) {
			ctx.body = {
				status: 400,
				error: 'Schedule id missing'
			}
			ctx.status = 400
			return
		}

		let s = await Schedule.findOne({
			where: {
				id: scheduleId
			}
		})

		if (!s) {
			ctx.body = {
				status: 400,
				error: "Schedule doesn't exist"
			}
			ctx.status = 400
			return
		}

		let stats = await Promise.all([
			Teacher.count({ where: { schedule_id: scheduleId } }),
			ClassGroup.count({ where: { schedule_id: scheduleId } }),
			Class.count({ where: { schedule_id: scheduleId } }),
			Constraint.count({ where: { schedule_id: scheduleId } }),
			Exam.count({ where: { schedule_id: scheduleId } }),
			ExamInstance.count({
				include: [{ model: Exam, where: { schedule_id: scheduleId } }]
			}),
			Solution.count({ where: { schedule_id: scheduleId } })
		])

		ctx.body = {
			status: 200,
			data: {
				teachers: stats[0],
				classGroups: stats[1],
				classes: stats[2],
				constraints: stats[3],
				exams: stats[4],
				examInstances: stats[5],
				solutions: stats[6]
			}
		}
	})
}
