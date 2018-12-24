
import sys, simplejson, pprint

from schedule_importer import import_from_schedule
from structure_solution import structure_solution
from solver import solve

schedule_file = sys.argv[1]
schedule_data = simplejson.load(open(schedule_file, 'r', encoding='utf-8'))

solver_data = import_from_schedule(schedule_data)

# Print data prettily !
# printer = pprint.PrettyPrinter(indent=4, depth=10)
# printer.pprint(solver_data)

# solve
solution = solve(solver_data)

# structure solution
if solution['solved']:
    solution['data'] = structure_solution(solution['data'])

open(schedule_file, 'w', encoding='utf-8').write(simplejson.dumps(solution, ensure_ascii=False, indent=4))