# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-02-25 13:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('training', '0005_auto_20180221_1354'),
    ]

    operations = [
        migrations.AlterField(
            model_name='connection_definition',
            name='definition_1',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AlterField(
            model_name='connection_definition',
            name='definition_2',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AlterField(
            model_name='connection_definition',
            name='definition_3',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AlterField(
            model_name='connection_definition',
            name='definition_4',
            field=models.CharField(blank=True, max_length=150),
        ),
    ]
