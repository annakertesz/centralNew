from django.conf.urls import url

from collection import views

urlpatterns = [

    url(r'^songs/$', views.SongList.as_view(), name='songlist'),
    url(r'^albums/$', views.AlbumList.as_view(), name='albumlist'),
    url(r'^artists/$', views.ArtistList.as_view(), name='artistlist'),
    url(r'^playlists/$', views.PlaylistList.as_view(), name='playlistlist'),
    url(r'^songs_of_playlists/$', views.SongListFromPlaylist.as_view(), name='songs_from_playlists'),
    url(r'^add_song/$', views.add_song, name='add_song'),

]