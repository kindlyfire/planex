//
// Code to run the solver, parse output, save solution
const chalk = require('chalk')
const tempWrite = require('temp-write')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const createData = require('./create_data')

module.exports = async (s, schedule, sol) => {
	try {
		let solverData = await createData(s, schedule, sol)
		console.log(JSON.stringify(solverData))

		//
		// Run solver
		let dataFile = await tempWrite(JSON.stringify(solverData))
		let output = ''

		let solver = spawn('python', [
			'-B',
			path.join(__dirname, '../../../solver/main.py'),
			dataFile
		])

		solver.stdout.on('data', (data) => {
			console.log(data.toString('utf-8'))
			output += data.toString('utf-8')
		})

		solver.stderr.on('data', (data) => {
			console.log(data.toString('utf-8'))
			output += data.toString('utf-8')
		})

		solver.on('exit', async (code, signal) => {
			sol.solution_data = await new Promise((resolve, reject) => {
				fs.readFile(dataFile, { encoding: 'utf-8' }, (err, data) => {
					if (err) reject(err)
					else resolve(data)
				})
			})

			let data = JSON.parse(sol.solution_data)

			if (data.error !== undefined) {
				sol.solver_output = output
				sol.status = 'error'
				await sol.save()
				return
			} else {
				sol.status = 'completed'
			}

			// Parse solution
			let solutionData = {
				classGroups: {},
				teachers: {}
			}

			let classes = await s.models.Class.findAll({
				where: {
					schedule_id: schedule.id
				},
				include: [s.models.ClassGroup]
			})
			let teachers = await s.models.Teacher.findAll({
				where: {
					schedule_id: schedule.id
				}
			})
			let examInstances = await s.models.ExamInstance.findAll({
				include: [
					{
						model: s.models.Exam,
						where: {
							schedule_id: schedule.id
						}
					},
					s.models.Teacher,
					s.models.ClassGroup,
					s.models.Class
				]
			})

			for (let clsSlug of Object.keys(data.data.classes)) {
				let cls = classes.find((c) => clsSlug === 'class_' + c.id)
				let group = cls['class-group']

				// Add group if not already present
				if (
					Object.keys(solutionData.classGroups).indexOf(
						'' + group.id
					) === -1
				) {
					solutionData.classGroups[group.id] = {
						group: { name: group.name },

						// classes: [ { class: { name: '' }, periods: [[...], [...], ...] } ]
						classes: []
					}
				}

				let storedGroup = solutionData.classGroups[group.id]
				let storedClass = storedGroup.classes.find(
					(entry) => entry.class.id === cls.id
				)

				// Add class if not already in
				if (!storedClass) {
					storedClass = {
						class: { name: cls.name },
						schedule: new Array(schedule.days)
							.fill()
							.map((e) => new Array(4).fill().map((e) => []))
					}

					storedGroup.classes.push(storedClass)
				}

				let days = Object.keys(data.data.classes[clsSlug])

				for (let day of days) {
					for (let exam of data.data.classes[clsSlug][day]) {
						let examInstance = examInstances.find(
							(ei) => 'exam_instance_' + ei.id === exam.label
						)

						for (
							let i = exam.start_hour;
							i < exam.start_hour + exam.length;
							i += 1
						) {
							storedClass.schedule[parseInt(day)][i] = {
								// examInstance,
								exam: { name: examInstance.exam.name },
								teachers: examInstance.teachers.map((t) => {
									return {
										id: t.id,
										name: t.name
									}
								})
							}
						}
					}
				}

				// Blocked periods
				try {
					let blockedByDay = JSON.parse(group.availability_json)

					for (const [i, day] of blockedByDay.entries()) {
						for (let p of day) {
							storedClass.schedule[parseInt(i)][p - 1] = {
								blocked: true
							}
						}
					}
				} catch (e) {
					console.error(e)
				}
			}

			// Populate exams for teachers from the exams given to class groups
			for (let teacherSlug of Object.keys(data.data.teachers)) {
				if (!solutionData.teachers[teacherSlug]) {
					solutionData.teachers[teacherSlug] = {
						name: teachers.find(
							(t) => 'teacher_' + t.id === teacherSlug
						).name,
						classes: []
					}
				}

				for (let exam of data.data.teachers[teacherSlug]) {
					let examInstance = examInstances.find(
						(ei) => 'exam_instance_' + ei.id === exam.label
					)

					for (let i = 0; i < exam.length; i += 1) {
						let j = 0

						while (
							solutionData.teachers[teacherSlug].classes[j] &&
							solutionData.teachers[teacherSlug].classes[j]
								.schedule[exam.day][exam.start_hour + i]
						) {
							j += 1
						}

						if (!solutionData.teachers[teacherSlug].classes[j]) {
							solutionData.teachers[teacherSlug].classes[j] = {
								class: { name: '' + (j + 1) },
								schedule: new Array(schedule.days)
									.fill()
									.map((e) =>
										new Array(4).fill().map((e) => {})
									)
							}
						}

						solutionData.teachers[teacherSlug].classes[j].schedule[
							exam.day
						][exam.start_hour + i] = {
							exam: { name: examInstance.exam.name },
							teachers: [
								{
									name: `${
										examInstance['class-group'].name
									} (${examInstance.classes
										.map((c) => c.name)
										.join(', ')})`
								}
							]
						}
					}
				}
			}

			// Convert object with ids to arrays
			solutionData.classGroups = Object.values(solutionData.classGroups)
			solutionData.teachers = Object.values(solutionData.teachers)

			sol.solution_data = JSON.stringify(solutionData)

			await sol.save()
		})
	} catch (e) {
		console.log(
			chalk`{red [ERR]} Solving schedule "${schedule.name}" failed`
		)
		console.log(e)

		sol.status = 'error'
		sol.solver_output = 'Error: ' + e
		await sol.save()
	}
}
