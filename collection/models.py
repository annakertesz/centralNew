import eyed3
from django.db import models
from django.contrib.auth.models import User


class MusicFile(models.Model):
    music_file = models.FileField(upload_to='')


class Album(models.Model):
    album_name = models.CharField(max_length=30)


class Artist(models.Model):
    artist_name = models.CharField(max_length=30)


class Song(models.Model):
    path = models.CharField(max_length=150)
    album = models.ForeignKey(Album, related_name='name')
    artist = models.ForeignKey(Artist)
    name = models.CharField(max_length=60)


class Tag(models.Model):
    tag_name = models.CharField(max_length=20, default='DEFAULT')


class TagSongMap(models.Model):
    tag = models.ForeignKey(Tag)
    song = models.ForeignKey(Song)


class Playlist(models.Model):
    playlist_name = models.CharField(max_length=60)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="playlists")


class PlaylistSongMap(models.Model):
    playlist = models.ForeignKey(Playlist)
    song = models.ForeignKey(Song)


class PlaylistUserMap(models.Model):
    user = models.ForeignKey(User)
    playlist = models.ForeignKey(Playlist)


def add_song(cls, file):
    song = eyed3.load(file)
    try:
        album = Album.objects.get(album_name=song.tag.album)
    except Album.DoesNotExist:
        album = Album(album_name=song.tag.album)
        album.save()

    try:
        artist = Artist.objects.get(artist_name=song.tag.artist)
    except Artist.DoesNotExist:
        artist = Artist(artist_name=song.tag.artist)
        artist.save()

    song = Song(name=song.tag.title, artist=artist, album=album, path=file.name)
    song.save()