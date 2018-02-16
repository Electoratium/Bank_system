from django.contrib import admin
from .models import *


class Tests_admin(admin.ModelAdmin):
    list_display = [field.name for field in Tests._meta.fields]
    search_fields = ['question']

    class Meta:
        model = Tests


admin.site.register(Tests, Tests_admin)


class Connect_definition_admin(admin.ModelAdmin):
    list_display = [field.name for field in Connection_definition._meta.fields]

    class Meta:
        model = Connection_definition


admin.site.register(Connection_definition, Connect_definition_admin)


class Exercise_admin(admin.ModelAdmin):
    list_display = [field.name for field in Exercise._meta.fields]
    search_fields = ['title']

    class Meta:
        model = Exercise


admin.site.register(Exercise, Exercise_admin)


class Results_admin(admin.ModelAdmin):
    list_display = ('name', 'tests', 'connection_definition', 'exercise', 'created', 'updated')
    search_fields = ['name']
    fieldsets = (
        (None, {
            'fields': ('name', 'tests', 'connection_definition', 'exercise')
        }),
        ('Service information', {
            'classes': ('collapse',),
            'fields': ('session_key', 'completed_tests_id', 'completed_connections_id', 'completed_exercises_id')
        }),
    )

    class Meta:
        model = Results_compliting_task


admin.site.register(Results_compliting_task, Results_admin)


class Set_tasks_admin(admin.ModelAdmin):
    list_display = [field.name for field in Set_tasks._meta.fields]


    class Meta:
        model = Set_tasks


admin.site.register(Set_tasks, Set_tasks_admin)

