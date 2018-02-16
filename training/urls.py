from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^training/$', views.training, name='training'),
    url(r'^start_training/$', views.start_training, name='start_training')
]