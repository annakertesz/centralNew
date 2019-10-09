import eyed3
from django.db import models
from django.contrib.auth.models import User


# class MusicFile(models.Model):
#     music_file = models.FileField(upload_to='')





class Artist(models.Model):
    artist_name = models.CharField(max_length=100)

class Album(models.Model):
    album_name = models.CharField(max_length=100)
    artist = models.ForeignKey(Artist, related_name='artist', on_delete=models.CASCADE)
    cover = models.CharField(max_length=100, default='default_image')

class Song(models.Model):
    path = models.CharField(max_length=150)
    album = models.ForeignKey(Album, related_name='name', on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

class SongToEdit(models.Model):
    path = models.CharField(max_length=150)
    name = models.CharField(max_length=100)


class Tag(models.Model):
    tag_name = models.CharField(max_length=100, default='DEFAULT')


class TagSongMap(models.Model):
    tag = models.ForeignKey(Tag, related_name='tag', on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)


class Playlist(models.Model):
    playlist_name = models.CharField(max_length=100)


class PlaylistUserMap(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class PlaylistSongMap(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
