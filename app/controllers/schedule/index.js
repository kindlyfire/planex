
module.exports = (s) => {
    let Solution = s.models.solution

    s.router.get('/:scheduleId', async (ctx, next) => {
        let solutions = await Solution.find('schedule_id = ? ORDER BY id DESC', ctx.state.schedule.id)

        await ctx.render('schedule/index.pug', {
            solutions
        })
    })
}