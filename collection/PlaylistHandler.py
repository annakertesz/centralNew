from collection.models import Playlist, PlaylistSongMap, Song, PlaylistUserMap


class PlaylistHandler:

    @classmethod
    def add_new_playlist(cls, playlist_name, user):
        playlist = Playlist(playlist_name=playlist_name)
        playlist.save()
        relation = PlaylistUserMap(playlist=playlist, user=user)
        relation.save()
        return playlist

    @classmethod
    def add_song_to_playlist(cls, playlist, song):
        relation = PlaylistSongMap(playlist=playlist, song=song)
        relation.save()

    @classmethod
    def get_songs_from_playlist(cls, playlist_id):
        songs = []
        try:
            playlist = Playlist.objects.get(id=playlist_id)
            for playlistSong in PlaylistSongMap.objects.filter(playlist=playlist):
                songs.append(playlistSong)
            return songs
        except Playlist.DoesNotExist:
            print("ERROR: Playlist " + playlist_id + " doesn't exist")

    @classmethod
    def get_playlists_of_user(cls, user):
        if user.is_superuser:
            playlists = Playlist.objects.all()
        else:
            playlist_list=PlaylistUserMap.objects.filter(user=user)
            playlists = []
            for playlist_item in playlist_list:
                playlists.append(playlist_item.playlist)
        return playlists

    @classmethod
    def add_user_to_playlist(cls, playlist, user):
        try:
            relation = PlaylistUserMap.objects.get(playlist=playlist, user=user)
            print("Adding user to playlist: relation already exists")
        except PlaylistUserMap.DoesNotExist:
            relation = PlaylistUserMap(playlist=playlist, user=user)
            print("relation created")
        relation.save()