import home from './sections/home/home.vue'

import schedule from './sections/schedule/schedule.vue'
import scheduleSummary from './sections/schedule/tabs/summary.vue'
import scheduleTeachers from './sections/schedule/tabs/teachers.vue'
import scheduleClasses from './sections/schedule/tabs/classes.vue'

export default [
    { path: '/', component: home },
    {
        path: '/schedule/:id',
        component: schedule,
        children: [
            {
                path: '',
                component: scheduleSummary
            },
            {
                path: 'teachers',
                component: scheduleTeachers
            },
            {
                path: 'classes',
                component: scheduleClasses
            }
        ]
    }
]
