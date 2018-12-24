
import math

def structure_solution(solution):
    res = {
        # List of classes with their exams
        'classes': {},

        # List of exams with their profs
        'profs': {},

        # Number of days
        'days': 0
    }

    for block in solution:
        # check if is class
        if block[1][0].isdigit():
            if not block[1] in res['classes']:
                res['classes'][block[1]] = {}
            
            day = math.floor(block[2] / 4)
            if not day in res['classes'][block[1]]:
                res['classes'][block[1]][day] = []

            res['classes'][block[1]][day].append({
                'label': block[0],
                'day': day,
                'start_hour': block[2] % 4,
                'length': block[3] - block[2],
                'profs': []
            })

            if day + 1 > res['days']:
                res['days'] = day + 1
        
        else:
            if not block[0] in res['profs']:
                res['profs'][block[0]] = []
            
            res['profs'][block[0]].append(block[1])
    
    # add profs to each class
    for cls in res['classes'].values():
        for day in cls.values():
            for exam in day:
                if exam['label'] in res['profs']:
                    exam['profs'] = res['profs'][exam['label']]

    return res