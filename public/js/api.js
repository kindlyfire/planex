import axios from 'axios'

let prefix = '/api'

export default {
    async request(method, url, params = {}, data = {}) {
        try {
            let d

            if (method === 'get') {
                d = await axios[method](prefix + url, { params })
            } else {
                d = await axios[method](prefix + url, data, { params })
            }
            console.log(JSON.parse(JSON.stringify(d.data.data)))
            return d.data.data
        } catch (e) {
            console.error(e)
            // TODO: Should show error on screen, return empty data
            throw e
        }
    },

    async get(...args) {
        return this.request('get', ...args)
    },

    async delete(...args) {
        return this.request('delete', ...args)
    },

    async put(...args) {
        return this.request('put', ...args)
    },

    async post(...args) {
        return this.request('post', ...args)
    }
}
