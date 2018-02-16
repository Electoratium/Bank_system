# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-12-16 15:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calculation', '0006_auto_20171216_1739'),
    ]

    operations = [
        migrations.CreateModel(
            name='Additional_data',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('probability_rate_profit', models.FloatField(default=0.9973)),
            ],
            options={
                'verbose_name': 'Допоміжна змінна',
                'verbose_name_plural': 'Додаткові данні',
            },
        ),
        migrations.RemoveField(
            model_name='original_data',
            name='probability_rate_profit',
        ),
    ]
