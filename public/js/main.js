import Vue from 'vue/dist/vue.min'
import main from './main.vue'

new Vue({
    el: '#app',
    render: function(h) {
        return h(main)
    }
})
