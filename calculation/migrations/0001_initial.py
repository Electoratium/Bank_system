# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-12-10 10:29
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Calculated_variants',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('variant', models.IntegerField(default=None, validators=[django.core.validators.MinValueValidator(1)])),
                ('average_profit_for_cp', models.FloatField(default=0)),
                ('realize_profit_bet_portfolio', models.FloatField(default=0)),
                ('sigma', models.FloatField(default=0)),
                ('corAB', models.FloatField(default=0)),
                ('corAC', models.FloatField(default=0)),
                ('corBC', models.FloatField(default=0)),
                ('betta_coef_Cpa', models.FloatField(default=0)),
                ('betta_coef_Cpb', models.FloatField(default=0)),
                ('betta_coef_Cpc', models.FloatField(default=0)),
                ('betta_coef_portfolio', models.FloatField(default=0)),
                ('required_profitability_for_active', models.FloatField(default=0)),
            ],
            options={
                'verbose_name': 'Розрахований варіант',
                'verbose_name_plural': 'Розраховані варіанти',
            },
        ),
        migrations.CreateModel(
            name='Original_data',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('securities', models.CharField(default=None, max_length=10)),
                ('year', models.IntegerField(default=None)),
                ('Cpa', models.FloatField(default=0)),
                ('Wa', models.FloatField(default=0)),
                ('Cpb', models.FloatField(default=0)),
                ('Wb', models.FloatField(default=0)),
                ('Cpc', models.FloatField(default=0)),
                ('Wc', models.FloatField(default=0)),
                ('Market', models.FloatField(default=0)),
            ],
            options={
                'verbose_name': 'Данні за конретний рік',
                'verbose_name_plural': 'Початкові данні',
            },
        ),
    ]
