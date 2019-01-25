module.exports = (s) => {
    const Class = s.model('class')
    const ClassGroup = s.model('classGroup')

    // Get schedules list
    s.router.get('/api/schedule/classes', async (ctx, next) => {
        let classes = await Class.find(
            'schedule_id = ? ORDER BY schedule_id, name',
            ctx.state.schedule.id
        )

        ctx.body = {
            status: 200,
            data: classes
        }
    })

    // Get schedules list
    s.router.post('/api/schedule/classes', async (ctx, next) => {
        let clsData = ctx.request.body.class

        if (!clsData || !clsData.name || !clsData.group_id) {
            ctx.body = {
                status: 400,
                error: 'Class not supplied or name empty'
            }
            return
        }

        let group = await ClassGroup.findOne('id = ?', clsData.group_id)

        if (!group || group.schedule_id !== ctx.state.schedule.id) {
            ctx.body = {
                status: 400,
                error: 'Invalid group_id or not in schedule'
            }
            return
        }

        let cls = Class.create({
            schedule_id: ctx.state.schedule.id
        })

        Class.tryApply(cls, clsData, ['name', 'group_id'])
        await Class.save(cls)

        ctx.body = {
            status: 200,
            data: cls
        }
    })

    // Delete schedule
    s.router.delete('/api/class', async (ctx, next) => {
        let classId = ctx.query.classId

        if (!classId) {
            ctx.body = {
                status: 400,
                error: 'classId not supplied'
            }
            return
        }

        let cls = await Class.findOne('id = ?', classId)

        if (!cls) {
            ctx.body = {
                status: 400,
                error: 'Class not found'
            }
            return
        }

        await Class.delete(cls)

        ctx.body = {
            status: 200,
            data: cls
        }
    })
}
