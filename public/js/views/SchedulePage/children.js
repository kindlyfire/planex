import SummaryPane from './SummaryPane'
import ClassesPane from './ClassesPane'
import TeachersPane from './TeachersPane'

import ExamsPane from '&/sections/schedule/tabs/exams.vue'

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