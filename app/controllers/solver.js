module.exports = (s) => {
    s.router.post('/api/actions/start_solver', (ctx, next) => {
        ctx.body = { data: {} }
        console.log('Yup, solver started')
    })
}
