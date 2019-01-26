let util = require('./util')

module.exports = (config) => {
    let router = config.router

    // Middleware
    router.use(config.prefix + '/*', async (ctx, next) => {
        try {
            await next()
        } catch (e) {
            ctx.body = {
                status: 500,
                error: e.message
            }
        }

        ctx.status = ctx.body.status
    })

    // Define REST API
    for (let model of Object.values(config.models)) {
        console.log('Creating API model for ', model.options.name)

        // Ex: GET /api/users
        router.get(
            config.prefix + '/' + model.options.name.plural,
            async (ctx, next) => {
                let options = util.parseOptions(model, ctx.query)

                let res = await model.findAll(options)

                ctx.body = {
                    status: 200,
                    data: res
                }
            }
        )

        // Ex: GET /api/user/:id
        router.get(
            config.prefix + '/' + model.options.name.singular + '/:id',
            async (ctx, next) => {
                let id = ctx.params.id

                if (!id) {
                    throw new Error('ID is required')
                }

                let res = await model.findOne({
                    where: {
                        id
                    }
                })

                ctx.body = {
                    status: 200,
                    data: res
                }
            }
        )
    }
}
