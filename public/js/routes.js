import HomePage from './views/HomePage'
import SchedulePage, {
    children as schedulePageChildren
} from './views/SchedulePage'

export default [
    { path: '/', component: HomePage },
    {
        path: '/schedule/:id',
        component: SchedulePage,
        children: schedulePageChildren
    }
]
