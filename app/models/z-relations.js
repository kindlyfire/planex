module.exports = (s) => {
    let m = s.models

    console.log(Object.keys(m))

    m.Class.belongsTo(m.Schedule)
    m.Class.belongsTo(m.ClassGroup, { foreignKey: 'group_id' })

    m.ClassGroup.belongsTo(m.Schedule)
    m.ClassGroup.belongsToMany(m.Exam, {
        through: 'exams_class_groups',
        foreignKey: 'group_id'
    })
    m.ClassGroup.hasMany(m.Class, {
        foreignKey: 'group_id'
    })

    m.Exam.belongsTo(m.Schedule)
    m.Exam.belongsToMany(m.ClassGroup, {
        through: 'exams_class_groups',
        otherKey: 'group_id'
    })

    m.Teacher.belongsTo(m.Schedule)
}
