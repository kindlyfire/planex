
module.exports = ({options, app, router, db}) => {
    let o = {
        options,
        db,
        app,
        router,

        // Register a URL for routing
        register(url) {
            return urlBuilder(o, url)
        }
    }

    return o
}

const urlBuilder = (A, url) => {
    let o = {
        get(callback) {
            A.router.get(url, callback)

            return o
        },

        post(callback) {
            A.router.post(url, callback)

            return o
        }
    }

    return o
}