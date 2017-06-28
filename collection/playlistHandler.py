from collection.models import Playlist, PlaylistSongMap, Song


class PlaylistHandler:

    @classmethod
    def add_new_playlist(cls, playlist_name, user):
        playlist = Playlist(playlist_name=playlist_name, user=user)
        playlist.save()
        return playlist;

    @classmethod
    def add_song_to_playlist(cls, playlist, song):
        relation = PlaylistSongMap(playlist=playlist, song=song)
        relation.save()

    @classmethod
    def get_songs_from_playlist(cls, playlist_id):
        songs = []
        playlist = Playlist.objects.get(id=playlist_id)
        for song in PlaylistSongMap.objects.filter(playlist=playlist).values('song'):
            songs.append(Song.objects.get(id=song['song']))
        return songs

    @classmethod
    def get_playlists_of_user(cls, user):
        playlists = Playlist.objects.filter(user=user)
        return playlists
