import Vue from 'vue/dist/vue.js'
import VueRouter from 'vue-router'
import VueProgress from 'vue-progress-path'

import App from './views/App'
import routes from './routes'

// CSS
import '../scss/main.scss'

// UI Components
import PrimaryButton from '&/components/ui/PrimaryButton'

Vue.component('PrimaryButton', PrimaryButton)

// Lib registration
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
