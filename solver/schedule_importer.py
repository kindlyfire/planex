
import re, csv

def extract_classes(cstr, years_data):
    cstr = cstr.strip().replace('Tt', 't')
    regex = r"([0-9]+)([A-Z])?([a-z]*)"
    matches = re.findall(regex, cstr)

    if len(matches) < 1:
        return None
    
    classes = matches[0][2]
    if not classes:
        if matches[0][0] + matches[0][1] in years_data:
            classes = years_data[matches[0][0] + matches[0][1]]
        elif matches[0][0] in years_data:
            classes = years_data[matches[0][0]]
        else:
            classes = []
    
    return {
        'year': matches[0][0],
        'section': matches[0][1] or 'G',
        'classes': list(classes)
    }

def import_from_schedule(schedule_data):
    # 
    # Output data
    res = {
        'horizon': int(schedule_data['horizon']) * 4,
        'resources': [],
        'tasks': [],
        'blocks': []
    }

    # 
    # Extract years data
    years_data = {}

    for y in schedule_data['years_data'].split(','):
        info = extract_classes(y, {})
        
        if info:
            years_data[info['year'] + info['section']] = info['classes']

    # 
    # Extract all other data
    reader = csv.DictReader(schedule_data['exams_file_data'].splitlines())
    
    # each line in the csv
    for row in reader:
        task_resources = []
        valid_cinfo = None

        # each group of classes
        for cname in row['class'].split(' '):
            cinfo = extract_classes(cname, years_data)
            cprofs = [p.strip() for p in row['profs'].split('-')]

            if not cinfo:
                continue
            valid_cinfo = cinfo
            
            # for each option
            for cls in cinfo['classes']:
                cstr = cinfo['year'] + cinfo['section'] + cls

                # add to resources list if not present
                if not cstr in res['resources']:
                    res['resources'].append(cstr)
                
                # add resource to exam resource list
                if not cstr in task_resources:
                    task_resources.append(cstr)
            
            # for each prof
            for prof in cprofs:
                # add to ressources list if not present
                if not prof in res['resources']:
                    res['resources'].append(prof)
                
                # add resource to exam resource list
                if not prof in task_resources:
                    task_resources.append(prof)

        # add task for exam
        task = {
            'label': valid_cinfo['year'] + valid_cinfo['section'] + '_' + row['course'].lower().replace(' ', '_'),
            'tags': ['a' + valid_cinfo['year'], 't' + valid_cinfo['section'], 'o' + valid_cinfo['year'] + valid_cinfo['section']],
            'resources': task_resources,
            'length': int(row['length'])
        }

        res['tasks'].append(task)

    return res