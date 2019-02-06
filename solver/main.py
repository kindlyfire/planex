
import sys
import simplejson
import pprint

from structure_solution import structure_solution
from solver import solve

schedule_file = sys.argv[1]
schedule_data = simplejson.load(open(schedule_file, 'r', encoding='utf-8'))

# Print data prettily !
# printer = pprint.PrettyPrinter(indent=4, depth=10)
# printer.pprint(solver_data)

# solve
solution = solve(schedule_data)

# structure solution
if solution['solved']:
    solution['data'] = structure_solution(solution['data'])

open(schedule_file, 'w', encoding='utf-8').write(simplejson.dumps(solution,
                                                                  ensure_ascii=False, indent=4))
