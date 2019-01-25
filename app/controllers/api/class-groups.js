module.exports = (s) => {
    const ClassGroup = s.model('classGroup')
    const Class = s.model('class')

    // List class groups
    s.router.get('/api/schedule/class-groups', async (ctx, next) => {
        let groups = await ClassGroup.find(
            'schedule_id = ?',
            ctx.state.schedule.id
        )

        ctx.body = {
            status: 200,
            data: groups
        }
    })

    // Create class group
    s.router.post('/api/schedule/class-groups', async (ctx, next) => {
        let groupData = ctx.request.body.group

        if (!groupData || !groupData.name) {
            ctx.body = {
                status: 400,
                error: 'Group object incomplete'
            }
        }

        let group = ClassGroup.create({
            schedule_id: ctx.state.schedule.id
        })

        ClassGroup.tryApply(group, groupData, ['name'])
        await ClassGroup.save(group)

        ctx.body = {
            status: 200,
            data: group
        }
    })

    // Get class group
    s.router.get('/api/class-group', async (ctx, next) => {
        let groupId = ctx.query.groupId

        if (!groupId) {
            ctx.body = {
                status: 400,
                error: 'groupId parameter required'
            }
            return
        }

        let group = await ClassGroup.findOne('id = ?', groupId)

        if (!group) {
            ctx.body = {
                status: 404,
                error: 'ClassGroup not found'
            }
            return
        }

        let classes = await Class.find(
            'group_id = ? ORDER BY schedule_id, name',
            group.id
        )

        ctx.body = {
            status: 200,
            data: {
                group,
                classes
            }
        }
    })

    // Update class group
    s.router.put('/api/class-group', async (ctx, next) => {
        let groupData = ctx.request.body.group

        if (!groupData || !groupData.id) {
            ctx.body = {
                status: 400,
                error: 'ClassGroup object incomplete'
            }
            return
        }

        let group = await ClassGroup.findOne('id = ?', groupData.id)

        if (!group) {
            ctx.body = {
                status: 404,
                error: 'ClassGroup not found'
            }
            return
        }

        ClassGroup.tryApply(group, groupData, ['name'])
        await ClassGroup.save(group)

        ctx.body = {
            status: 200,
            data: group
        }
    })

    // Delete class group
    s.router.delete('/api/class-group', async (ctx, next) => {
        let groupId = ctx.query.groupId

        if (!groupId) {
            ctx.body = {
                status: 400,
                error: 'groupId parameter required'
            }
            return
        }

        let group = await ClassGroup.findOne('id = ?', groupId)

        if (!group) {
            ctx.body = {
                status: 404,
                error: 'ClassGroup not found'
            }
            return
        }

        await ClassGroup.delete(group)
        await s.db.query(
            'DELETE FROM ' + Class.tableName() + ' WHERE group_id = ?',
            group.id
        )

        ctx.body = {
            status: 200,
            data: group
        }
    })
}
