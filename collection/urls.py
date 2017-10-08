from django.conf.urls import url

from collection import views

urlpatterns = [

    url(r'^songs/$', views.song_list, name='songlist'),
    url(r'^albums/$', views.album_list, name='albumlist'),
    url(r'^artists/$', views.artist_list, name='artistlist'),
    url(r'^playlists/$', views.playlist_list, name='playlistlist'),
    url(r'^songs_of_playlists/$', views.song_list_from_playlist, name='songs_from_playlists'),
    url(r'^add_new_playlist/$', views.add_new_playlist, name='add_new_playlist'),
    url(r'^add_song_to_playlist/$', views.add_to_playlist, name='add_song_to_playlists'),
    url(r'^delete_song_from_playlist/$', views.delete_song_from_playlist, name='delete_song_from_playlist'),
    url(r'^users/$', views.user_list, name='userlist'),
    url(r'^tags/$', views.get_tags, name='taglist'),
    url(r'^edit_song/$', views.edit_song, name='edit_song'),
    url(r'^delete_song/$', views.delete_song, name='delete_song'),
    url(r'^send_mail/$', views.send_email, name='email'),
    url(r'^add_user_to_playlist/$', views.add_user_to_playlist, name='id')

]