from django.contrib import admin
from .models import *


class Original_data_securuties(admin.ModelAdmin):
    list_display = [field.name for field in Original_data._meta.fields]
    field = ['probability_rate_profit']
    search_fields = ["year"]

    class Meta:
        model = Original_data


admin.site.register(Original_data, Original_data_securuties)


class Calculated_variants_admin(admin.ModelAdmin):
    list_display = [field.name for field in Calculated_variants._meta.fields]

    class Meta:
        model = Calculated_variants

admin.site.register(Calculated_variants,Calculated_variants_admin)


class Additional_data_admin(admin.ModelAdmin):
    list_display = [field.name for field in  Additional_data._meta.fields]

    class Meta:
        model = Additional_data

admin.site.register(Additional_data,Additional_data_admin)