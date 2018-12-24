
module.exports = (s) => {
    const Schedule = s.models.schedule

    s.router.get('/', async (ctx, next) => {
        let schedules = await Schedule.find()

        await ctx.render('index.pug', {
            schedules
        })
    })
}