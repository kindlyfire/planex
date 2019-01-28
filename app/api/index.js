let util = require('./util')

module.exports = (config) => {
    let router = config.router

    // Middleware
    router.use(config.prefix + '/*', async (ctx, next) => {
        try {
            await next()
        } catch (e) {
            console.error(e)
            ctx.body = {
                status: 500,
                error: e.message
            }
        }

        ctx.status = ctx.body.status || 200
    })

    // Define REST API
    for (let model of Object.values(config.models)) {
        // Ex: GET /api/users
        router.get(
            config.prefix + '/' + model.options.name.plural,
            async (ctx, next) => {
                let options = util.parseOptions(model, ctx.query, config.models)

                let res = await model.findAll(options)

                ctx.body = {
                    status: 200,
                    data: res
                }
            }
        )

        // Ex: POST /api/users
        router.post(
            config.prefix + '/' + model.options.name.plural,
            async (ctx, next) => {
                let resource = model.build({})

                // Don't allow some attributes
                let allowedAttributes = Object.keys(model.rawAttributes).filter(
                    (attr) => !['id', 'updated_at', 'created_at'].includes(attr)
                )

                for (let attr of allowedAttributes) {
                    if (ctx.request.body[attr] !== undefined) {
                        resource[attr] = ctx.request.body[attr]
                    }
                }

                // TODO: No error handling yet
                await resource.save()

                ctx.body = {
                    status: 200,
                    data: resource
                }
            }
        )

        // Middleware
        // Ex: GET|POST|PUT|DELETE /api/user/:id
        router.use(
            config.prefix + '/' + model.options.name.singular + '/:id',
            async (ctx, next) => {
                let id = ctx.params.id

                if (!id) {
                    ctx.body = {
                        status: 400,
                        error: 'id is required'
                    }
                    return
                }

                let res = (ctx.state.resource = await model.findOne({
                    where: {
                        id
                    }
                }))

                if (!res) {
                    ctx.body = {
                        status: 404,
                        error: 'entre does not exist'
                    }
                    return
                }

                await next()
            }
        )

        // Ex: GET /api/user/:id
        router.get(
            config.prefix + '/' + model.options.name.singular + '/:id',
            async (ctx, next) => {
                let options = util.parseOptions(
                    model,
                    { ...ctx.query, id: ctx.state.resource.id },
                    config.models
                )

                let res = await model.findOne(options)

                ctx.body = {
                    status: 200,
                    data: res
                }
            }
        )

        // Ex: DELETE /api/user/:id
        router.delete(
            config.prefix + '/' + model.options.name.singular + '/:id',
            async (ctx, next) => {
                await ctx.state.resource.destroy()

                ctx.body = {
                    status: 200,
                    data: ctx.state.resource
                }
            }
        )

        // Ex: PUT /api/user/:id
        router.put(
            config.prefix + '/' + model.options.name.singular + '/:id',
            async (ctx, next) => {
                let resource = ctx.state.resource

                // Don't allow some attributes
                allowedAttributes = Object.keys(model.rawAttributes).filter(
                    (attr) => !['id', 'created_at', 'updated_at'].includes(attr)
                )

                for (let attr of allowedAttributes) {
                    if (ctx.request.body[attr] !== undefined) {
                        resource[attr] = ctx.request.body[attr]
                    }
                }

                await resource.save()

                ctx.body = {
                    status: 200,
                    data: resource
                }
            }
        )
    }
}
