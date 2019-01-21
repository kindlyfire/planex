
const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const mount = require('koa-mount')
const views = require('koa-views')
const dateFormat = require('dateformat')
const randomColor = require('randomcolor')
const body = require('koa-body')

let app = new Koa()
let router = new Router()

app.use(mount('/static', static(__dirname + '/../static/')))

app.use(views(__dirname + '/views'), {
    extension: 'pug'
})

app.use(body())

app.use(async (ctx, next) => {
    ctx.state.dateFormat = dateFormat
    ctx.state.randomColor = randomColor

    await next()
})

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = {
    app,
    router
}