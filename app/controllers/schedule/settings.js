
module.exports = (s) => {
    const Schedule = s.models.schedule

    s.router.get('/:scheduleId/settings', async (ctx, next) => {
        await ctx.render('schedule/settings.pug')
    })

    s.router.post('/:scheduleId/settings', async (ctx, next) => {
        let action = ctx.request.query.action
        let schedule = ctx.state.schedule
        let error

        console.log(action, ctx.request.query)

        if (action === 'update-name') {
            let name = ctx.request.body.name

            if (!name || name.length < 4) {
                error = 'Le nom de l\'horaire doit contenir au minimum 4 caractères'
            }
            else {
                schedule.name = name
            }
        }
        else if (action === 'update-years') {
            schedule.years_data = ctx.request.body.years_data
        }
        else if (action === 'update-horizon') {
            let horizon = parseInt(ctx.request.body.horizon)

            if (isNaN(horizon) || horizon < 1 || horizon > 15) {
                error = 'L\'horizon doit être un nombre entier compris entre 1 et 15 inclus.'
            }
            else {
                schedule.horizon = horizon
            }
        }
        else if (action === 'update-start-day') {
            let startDay = parseInt(ctx.request.body.start_day)

            if (isNaN(startDay) || startDay < 0 || startDay > 4) {
                error = 'Le jour de début est invalide.'
            }
            else {
                schedule.start_day = startDay
            }
        }

        await Schedule.save(schedule)

        await ctx.render('schedule/settings.pug', {
            error
        })
    })
}