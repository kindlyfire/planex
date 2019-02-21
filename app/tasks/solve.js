//
// Code to run the solver, parse output, save solution
const chalk = require('chalk')
const tempWrite = require('temp-write')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

module.exports = async (s, schedule, sol) => {
	try {
		let solverData = {
			horizon: schedule.days * 4,
			resources: [],
			tasks: [],
			blocks: [],
			constraints: {
				sync: [],
				cap: []
			}
		}

		let defaultTags = {
			t_task: 1
		}

		//
		// Add all resources
		//

		// Teachers
		let teachers = await s.models.Teacher.findAll({
			where: { schedule_id: schedule.id }
		})

		for (let t of teachers) {
			solverData.resources.push(['teacher_' + t.id, 1])

			// Add blocks
			try {
				let blocksByDay = JSON.parse(t.availability_json)

				for (const [i, day] of blocksByDay.entries()) {
					for (let block of day) {
						// @TODO: Continuity dedupe
						//        (a 4-hour long block could be one block of length 4 instead of 4 blocks of length 1)
						solverData.blocks.push({
							resource: 'teacher_' + t.id,
							start: 4 * parseInt(i) + block,
							length: 1
						})
					}
				}
			} catch (e) {
				console.error(e)
			}
		}

		// Classes and class groups
		let classGroups = await s.models.ClassGroup.findAll({
			where: { schedule_id: schedule.id },
			include: [s.models.Class]
		})

		for (let cg of classGroups) {
			for (let cls of cg.classes) {
				solverData.resources.push(['class_' + cls.id, 1])

				// Add blocks
				try {
					let blocksByDay = JSON.parse(cg.availability_json)

					for (const [i, day] of blocksByDay.entries()) {
						for (let block of day) {
							// @TODO: Continuity dedupe
							//        (a 4-hour long block could be one block of length 4 instead of 4 blocks of length 1)
							solverData.blocks.push({
								resource: 'class_' + cls.id,
								start: 4 * parseInt(i) + block,
								length: 1
							})
						}
					}
				} catch (e) {
					console.error(e)
				}
			}
		}

		//
		// Add tasks

		// Add exams
		let exams = await s.models.Exam.findAll({
			where: { schedule_id: schedule.id },
			include: [
				{
					model: s.models.ExamInstance,
					include: [
						s.models.ClassGroup,
						s.models.Class,
						s.models.Teacher,
						s.models.Constraint
					]
				}
			]
		})

		for (let exam of exams) {
			for (let inst of exam['exam-instances']) {
				let positionConstraint = inst.constraints.find(
					(c) => c.type === 'position'
				)

				let forcedPeriod = -1

				if (positionConstraint) {
					let d = JSON.parse(positionConstraint.data_json)

					if (d.startTime.length === 2) {
						forcedPeriod = d.startTime[0] * 4 + d.startTime[1]
					}
				}

				solverData.tasks.push({
					label: 'exam_instance_' + inst.id,
					length: exam.length,
					tags: {
						['group_' + inst['class-group'].id]: 1
					},
					resources: [
						...inst.teachers.map((t) => {
							return 'teacher_' + t.id
						}),
						...inst.classes.map((c) => {
							return 'class_' + c.id
						})
					],
					period: forcedPeriod,

					// Not used by solver
					// Used when adding CAP constraints
					groupId: inst['class-group'].id
				})
			}
		}

		//
		// Add constraints

		// Sync constraint
		let syncContraints = await s.models.Constraint.findAll({
			where: {
				schedule_id: schedule.id,
				type: 'sync'
			}
		})

		for (let c of syncContraints) {
			try {
				let json = JSON.parse(c.data_json)

				if (json.selectedInstance1 && json.selectedInstance2) {
					solverData.constraints.sync.push({
						tasks: [
							'exam_instance_' + json.selectedInstance1,
							'exam_instance_' + json.selectedInstance2
						]
					})

					// Check if there are teachers in common
					// Automatically add CAPMAX constraint
					let ins = [
						solverData.tasks.find(
							(i) =>
								i.label ===
								'exam_instance_' + json.selectedInstance1
						),
						solverData.tasks.find(
							(i) =>
								i.label ===
								'exam_instance_' + json.selectedInstance2
						)
					]

					if (ins[0] && ins[1]) {
						let teachersInCommon = ins[0].resources
							.filter(
								Set.prototype.has,
								new Set(ins[1].resources)
							)
							.filter((r) => r[0] === 't')

						for (let t of teachersInCommon) {
							solverData.resources.find((r) => r[0] === t)[1] = 2
							solverData.constraints.cap.push({
								resource: t,
								tags: [
									'constraint_' + c.id + '_int',
									'constraint_' + c.id + '_ext'
								],
								max: 1
							})
						}

						defaultTags['constraint_' + c.id + '_ext'] = 1

						ins[0].tags['constraint_' + c.id + '_int'] = 1
						ins[0].tags['constraint_' + c.id + '_ext'] = 0

						ins[1].tags['constraint_' + c.id + '_int'] = 1
						ins[1].tags['constraint_' + c.id + '_ext'] = 0
					}
				}
			} catch (e) {
				console.error(e)
			}
		}

		//
		// Cap constraints

		let capConstraints = await s.models.Constraint.findAll({
			where: {
				schedule_id: schedule.id,
				type: 'capacity'
			}
		})

		for (let c of capConstraints) {
			try {
				let json = JSON.parse(c.data_json)

				if (json.teacherId && json.groups) {
					let teacher = solverData.resources.find(
						(t) => t[0] === 'teacher_' + json.teacherId
					)

					// Increment teacher size by one
					teacher[1] += 1

					solverData.constraints.cap.push({
						resource: t,
						tags: [
							'constraint_' + c.id + '_int',
							'constraint_' + c.id + '_ext'
						],
						max: 1
					})

					let examInstances = solverData.tasks.filter((t) =>
						json.groups.includes(t.groupId)
					)

					defaultTags['constraint_' + c.id + '_ext'] = 1

					for (let ins of examInstances) {
						ins.tags['constraint_' + c.id + '_int'] = 1
						ins.tags['constraint_' + c.id + '_ext'] = 0
					}
				}
			} catch (e) {
				console.error(e)
			}
		}

		for (let t of solverData.tasks) {
			t.tags = {
				...defaultTags,
				...t.tags
			}
		}

		console.log(JSON.stringify(solverData))

		//
		// Run solver
		let dataFile = await tempWrite(JSON.stringify(solverData))
		let output = ''

		let solver = spawn('python', [
			'-B',
			path.join(__dirname, '../../solver/main.py'),
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
								class: { name: '' },
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
