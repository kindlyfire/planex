import Vue from 'vue/dist/vue.js'
import VueRouter from 'vue-router'
import VueProgress from 'vue-progress-path'
import VeeValidate, { Validator } from 'vee-validate'
import fr from 'vee-validate/dist/locale/fr'

import App from './views/App'
import routes from './routes'

// UI Components
import PrimaryButton from '&/components/ui/PrimaryButton'
import AppInput from '&/components/ui/AppInput'
import AppButton from '&/components/ui/AppButton'

Vue.component('PrimaryButton', PrimaryButton)
Vue.component('AppInput', AppInput)
Vue.component('AppButton', AppButton)

// Lib registration
Vue.use(VueProgress, {
	defaultShape: 'line'
})

Vue.use(VueRouter)
const router = new VueRouter({
	routes
})

Vue.use(VeeValidate)
Validator.localize('fr', fr)

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
