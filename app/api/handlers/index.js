
module.exports = (app) => {
    app
        .register('schedules.list')
        .get(async (ctx, next) => {
            ctx.body = { status: 200 }
        })
}