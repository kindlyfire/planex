module.exports = (s) => {
    const Teacher = s.model('teacher')

    // Schedule teachers
    s.router.get('/api/schedule/teachers', async (ctx, next) => {
        let teachers = await Teacher.find(
            'schedule_id = ?',
            ctx.state.schedule.id
        )

        ctx.body = {
            status: 200,
            data: teachers
        }
    })

    // Schedule teachers
    s.router.post('/api/schedule/teachers', async (ctx, next) => {
        let teacherData = ctx.request.body.teacher

        if (!teacherData) {
            ctx.body = {
                status: 400,
                error: 'Teacher is not supplied'
            }
            return
        }

        let teacher = Teacher.create({
            schedule_id: ctx.state.schedule.id
        })

        Teacher.tryApply(teacher, teacherData, ['name', 'email', 'size'])
        await Teacher.save(teacher)

        console.log('Created teacher: ', teacher)

        ctx.body = {
            status: 200,
            data: teacher
        }
    })

    // Schedule teacher
    s.router.get('/api/teacher', async (ctx, next) => {
        let teacherId = ctx.query.teacherId

        if (!teacherId) {
            ctx.body = { status: 401, error: 'teacherId param required' }
            return
        }

        let teacher = await Teacher.findOne('id = ?', ctx.query.teacherId)

        if (!teacher) {
            ctx.body = {
                status: 401,
                error: 'Teacher does not exist'
            }
            return
        }

        ctx.body = {
            status: 200,
            data: teacher
        }
    })

    // Update schedule teacher
    s.router.put('/api/teacher', async (ctx, next) => {
        let newTeacher = ctx.request.body.teacher

        if (!newTeacher || !newTeacher.id) {
            ctx.body = {
                status: 400,
                error: 'Teacher cannot be empty'
            }
            return
        }

        let teacher = await Teacher.findOne('id = ?', newTeacher.id)

        if (!teacher) {
            ctx.body = {
                status: 401,
                error: 'Teacher does not exist in this schedule'
            }
            return
        }

        Teacher.tryApply(teacher, newTeacher, ['name', 'email', 'size'])
        Teacher.save(teacher)

        ctx.body = {
            status: 200,
            data: teacher
        }
    })

    // Delete schedule teacher
    s.router.delete('/api/teacher', async (ctx, next) => {
        let teacher = await Teacher.findOne('id = ?', ctx.query.teacherId)

        if (!teacher) {
            ctx.body = {
                status: 401,
                error: 'Teacher does not exist in this schedule'
            }
            return
        }

        await Teacher.delete(teacher)

        ctx.body = {
            status: 200
        }
    })
}
