from django.conf.urls import url

from collection import views

urlpatterns = [

    url(r'^songs/$', views.SongList.as_view(), name='songlist'),
    url(r'^albums/$', views.AlbumList.as_view(), name='albumlist'),
    url(r'^artists/$', views.ArtistList.as_view(), name='artistlist'),
    url(r'^playlists/$', views.PlaylistList.as_view(), name='playlistlist'),
    url(r'^add_song/$', views.add_song, name='add_song'),

]