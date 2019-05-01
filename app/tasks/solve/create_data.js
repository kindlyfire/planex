//

const objFilter = (obj, predicate) => {
	let res = {}

	for (let key in obj) {
		if (obj.hasOwnProperty(key) && predicate(obj[key], key)) {
			res[key] = obj[key]
		}
	}

	return res
}

module.exports = async (s, schedule) => {
	let solverData = {
		horizon: schedule.days * 4,
		resources: [],
		tasks: [],
		blocks: [],
		sblocks: [],
		constraints: {
			sync: [],
			cap: []
		}
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
					let obj = {
						resource: 'teacher_' + t.id,
						start: 4 * parseInt(i) + block,
						length: 1
					}

					solverData.blocks.push(obj)
				}
			}
		} catch (e) {
			console.error(e)
		}

		// Add a line of sblocks
		// for (let i = 0; i < schedule.days; i++) {
		// 	solverData.sblocks.push({
		// 		resource: 'teacher_' + t.id,
		// 		start: i * 4,
		// 		length: 4,
		// 		cost: -10
		// 	})
		// }
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
						solverData.blocks.push({
							resource: 'class_' + cls.id,
							start: 4 * parseInt(i) + block
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

			let blockValue = exam.length

			if (
				inst.can_parallel === 1 ||
				(inst.can_parallel === 0 && exam.can_parallel === 1)
			) {
				console.log(
					'Parallel: ' +
						`${exam.name} for ${inst['class-group'].name}`
				)

				blockValue = blockValue / 2

				if (
					!solverData.constraints.cap.includes(
						'group_' + inst['class-group'].id
					)
				) {
					solverData.constraints.cap.push(
						'group_' + inst['class-group'].id
					)
				}
			}

			solverData.tasks.push({
				label: 'exam_instance_' + inst.id,
				length: exam.length,
				tags: {
					['group_' + inst['class-group'].id]: 1,
					block_value: blockValue
				},
				resources: [
					...inst.teachers.map((t) => 'teacher_' + t.id),
					...inst.classes.map((c) => 'class_' + c.id)
				],
				period: forcedPeriod,

				// Not used by solver
				// Used when adding CAP constraints
				groupId: inst['class-group'].id
			})

			// defaultTags['group_' + inst['class-group'].id] = 0
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
					ins[0].tags['block_value'] = ins[0].length / 2
					ins[1].tags['block_value'] = ins[1].length / 2

					solverData.constraints.sync.push({
						tasks: [
							'exam_instance_' + json.selectedInstance1,
							'exam_instance_' + json.selectedInstance2
						]
					})

					// Check if there are teachers in common
					// Automatically add CAPMAX constraint
					// let teachersInCommon = ins[0].resources
					// 	.filter(Set.prototype.has, new Set(ins[1].resources))
					// 	.filter((r) => r[0] === 't')

					// for (let t of teachersInCommon) {
					// 	solverData.resources.find((r) => r[0] === t)[1] = 2

					// 	solverData.constraints.cap.push({
					// 		resource: t,
					// 		tags: [
					// 			'constraint_' + c.id + '_int',
					// 			'constraint_' + c.id + '_ext'
					// 		],
					// 		max: 1,
					// 		capSum: {
					// 			['constraint_' + c.id + '_int']: 1
					// 		}
					// 	})
					// }

					// defaultTags['constraint_' + c.id + '_ext'] = 1

					// ins[0].tags['constraint_' + c.id + '_int'] = 1
					// ins[0].tags['constraint_' + c.id + '_ext'] = 0

					// ins[1].tags['constraint_' + c.id + '_int'] = 1
					// ins[1].tags['constraint_' + c.id + '_ext'] = 0
				}
			}
		} catch (e) {
			console.error(e)
		}
	}

	//
	// Cap constraints

	// let capConstraints = await s.models.Constraint.findAll({
	// 	where: {
	// 		schedule_id: schedule.id,
	// 		type: 'capacity'
	// 	}
	// })

	// for (let c of capConstraints) {
	// 	try {
	// 		let json = JSON.parse(c.data_json)

	// 		if (json.teacherId && json.groups) {
	// 			let teacher = solverData.resources.find(
	// 				(t) => t[0] === 'teacher_' + json.teacherId
	// 			)

	// 			// Increment teacher size by one
	// 			teacher[1] += 1

	// 			solverData.constraints.cap.push({
	// 				resource: teacher[0],
	// 				tags: [
	// 					'constraint_' + c.id + '_int',
	// 					'constraint_' + c.id + '_ext'
	// 				],
	// 				max: 1,
	// 				capSum: {
	// 					['constraint_' + c.id + '_int']: 1
	// 				}
	// 			})

	// 			let examInstances = solverData.tasks.filter((t) =>
	// 				json.groups.includes(t.groupId)
	// 			)

	// 			defaultTags['constraint_' + c.id + '_ext'] = 1

	// 			for (let ins of examInstances) {
	// 				ins.tags['constraint_' + c.id + '_int'] = 1
	// 				ins.tags['constraint_' + c.id + '_ext'] = 0
	// 			}
	// 		}
	// 	} catch (e) {
	// 		console.error(e)
	// 	}
	// }

	// for (let t of solverData.tasks) {
	// 	// If the task is part of a CAP constraint
	// 	// Make it unaffected by other cap constraints
	// 	if (
	// 		Object.keys(
	// 			objFilter(t.tags || {}, (_, tag) => tag.endsWith('_int'))
	// 		).length &&
	// 		false
	// 	) {
	// 		t.tags = {
	// 			...objFilter(defaultTags, (_, tag) => !tag.endsWith('_ext')),
	// 			...t.tags
	// 		}
	// 	} else {
	// 		t.tags = {
	// 			// ...defaultTags,
	// 			...t.tags
	// 		}
	// 	}
	// }

	return solverData
}
