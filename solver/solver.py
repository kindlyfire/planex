
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

    # blocks ai
    blocks_ai = 0

    #
    # enter resources

    print('[INFO] Importing resources...')
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

    print('[INFO] Importing tasks...')
    for task in solver_data['tasks']:
        tname = 't' + str(tasks_ai)

        tasks[tname] = scenario.Task(
            tname, length=task['length'], **task['tags'])
        tasks_map[tname] = task['label']
        tasks_mapi[task['label']] = tname
        tasks_ai += 1

        tasks[tname]['r_' + tname] = 1

        if 'period' in task and task['period'] != -1:
            tasks[tname].periods = [task['period']]
        else:
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
    # enter blocks

    print('[INFO] Importing blocks...')
    for block in solver_data['blocks']:
        bname = 'b' + str(blocks_ai)

        task = scenario.Task(
            bname, length=1, periods=[block["start"]], plot_color='#000000')

        task += resources[resources_mapi[block["resource"]]]

        blocks_ai += 1

    print('[INFO] Importing sblocks...')
    for block in solver_data['sblocks']:
        bname = 'b' + str(blocks_ai)

        task = scenario.Task(
            bname, length=1, periods=[block["start"]], plot_color='#000000', schedule_cost=block["cost"])

        task += resources[resources_mapi[block["resource"]]]

        blocks_ai += 1

    #
    # enter sync constraints

    print('[INFO] Importing sync constraints...')
    for constraint in solver_data['constraints']['sync']:
        scenario += tasks[tasks_mapi[constraint['tasks'][0]]] <= tasks[tasks_mapi[constraint['tasks']
                                                                                  [1]]] + tasks[tasks_mapi[constraint['tasks'][0]]].length

    #
    # enter cap constraints

    for i, constraint in enumerate(solver_data['constraints']['cap']):
        print('[INFO] Importing capacity constraints... ({}/{})'.format(i + 1,
                                                                        len(solver_data['constraints']['cap'])))
        res = resources[resources_mapi[constraint['resource']]]

        cond = res[constraint['tags'][0]][0:int(solver_data['horizon']):2].max

        for t in constraint['tags'][1:]:
            cond = cond + res[t][0:int(solver_data['horizon']):2].max

        scenario += cond <= constraint['max']

        if 'capSum' in constraint:
            for t, value in constraint['capSum'].items():
                cond = None

                # capsum for all tasks except those with `t`
                for tname, task in tasks.items():
                    if not (t in task and task[t] == value):
                        s = res['r_' +
                                tname][0:int(solver_data['horizon']):2].max

                        cond = cond + s if cond else s

                scenario += cond <= 1

    #
    # solve

    if solvers.mip.solve(scenario, msg=1):
        plotters.matplotlib.plot(scenario, img_filename='out.png', fig_size=(
            resources_ai / 3, resources_ai / 2))

        solution = scenario.solution()
        real_solution = [[str(l[0]), str(l[1]), l[2], l[3]] for l in solution]

        for item in real_solution:
            if item[0][0] == 'b':
                continue
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
