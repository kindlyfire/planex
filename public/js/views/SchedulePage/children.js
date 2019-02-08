import SummaryPane from './SummaryPane'
import ClassesPane from './ClassesPane'
import TeachersPane from './TeachersPane'
import ExamsPane from './ExamsPane'
import SettingsPane from './SettingsPage'
import ConstraintsPane from './ConstraintsPage'

import SolutionsPane from './SolutionsPane'
import SolutionsPaneList from './SolutionsPane/SolutionsPaneList'
import SolutionsPaneInspect from './SolutionsPane/SolutionsPaneInspect'

export default [
	{
		path: '',
		displayName: 'Résumé',
		component: SummaryPane
	},
	{
		path: 'solutions',
		displayName: 'Solutions',
		component: SolutionsPane,

		children: [
			{
				path: '',
				component: SolutionsPaneList
			},
			{
				path: ':solutionId',
				component: SolutionsPaneInspect
			}
		]
	},
	{
		path: 'exams',
		displayName: 'Examens',
		component: ExamsPane
	},
	{
		path: 'teachers',
		displayName: 'Profs',
		component: TeachersPane
	},
	{
		path: 'classes',
		displayName: 'Classes',
		component: ClassesPane
	},
	{
		path: 'constraints',
		displayName: 'Contraintes',
		component: ConstraintsPane
	},
	{
		path: 'settings',
		displayName: 'Paramètres',
		component: SettingsPane
	}
]
