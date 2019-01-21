
from pyschedule import Scenario, solvers, plotters


def solve(solver_data):
    # create scenario
    scenario = Scenario(name='scenario', horizon=int(solver_data['horizon']))

    # resources list
    resources = {}
    resources_map = {}
    resources_mapi = {}
    resources_ai = 0

    # tasks list
    tasks = {}
    tasks_map = {}
    tasks_mapi = {}
    tasks_ai = 0

    #
    # enter resources

    for resource in solver_data['resources']:
        # convert to [name, size = 1]
        if not isinstance(resource, list):
            resource = [resource, 1]

        # label given to the solver backend
        rname = 'r' + str(resources_ai)

        resources[rname] = scenario.Resource(rname, size=resource[1])
        resources_map[rname] = resource[0]
        resources_mapi[resource[0]] = rname
        resources_ai += 1

    #
    # enter tasks

    for task in solver_data['tasks']:
        tname = 't' + str(tasks_ai)

        # create tags
        # TODO: tag names are unsafe (**tags_obj)
        tags_obj = {}
        for tag in task['tags']:
            tags_obj[tag] = 1

        tasks[tname] = scenario.Task(tname, length=task['length'], **tags_obj)
        tasks_map[tname] = task['label']
        tasks_mapi[task['label']] = tname
        tasks_ai += 1

        if task['length'] == 4:
            tasks[tname].periods = [i for i in range(
                0, solver_data['horizon']) if i % 4 == 0]
        else:
            tasks[tname].periods = [i for i in range(
                0, solver_data['horizon']) if i % 2 == 0]

        # add resources to task
        for res_name in task['resources']:
            tasks[tname] += resources[resources_mapi[res_name]]

    #
    # solve

    if solvers.mip.solve(scenario, msg=1, time_limit=180):
        plotters.matplotlib.plot(scenario, img_filename='out.png', fig_size=(
            resources_ai / 3, resources_ai / 2))

        solution = scenario.solution()
        real_solution = [list(l) for l in solution]

        for item in real_solution:
            item[0] = tasks_map[str(item[0])]
            item[1] = resources_map[str(item[1])]

        return {
            'solved': True,
            'data': real_solution
        }
    else:
        return {
            'solved': False,
            'error': 'Impossible'
        }
