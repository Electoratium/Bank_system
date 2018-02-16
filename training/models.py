from django.db import models


class Tests(models.Model):
    correct_answer = models.IntegerField(default=0, blank=True)
    question = models.CharField(max_length=300, blank=True)
    answer_1 = models.CharField(max_length=200, blank=True)
    answer_2 = models.CharField(max_length=200, blank=True)
    answer_3 = models.CharField(max_length=200, blank=True)
    answer_4 = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name = "Тест"
        verbose_name_plural = "Тести"


class Connection_definition(models.Model):
    concept_1 = models.CharField(max_length=64, blank=True)
    concept_2 = models.CharField(max_length=64, blank=True)
    concept_3 = models.CharField(max_length=64, blank=True)
    concept_4 = models.CharField(max_length=64, blank=True)
    definition_1 = models.CharField(max_length=200, blank=True)
    definition_2 = models.CharField(max_length=200, blank=True)
    definition_3 = models.CharField(max_length=200, blank=True)
    definition_4 = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name = "З'єднання понять та їх визначень"
        verbose_name_plural = "З'єднання понять та їх визначень"


class Exercise(models.Model):
    title = models.CharField(max_length=64, blank=True, default='Задача')
    condition = models.CharField(max_length=500, blank=True)
    correct_answer = models.FloatField(default=0, blank=True)
    hint = models.CharField(max_length=150, blank=True)
    resolving_hint = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name = "Задача"
        verbose_name_plural = "Задачі"


class Results_compliting_task(models.Model):
    name = models.CharField(max_length=64, blank=False)
    session_key = models.CharField(max_length=128, blank=True, null=True)
    tests = models.CharField(max_length=64, default='0/0')
    connection_definition = models.CharField(max_length=128, default='0/0')
    exercise = models.CharField(max_length=128, default='0/0')
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)
    completed_tests_id = models.CharField(max_length=128, blank=True)
    completed_connections_id = models.CharField(max_length=128, blank=True)
    completed_exercises_id = models.CharField(max_length=128, blank=True)


    class Meta:
        verbose_name = "Результат"
        verbose_name_plural = "Результати"



class Set_tasks(models.Model):
    tests = models.IntegerField(default=0)
    connection_definition = models.IntegerField(default=0)
    exercise = models.IntegerField(default=0)


    class Meta:
        verbose_name = "Стек завдань"
        verbose_name_plural = "Стек завдань"