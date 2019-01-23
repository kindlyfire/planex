module.exports = (s) => {
    const Schedule = s.models.schedule

    s.router.get('/', async (ctx, next) => {
        await ctx.render('index.pug')
    })
}
