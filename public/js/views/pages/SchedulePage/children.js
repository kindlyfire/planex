import SummaryPane from './SummaryPane'

import ExamsPane from '&/sections/schedule/tabs/exams.vue'
import ClassesPane from '&/sections/schedule/tabs/classes.vue'
import TeachersPane from '&/sections/schedule/tabs/teachers.vue'

export default [
    {
        path: '',
        name: 'Résumé',
        component: SummaryPane
    },
    {
        path: 'teachers',
        name: 'Professeurs',
        component: TeachersPane
    },
    {
        path: 'classes',
        name: 'Classes',
        component: ClassesPane
    },
    {
        path: 'exams',
        name: 'Examens',
        component: ExamsPane
    }
]
