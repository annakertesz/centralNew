from rest_framework import serializers
from collection.models import Song, Album, Artist, Playlist, PlaylistSongMap


class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = ('id', 'album_name', 'cover')


class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ('id', 'artist_name')


class SongSerializer(serializers.ModelSerializer):

    album = AlbumSerializer()
    artist = ArtistSerializer()

    class Meta:
        model = Song
        fields = ('id', 'name', 'album', 'artist', 'path')


class PlaylistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Playlist
        fields = ('id', 'playlist_name')


class PlaylistSongSerializer(serializers.ModelSerializer):

    playlist = PlaylistSerializer
    song = SongSerializer

    class Meta:
        model = PlaylistSongMap
        fields = ('playlist', 'song')
