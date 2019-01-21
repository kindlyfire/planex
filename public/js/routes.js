import home from './sections/home/home.vue'

import schedule from './sections/schedule/schedule.vue'
import scheduleSummary from './sections/schedule/tabs/summary.vue'

export default [
    { path: '/', component: home },
    {
        path: '/schedule/:id',
        component: schedule,
        children: [
            {
                path: '',
                component: scheduleSummary
            }
        ]
    }
]
