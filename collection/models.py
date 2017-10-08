import eyed3
from django.db import models
from django.contrib.auth.models import User


# class MusicFile(models.Model):
#     music_file = models.FileField(upload_to='')





class Artist(models.Model):
    artist_name = models.CharField(max_length=30)

class Album(models.Model):
    album_name = models.CharField(max_length=30)
    artist = models.ForeignKey(Artist, related_name='artist')
    cover = models.CharField(max_length=30, default='default_image')

class Song(models.Model):
    path = models.CharField(max_length=150)
    album = models.ForeignKey(Album, related_name='name')
    artist = models.ForeignKey(Artist)
    name = models.CharField(max_length=60)

class SongToEdit(models.Model):
    path = models.CharField(max_length=150)
    name = models.CharField(max_length=60)


class Tag(models.Model):
    tag_name = models.CharField(max_length=20, default='DEFAULT')


class TagSongMap(models.Model):
    tag = models.ForeignKey(Tag, related_name='tag')
    song = models.ForeignKey(Song)


class Playlist(models.Model):
    playlist_name = models.CharField(max_length=60)


class PlaylistUserMap(models.Model):
    playlist = models.ForeignKey(Playlist)
    user = models.ForeignKey(User)


class PlaylistSongMap(models.Model):
    playlist = models.ForeignKey(Playlist)
    song = models.ForeignKey(Song)
