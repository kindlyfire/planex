
module.exports = (s) => {
    let Schedule = s.models.schedule

    s.router.get('/:scheduleId/courses', async (ctx, next) => {
        await ctx.render('schedule/courses.pug')
    })

    s.router.post('/:scheduleId/courses', async (ctx, next) => {
        let schedule = ctx.state.schedule
        schedule.courses_file_data = ctx.request.body.file_data
        await Schedule.save(schedule)

        await ctx.render('schedule/courses.pug')
    })
}