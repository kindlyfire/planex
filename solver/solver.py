
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
    for i, resource in enumerate(solver_data['resources']):
        print('[INFO] Importing resources... ({}/{})'.format(i + 1,
                                                             len(solver_data['resources'])), end='\r')

        # convert to [name, size = 1]
        if not isinstance(resource, list):
            resource = [resource, 1]

        # label given to the solver backend
        rname = 'r' + str(resources_ai)

        has_parallel = False
        if resource[0].startswith('teacher_'):
            for task in solver_data['tasks']:
                if resource[0] in task['resources'] and task['tags']['block_value'] != task['length']:
                    has_parallel = True
                    print('Found parallel', resource, '                     ')
                    break

        size = 2 if has_parallel else 1

        resources[rname] = scenario.Resource(rname, size=size)
        resources_map[rname] = resource[0]
        resources_mapi[resource[0]] = rname
        resources_ai += 1

        if has_parallel:
            scenario += resources[rname]['block_value'][0:
                                                        int(solver_data['horizon']):1] <= 1

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
            bname, length=1, periods=[block["start"]], plot_color='#000000', block_value=1)

        task += resources[resources_mapi[block["resource"]]]

        blocks_ai += 1

    print('[INFO] Importing sblocks...')
    for block in solver_data['sblocks']:
        bname = 'b' + str(blocks_ai)

        task = scenario.Task(
            bname, length=1, periods=[block["start"]], plot_color='#000000', schedule_cost=block["cost"], block_value=1)

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

    print(solver_data['constraints']['cap'])
    for i, constraint in enumerate(solver_data['constraints']['cap']):
        print('[INFO] Importing capacity constraints... ({}/{})'.format(i + 1,
                                                                        len(solver_data['constraints']['cap'])))

        for res in resources.values():
            if res.size == 1:
                continue

            cond = res[constraint[0]][0:int(solver_data['horizon']):1].max

            for t in constraint[1:]:
                cond = cond + res[t][0:int(solver_data['horizon']):1].max

            scenario += cond <= 1

    #
    # solve

    if solvers.mip.solve(scenario, msg=1):
        # plotters.matplotlib.plot(scenario, img_filename='out.png', fig_size=(
        #     resources_ai / 3, resources_ai / 2))

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
