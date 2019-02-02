import Vue from 'vue/dist/vue.js'
import VueRouter from 'vue-router'
import VueProgress from 'vue-progress-path'

import App from './views/App'
import routes from './routes'

Vue.use(VueProgress, {
    defaultShape: 'line'
})

Vue.use(VueRouter)
const router = new VueRouter({
    routes
})

new Vue({
    el: '#app',
    router,
    render: function(h) {
        return h(App)
    }
})
