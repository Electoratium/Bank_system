# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-12-16 15:51
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('calculation', '0008_auto_20171216_1749'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='additional_data',
            options={'verbose_name': 'Данні', 'verbose_name_plural': 'Додаткові данні'},
        ),
    ]
