# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-12-10 10:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calculation', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='original_data',
            name='Cpa',
            field=models.FloatField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='original_data',
            name='Wa',
            field=models.FloatField(blank=True, default=0),
        ),
    ]
