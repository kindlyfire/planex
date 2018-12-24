
module.exports = (s) => {
    let Schedule = s.models.schedule

    s.router.get('/:scheduleId/exams', async (ctx, next) => {
        await ctx.render('schedule/exams.pug')
    })

    s.router.post('/:scheduleId/exams', async (ctx, next) => {
        let schedule = ctx.state.schedule
        schedule.exams_file_data = ctx.request.body.exams_file_data
        await Schedule.save(schedule)

        await ctx.render('schedule/exams.pug')
    })
}