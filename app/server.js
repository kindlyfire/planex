const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const mount = require('koa-mount')
const views = require('koa-views')
const body = require('koa-body')

let app = new Koa()
let router = new Router()

app.use(mount('/public', static(__dirname + '/../public/')))

app.use(views(__dirname + '/views'), {
    extension: 'pug'
})

app.use(body())

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = {
    app,
    router
}
