import SummaryPane from './SummaryPane'

import ExamsPane from '&/sections/schedule/tabs/exams.vue'
import ClassesPane from './ClassesPane'
import TeachersPane from '&/sections/schedule/tabs/teachers.vue'

export default [
    {
        path: '',
        name: 'Résumé',
        component: SummaryPane
    },
    {
        path: 'exams',
        name: 'Examens',
        component: ExamsPane
    },
    {
        path: 'teachers',
        name: 'Profs',
        component: TeachersPane
    },
    {
        path: 'classes',
        name: 'Classes',
        component: ClassesPane
    }
]
