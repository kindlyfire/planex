module.exports = (s) => {
    let Schedule = s.models.schedule

    // Error handler middleware
    s.router.use(['/api', '/api/*'], async (ctx, next) => {
        try {
            await next()
        } catch (e) {
            ctx.body = { status: 500, error: 'Internal Server Error' }
            console.error(e)
        }
    })

    // Schedule middleware
    s.router.use(['/api/schedule', '/api/schedule/*'], async (ctx, next) => {
        let id = ctx.query.scheduleId

        if (!id) {
            ctx.body = {
                status: 400,
                error: 'Missing schedule id'
            }
            return
        }

        ctx.state.schedule = await Schedule.findOne('id = ?', id)

        if (!ctx.state.schedule) {
            ctx.body = {
                status: 400,
                error: 'Schedule does not exist'
            }
            return
        }

        await next()
    })
}
