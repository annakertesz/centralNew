from django.conf.urls import url

from custom_admin import views

urlpatterns = [

    url(r'^$', views.home, name='songlist'),
    url(r'^songmanager/$', views.songmanager, name='song_manager'),
    url(r'^usermanager/$', views.usermanager, name='user_manager'),
    url(r'^songdetails/$', views.songdetails, name='song_details'),
    url(r'^playlistmanager/$', views.playlistmanager, name='playlist_manager')

]