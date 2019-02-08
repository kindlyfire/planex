module.exports = async (s) => {
	// Wait a little
	// Lets all models load
	await new Promise((resolve) => setTimeout(resolve, 500))

	let m = s.models

	m.Class.belongsTo(m.Schedule)
	m.Class.belongsTo(m.ClassGroup, { foreignKey: 'group_id' })
	m.Class.belongsToMany(m.ExamInstance, {
		through: 'exam_instances_classes',
		otherKey: 'exam_instance_id'
	})

	m.ClassGroup.belongsTo(m.Schedule)
	m.ClassGroup.belongsToMany(m.Exam, {
		through: 'exams_class_groups',
		foreignKey: 'group_id'
	})
	m.ClassGroup.hasMany(m.ExamInstance, {
		foreignKey: 'group_id'
	})
	m.ClassGroup.hasMany(m.Class, {
		foreignKey: 'group_id'
	})

	m.Exam.belongsTo(m.Schedule)
	m.Exam.hasMany(m.ExamInstance)

	m.ExamInstance.belongsTo(m.Exam)
	m.ExamInstance.belongsTo(m.ClassGroup, {
		foreignKey: 'group_id'
	})
	m.ExamInstance.belongsToMany(m.Class, {
		through: 'exam_instances_classes',
		foreignKey: 'exam_instance_id'
	})
	m.ExamInstance.belongsToMany(m.Teacher, {
		through: 'exam_instances_teachers',
		otherKey: 'teacher_id',
		foreignKey: 'exam_instance_id'
	})
	m.ExamInstance.belongsToMany(m.Constraint, {
		through: 'constraints_exam_instances',
		otherKey: 'constraint_id',
		foreignKey: 'exam_instance_id'
	})

	m.Teacher.belongsTo(m.Schedule)
	m.Teacher.belongsToMany(m.ExamInstance, {
		through: 'exam_instances_teachers',
		otherKey: 'exam_instance_id',
		foreignKey: 'teacher_id'
	})
	m.Teacher.belongsToMany(m.Constraint, {
		through: 'constraints_teachers',
		otherKey: 'constraint_id',
		foreignKey: 'teacher_id'
	})

	m.Solution.belongsTo(m.Schedule)

	m.Constraint.belongsTo(m.Schedule)
	m.Constraint.belongsToMany(m.ExamInstance, {
		through: 'constraints_exam_instances',
		otherKey: 'exam_instance_id',
		foreignKey: 'constraint_id'
	})
	m.Constraint.belongsToMany(m.Teacher, {
		through: 'constraints_teachers',
		otherKey: 'teacher_id',
		foreignKey: 'constraint_id'
	})
}
