//

// Precheck most common errors
//
//    * Teacher with too many hours (and no CAPMAX)
//    * Class with too many hours
//
module.exports = async (s, solverData) => {
	let errors = await Promise.all([
		...solverData.resources.map((r) => {
			if (r[0][0] === 't') {
				return checkTeacher(s, solverData, r[0])
			} else if (r[0][0] === 'c') {
				return checkClass(s, solverData, r[0])
			}
		})
	])

	errors = errors.filter((v) => !!v)

	return errors
}

const checkTeacher = async (s, solverData, teacherName) => {
	// Check if there is a capacity constraint for this teacher
	let hasCapConstraint =
		(solverData.constraints.cap || []).filter(
			(constraint) => constraint.resource === teacherName
		).length > 0

	// Count hours of exams
	let examHours = solverData.tasks
		.filter((task) => task.resources.includes(teacherName))
		.reduce((ret, task) => ret + task.length, 0)

	// Count hours that are blocked
	let blockedHours =
		solverData.blocks
			.filter((block) => block.resource === teacherName)
			.reduce((ret, block) => ret + block.length, 0) / 2

	if (!hasCapConstraint && examHours + blockedHours > solverData.horizon) {
		let teacher = await s.models.Teacher.findOne({
			where: { id: extractId(teacherName) }
		})

		return [
			`Le professeur <i>${
				teacher.name
			}</i> donne trop d'heures et n'a pas de contrainte de capacité.`,
			`${examHours} heure${
				examHours === 1 ? '' : 's'
			} d'examen à donner et ${blockedHours} heure${
				blockedHours === 1 ? '' : 's'
			} bloquée${blockedHours === 1 ? '' : 's'}, pour un maximum de ${
				solverData.horizon
			} heures.`
		]
	}
}

const checkClass = async (s, solverData, className) => {
	// Count hours of exams
	let examHours = solverData.tasks
		.filter((task) => task.resources.includes(className))
		.reduce((ret, task) => ret + task.length, 0)

	// Count hours that are blocked
	let blockedHours = solverData.blocks
		.filter((block) => block.resource === className)
		.reduce((ret, block) => ret + block.length, 0)

	if (examHours + blockedHours > solverData.horizon) {
		let cls = await s.models.Class.findOne({
			where: { id: extractId(className) },
			include: [s.models.ClassGroup]
		})

		return [
			`La classe <i>${cls['class-group'].name} (${
				cls.name
			})</i> a trop d'heures.`,
			`${examHours} heure${
				examHours === 1 ? '' : 's'
			} d'examen à recevoir et ${blockedHours} heure${
				blockedHours === 1 ? '' : 's'
			} bloquée${blockedHours === 1 ? '' : 's'}, pour un maximum de ${
				solverData.horizon
			} heure${solverData.horizon === 1 ? '' : 's'}.`
		]
	}
}

const extractId = (resourceName) => {
	let parts = resourceName.split('_')

	return parseInt(parts[parts.length - 1])
}
