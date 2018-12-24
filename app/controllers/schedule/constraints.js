
module.exports = (s) => {
    let Schedule = s.models.schedule

    s.router.get('/:scheduleId/constraints', async (ctx, next) => {
        await ctx.render('schedule/constraints.pug')
    })

    s.router.post('/:scheduleId/constraints', async (ctx, next) => {
        let schedule = ctx.state.schedule
        schedule.constraints_file_data = ctx.request.body.file_data
        await Schedule.save(schedule)

        await ctx.render('schedule/constraints.pug')
    })
}