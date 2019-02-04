const { resolve } = require('path')
const { createReadStream } = require('fs')

module.exports = (s) => {
    let file = resolve(__dirname, '..', '..', 'public', 'index.html')

    s.router.get('/', async (ctx, next) => {
        ctx.type = 'html'
        ctx.body = createReadStream(file)
    })
}
