from django.shortcuts import render
from django.http import JsonResponse
from .models import *
import random


def training(request):
    return render(request, 'pages/training.html', locals())


def start_training(request):
    session_key = request.session.session_key
    user_name = request.POST['user_name']
    task_set = list(Set_tasks.objects.all().values_list())[0][1:]
    response = {}
    if sum(task_set) == 0:
        response = {'Not enough data in db': 'Error'}
    else:
        def get_random_tasks(sample, nmb_values):
            result = []

            for iterator in range(nmb_values):
                new_max_value = len(sample) - 1
                sample_index = random.randint(0, new_max_value)
                result.append(sample[sample_index])
                del sample[sample_index]

            return result

        def update_completed_tasks(sending_data, label_to_update, completed_variants = ""):
            update_data = completed_variants

            for key in sending_data:
                update_data += str(key['id']) + ','

            if label_to_update == 'tests':

                Results_compliting_task.objects.update_or_create(name=user_name, session_key=session_key,
                                                                 defaults={'completed_tests_id': update_data})
            elif label_to_update == 'connection_definitions':
                Results_compliting_task.objects.update_or_create(name=user_name, session_key=session_key,
                                                                 defaults={'completed_connections_id': update_data})
            else:
                Results_compliting_task.objects.update_or_create(name=user_name, session_key=session_key,
                                                                 defaults={'completed_exercises_id': update_data})

        def group_tests(tasks_dict):
            result = {'correct_answers': [], 'questions': [], 'answers': []}
            for task in tasks_dict:
                arr_questions = []
                result['correct_answers'].append(task['correct_answer'])
                result['questions'].append(task['question'])

                for key in ['answer_1', 'answer_2', 'answer_3', 'answer_4']:
                    arr_questions.append(task[key])

                result['answers'].append(arr_questions)

            return result

        def group_connection_definitions(data):
            result = {'concepts': [], 'definitions': []}
            shuffle_multiplier = 43
            for connection_definition in data:
                concepts = []

                # mix definition
                index_definition = ['1', '2', '3', '4']
                for i in range(shuffle_multiplier):
                    random.shuffle(index_definition)

                definitions_keys = ['definition_' + index_definition[0],
                                    'definition_' + index_definition[1],
                                    'definition_' + index_definition[2],
                                    'definition_' + index_definition[3],
                                    ]

                definitions = {definitions_keys[0]: connection_definition[definitions_keys[0]],
                               definitions_keys[1]: connection_definition[definitions_keys[1]],
                               definitions_keys[2]: connection_definition[definitions_keys[2]],
                               definitions_keys[3]: connection_definition[definitions_keys[3]]
                               }

                for key_concepts in ['concept_1', 'concept_2', 'concept_3', 'concept_4']:
                    concepts.append(connection_definition[key_concepts])

                result['concepts'].append(concepts)
                result['definitions'].append(definitions)

                # increase multiplier for getting different list
                shuffle_multiplier += 7

            return result

        def validate_length(type_tasks, completed_task_id, required_length, completed_tasks):
            task_sample = []

            while True:
                if type_tasks == 'tests':
                    task_sample = list(Tests.objects.exclude(id__in=completed_task_id).values())

                elif type_tasks == 'connection_definitions':
                    task_sample = list(Connection_definition.objects.exclude(id__in=completed_task_id).values())

                elif type_tasks == 'exercises':
                    task_sample = list(Exercise.objects.exclude(id__in=completed_task_id).values())

                actual_length = len(task_sample)

                if actual_length >= required_length:
                    break
                else:
                    completed_task_id = completed_task_id[1:]
                    completed_tasks = completed_tasks[2:]

            return {'task_sample': task_sample, 'changed_completed_tasks': completed_tasks}

        def group_exercises(exercises_data):
            result = {'titles': [], 'conditions': [], 'correct_answers': [], 'hints': [], 'resolving_hints': []}
            for exercise in exercises_data:
                result['titles'].append(exercise['title'])
                result['conditions'].append(exercise['condition'])
                result['correct_answers'].append(exercise['correct_answer'])
                result['hints'].append(exercise['hint'])
                result['resolving_hints'].append(exercise['resolving_hint'])

            return result


        if Results_compliting_task.objects.filter(session_key = session_key):

            user_data = Results_compliting_task.objects.all().values_list()[0]

            completed_tests_id = user_data[-3].split(',')[:-1]
            # convert all values to int
            completed_tests_id = [int(item) for item in completed_tests_id]

            completed_connections_id = user_data[-2].split(',')[:-1]
            completed_connections_id = [int(item) for item in completed_connections_id]

            completed_exercises_id = user_data[-1].split(',')[:-1]
            completed_exercises_id = [int(item) for item in completed_exercises_id]

            if task_set[0]:
                validate_data = validate_length('tests', completed_tests_id, task_set[0], user_data[-3])
                test_sample = validate_data['task_sample']
                tests = get_random_tasks(test_sample, task_set[0])

                update_completed_tasks(tests, 'tests', validate_data['changed_completed_tasks'])
                test_data = group_tests(tests)
                response['tests'] = test_data


            if task_set[1]:
                validate_data = validate_length('connection_definitions', completed_connections_id, task_set[1], user_data[-2])
                connection_definition_sample = validate_data['task_sample']
                connection_definitions = get_random_tasks(connection_definition_sample, task_set[1])

                update_completed_tasks(connection_definitions, 'connection_definitions', validate_data['changed_completed_tasks'])
                connection_data = group_connection_definitions(connection_definitions)
                response['connections_definition'] = connection_data
            if task_set[2]:
                validate_data = validate_length('exercises', completed_exercises_id, task_set[2], user_data[-1])
                exercises_sample = validate_data['task_sample']
                exercises = get_random_tasks(exercises_sample, task_set[2])

                update_completed_tasks(exercises, 'exercises', validate_data['changed_completed_tasks'])
                exercises_data = group_exercises(exercises)
                response['exercises'] = exercises_data

        else:
            if task_set[0]:
                test_sample = list(Tests.objects.all().values())
                tests = get_random_tasks(test_sample, task_set[0])

                update_completed_tasks(tests, 'tests')

                test_data = group_tests(tests)

                response['tests'] = test_data
            if task_set[1]:
                connection_definition_sample = list(Connection_definition.objects.all().values())
                connection_definitions = get_random_tasks(connection_definition_sample, task_set[1])

                update_completed_tasks(connection_definitions, 'connection_definitions')

                connection_data = group_connection_definitions(connection_definitions)

                response['connections_definition'] = connection_data
            if task_set[2]:
                exercises_sample = list(Exercise.objects.all().values())
                exercises = get_random_tasks(exercises_sample, task_set[2])

                update_completed_tasks(exercises, 'exercises')

                exercises_data = group_exercises(exercises)

                response['exercises'] = exercises_data

    return JsonResponse(response)


def update_results(request):
    session_key = request.session.session_key
    user_data = request.POST

    Results_compliting_task.objects.filter(session_key=session_key).update(tests = user_data['test'],
                                                                           connection_definition = user_data['connection_definition'],
                                                                           exercise = user_data['exercises'])
    return JsonResponse({})