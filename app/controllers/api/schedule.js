module.exports = (s) => {
    const Schedule = s.model('schedule')

    // Get schedules list
    s.router.get('/api/schedules', async (ctx, next) => {
        let schedules = await Schedule.find('1=1 ORDER BY updated_date DESC')

        ctx.body = {
            status: 200,
            data: schedules
        }
    })

    // Create new schedule
    s.router.post('/api/schedules', async (ctx, next) => {
        let name = ctx.request.body.name

        if (!name) {
            ctx.body = {
                status: 400,
                error: 'Name cannot be empty'
            }
            return
        }

        let schedule = Schedule.create({
            name
        })
        await Schedule.save(schedule)

        ctx.body = {
            status: 200,
            data: schedule
        }
    })

    // Schedule information
    s.router.get('/api/schedule', (ctx, next) => {
        ctx.body = {
            status: 200,
            data: ctx.state.schedule
        }
    })
}
