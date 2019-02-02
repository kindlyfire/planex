import home from './sections/home/home.vue'

import HomePage from './views/pages/HomePage'
import SchedulePage, {
    children as schedulePageChildren
} from './views/pages/SchedulePage'

export default [
    { path: '/', component: HomePage },
    {
        path: '/schedule/:id',
        component: SchedulePage,
        children: schedulePageChildren
    }
]
