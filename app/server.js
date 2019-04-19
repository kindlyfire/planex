const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const mount = require('koa-mount')
const body = require('koa-body')
const chalk = require('chalk')
const dateFormat = require('dateformat')

let app = new Koa()
let router = new Router()

app.use(mount('/public', static(__dirname + '/../public/')))

app.use(body())

// Logger
app.use(async (ctx, next) => {
	await next()

	console.log(
		chalk`{yellow [${dateFormat(
			'yyyy-mm-dd HH:MM:ss'
		)}]}{blue [${ctx.method.toUpperCase()}]} ${ctx.request.path} {yellow ${
			ctx.status
		}}`
	)
})

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = {
	app,
	router
}
