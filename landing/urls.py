from django.conf.urls import url
from landing import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
]