//
// Duplicate a schedule on the API
module.exports = (s) => {
	const {
		Schedule,
		ClassGroup,
		Class,
		Teacher,
		Exam,
		ExamInstance
	} = s.models

	const raw = (res, deleteId = false) => {
		res = JSON.parse(JSON.stringify(res))

		if (deleteId && Object.keys(res).includes('id')) {
			delete res.id
		}

		return res
	}

	s.router.post('/api/actions/duplicate-schedule/:id', async (ctx, next) => {
		let scheduleId = ctx.params.id

		let schedule = await Schedule.findOne({
			where: {
				id: scheduleId
			}
		})
		schedule = raw(schedule, true)
		schedule.name = ctx.query.name

		let newSchedule = await Schedule.create(schedule)
		let idMap = {
			classGroups: {},
			classes: {},
			teachers: {},
			exams: {},
			examInstances: {}
		}
		let oldResources = {}

		//
		// Duplicate all resources
		//

		// Class groups
		oldResources.classGroups = await ClassGroup.findAll({
			where: {
				schedule_id: scheduleId
			},
			include: [Class]
		})

		for (let oldCg of oldResources.classGroups) {
			let newCg = await ClassGroup.build(raw(oldCg, true))
			newCg.schedule_id = newSchedule.id
			await newCg.save()

			idMap.classGroups[oldCg.id] = newCg.id

			for (let oldCls of oldCg.classes) {
				let newCls = Class.build(raw(oldCls, true))
				newCls.schedule_id = newSchedule.id
				newCls.group_id = newCg.id
				await newCls.save()
				idMap.classes[oldCls.id] = newCls.id
			}
		}

		// Teachers
		oldResources.teachers = await Teacher.findAll({
			where: {
				schedule_id: scheduleId
			}
		})

		for (let oldTeacher of oldResources.teachers) {
			let newTeacher = Teacher.build(raw(oldTeacher, true))
			newTeacher.schedule_id = newSchedule.id
			await newTeacher.save()

			idMap.teachers[oldTeacher.id] = newTeacher.id
		}

		// Exams
		oldResources.exams = await Exam.findAll({
			where: {
				schedule_id: scheduleId
			}
		})

		for (let oldExam of oldResources.exams) {
			let newExam = Exam.build(raw(oldExam, true))
			newExam.schedule_id = newSchedule.id
			await newExam.save()

			idMap.exams[oldExam.id] = newExam.id
		}

		// Exam instances
		oldResources.examInstances = await ExamInstance.findAll({
			include: [
				Teacher,
				Class,
				{
					model: Exam,
					where: {
						schedule_id: scheduleId
					}
				}
			]
		})

		for (let oldInstance of oldResources.examInstances) {
			let newInstance = ExamInstance.build(raw(oldInstance, true))
			newInstance.exam_id = idMap.exams[oldInstance.exam_id]
			newInstance.group_id = idMap.classGroups[oldInstance.group_id]
			await newInstance.save()

			await newInstance.setTeachers(
				oldInstance.teachers.map((t) => {
					return idMap.teachers[t.id]
				})
			)

			await newInstance.setClasses(
				oldInstance.classes.map((c) => {
					return idMap.classes[c.id]
				})
			)

			await newInstance.save()
		}

		ctx.status = 200
		ctx.body = {
			data: newSchedule
		}
	})
}
