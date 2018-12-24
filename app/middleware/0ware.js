
module.exports = (s) => {
    let Schedule = s.models.schedule

    s.router.use(['/:scheduleId', '/:scheduleId/*'], async (ctx, next) => {
        let scheduleId = parseInt(ctx.params.scheduleId)

        if (isNaN(scheduleId)) {
            ctx.body = '404'
            return
        }

        let schedule = await Schedule.findOne('id = ?', ctx.params.scheduleId)

        if (schedule === null) {
            ctx.body = '404'
            return
        }
        
        ctx.state.schedule = schedule

        await next()
    })
}