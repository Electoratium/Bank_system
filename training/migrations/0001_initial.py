# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-02-12 09:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Connection_definition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('concept_1', models.CharField(blank=True, max_length=64)),
                ('concept_2', models.CharField(blank=True, max_length=64)),
                ('concept_3', models.CharField(blank=True, max_length=64)),
                ('concept_4', models.CharField(blank=True, max_length=64)),
                ('definition_1', models.CharField(blank=True, max_length=200)),
                ('definition_2', models.CharField(blank=True, max_length=200)),
                ('definition_3', models.CharField(blank=True, max_length=200)),
                ('definition_4', models.CharField(blank=True, max_length=200)),
            ],
            options={
                'verbose_name': "З'єднання понять та їх визначень",
                'verbose_name_plural': "З'єднання понять та їх визначень",
            },
        ),
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, default='Задача', max_length=64)),
                ('condition', models.CharField(blank=True, max_length=500)),
                ('correct_answer', models.FloatField(blank=True, default=0)),
                ('hint', models.CharField(blank=True, max_length=150)),
                ('resolving_hint', models.CharField(blank=True, max_length=200)),
            ],
            options={
                'verbose_name': 'Задача',
                'verbose_name_plural': 'Задачі',
            },
        ),
        migrations.CreateModel(
            name='Results_compliting_task',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('session_key', models.CharField(blank=True, max_length=128, null=True)),
                ('tests', models.CharField(default='0/0', max_length=64)),
                ('connection_definition', models.CharField(default='0/0', max_length=128)),
                ('exercise', models.CharField(default='0/0', max_length=128)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('completed_tests_id', models.CharField(blank=True, max_length=128)),
                ('completed_connections_id', models.CharField(blank=True, max_length=128)),
                ('completed_exercises_id', models.CharField(blank=True, max_length=128)),
            ],
            options={
                'verbose_name': 'Результат',
                'verbose_name_plural': 'Результати',
            },
        ),
        migrations.CreateModel(
            name='Set_tasks',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tests', models.IntegerField(default=0)),
                ('connection_definition', models.IntegerField(default=0)),
                ('exercise', models.IntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Стек завдань',
                'verbose_name_plural': 'Стек завдань',
            },
        ),
        migrations.CreateModel(
            name='Tests',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('correct_answer', models.IntegerField(blank=True, default=0)),
                ('question_1', models.CharField(blank=True, max_length=200)),
                ('question_2', models.CharField(blank=True, max_length=200)),
                ('question_3', models.CharField(blank=True, max_length=200)),
                ('question_4', models.CharField(blank=True, max_length=200)),
            ],
            options={
                'verbose_name': 'Тест',
                'verbose_name_plural': 'Тести',
            },
        ),
    ]
