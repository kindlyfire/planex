import Vue from 'vue/dist/vue.min'
import VueRouter from 'vue-router'

import main from './main.vue'
import routes from './routes'

Vue.use(VueRouter)
const router = new VueRouter({
    routes
})

new Vue({
    el: '#app',
    router,
    render: function(h) {
        return h(main)
    }
})
