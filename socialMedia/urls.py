from django.conf.urls import url, include
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    url(r'^$', views.indexView.as_view(), name='index'),
    url(r'^login/?$', auth_views.login, name='login'),
    url(r'^logout/?$', auth_views.logout, {'next_page': '/'}, name='logout'),
]
