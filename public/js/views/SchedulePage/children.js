import SummaryPane from './SummaryPane'
import SolutionsPane from './SolutionsPane'
import ClassesPane from './ClassesPane'
import TeachersPane from './TeachersPane'
import ExamsPane from './ExamsPane'
import SettingsPane from './SettingsPage'

export default [
    {
        path: '',
        name: 'Résumé',
        component: SummaryPane
    },
    {
        path: 'solutions',
        name: 'Solutions',
        component: SolutionsPane
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
    },
    {
        path: 'settings',
        name: 'Paramètres',
        component: SettingsPane
    }
]
