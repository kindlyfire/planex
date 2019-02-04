import Vue from 'vue/dist/vue.js'
import VueRouter from 'vue-router'
import VueProgress from 'vue-progress-path'

import App from './views/App'
import routes from './routes'

// UI Components
import PrimaryButton from '&/components/ui/PrimaryButton'
import AppInput from '&/components/ui/AppInput'

Vue.component('PrimaryButton', PrimaryButton)
Vue.component('AppInput', AppInput)

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
    data: {
        inc: 1
    },
    render: function(h) {
        return h(App)
    }
})
