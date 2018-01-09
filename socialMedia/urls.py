from django.conf.urls import url, include
from django.contrib.auth import views as auth_views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.documentation import include_docs_urls
from . import views

apipatterns = [
    url(r'^profiles/$', views.ProfileList.as_view()),
    url(r'^profiles/(?P<pk>[0-9]+|me)/?$', views.ProfileDetail.as_view()),
    url(r'^posts/$', views.PostList.as_view()),
    url(r'^posts/new/?$', views.PostCreate.as_view()),
    url(r'^posts/(?P<pk>[0-9]+|me)/?$', views.PostDetail.as_view()),
    url(r'^posts/(?P<pk>[0-9]+|me)/share/?$', views.PostShare.as_view()),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^docs/?', include_docs_urls(title='Social Media API service')),
]

apipatterns = format_suffix_patterns(apipatterns)

urlpatterns = [
    url(r'^$', views.indexView.as_view(), name='index'),
    url(r'^my-profile$', views.indexView.as_view(), name='index'), # Temporary
    url(r'^profile/(?P<pk>[0-9]+)$', views.indexView.as_view(), name='index'),
    url(r'^chats$', views.indexView.as_view(), name='index'),
    url(r'^chats/(?P<pk>[0-9]+)$', views.indexView.as_view(), name='index'),
    url(r'^settings$', views.indexView.as_view(), name='index'),
    url(r'^login/?$', auth_views.login, name='login'),
    url(r'^logout/?$', auth_views.logout, {'next_page': '/'}, name='logout'),
    url(r'^api/', include(apipatterns)),
]
