from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^complete_calculate', views.complete_calculate, name='complete_calculate'),
    url(r'^calculation/$', views.calculation, name='calculation'),
]