from django.contrib.auth.models import User
from rest_framework import serializers
from collection.models import Song, Album, Artist, Playlist, PlaylistSongMap, Tag, TagSongMap


class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = ('id', 'album_name', 'cover')


class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ('id', 'artist_name')

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'tag_name')



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

    song = SongSerializer

    class Meta:
        model = PlaylistSongMap
        fields = ('id', 'song')
        depth = 2  # Depth of serialization. Dunno why its needed here


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'id')
