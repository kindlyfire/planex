
import math


def structure_solution(solution):
    res = {
        # List of classes with their exams
        'classes': {},

        # List of exams with their teachers
        'teachers': {},

        # Number of days
        'days': 0
    }

    for block in solution:
        day = math.floor(block[2] / 4)

        # check if is class
        if block[1].startswith('class_'):
            if not block[1] in res['classes']:
                res['classes'][block[1]] = {}

            if not day in res['classes'][block[1]]:
                res['classes'][block[1]][day] = []

            res['classes'][block[1]][day].append({
                'label': block[0],
                'day': day,
                'start_hour': block[2] % 4,
                'length': block[3] - block[2],
                'teachers': []
            })

            if day + 1 > res['days']:
                res['days'] = day + 1

        elif block[1].startswith('teacher_'):
            if not block[1] in res['teachers']:
                res['teachers'][block[1]] = []

            res['teachers'][block[1]].append({
                'label': block[0],
                'day': day,
                'start_hour': block[2] % 4,
                'length': block[3] - block[2]
            })

    # add teachers to each class
    for cls in res['classes'].values():
        for day in cls.values():
            for exam in day:
                if exam['label'] in res['teachers']:
                    exam['teachers'] = res['teachers'][exam['label']]

    return res
