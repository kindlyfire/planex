module.exports = (s) => {
    s.router.get('/', async (ctx, next) => {
        await ctx.render('index.pug')
    })
}
