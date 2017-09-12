import json
import mimetypes
from wsgiref.util import FileWrapper

import eyed3
import io

import os

from django.contrib.auth.models import User
from django.core.files import File
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils.encoding import smart_str
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse, Http404

from central_publishing_new import settings
from central_publishing_new.settings import MEDIA_ROOT
from collection import CollectionDao
from collection.CollectionDao import simple_search
from collection.models import Song, Album, Artist, Tag, Playlist
from collection.PlaylistHandler import PlaylistHandler
from collection.serializers import SongSerializer, AlbumSerializer, ArtistSerializer, PlaylistSongSerializer, \
    PlaylistSerializer, UserSerializer
from django.core.mail import send_mail


class SongList(APIView):

    def get(self, request):
        if request.GET.get('album') != None:
            songs = Song.objects.filter(album=request.GET.get('album'))

        elif request.GET.get('artist') != None:
            songs = Song.objects.filter(artist=request.GET.get('artist'))

        elif request.GET.get('keywords') != None:
            songs = simple_search(request.GET.get('keywords'), True)

        else:
            songs = Song.objects.all()
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)


class UserList(APIView):

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        print(serializer.data)
        return Response(serializer.data)


class AlbumList(APIView):

    def get(self, request):
        if request.GET.get('artist') != None:
            albums = Album.objects.filter(artist=request.GET.get('artist'))
        else:
            albums = Album.objects.all()
        serializer = AlbumSerializer(albums, many=True)
        return Response(serializer.data)


class ArtistList(APIView):

    def get(self, request):
        artists = Artist.objects.all()
        serializer = ArtistSerializer(artists, many=True)
        return Response(serializer.data)


class AddToPlaylist(APIView):

    def get(self, request):
        playlist = Playlist.objects.get(id=request.GET.get('playlist'))
        song = Song.objects.get(id=request.GET.get('song'))
        PlaylistHandler.add_song_to_playlist(playlist, song)
        serializer = PlaylistSerializer(Playlist.objects.all(), many=True)
        return Response(serializer.data)


class PlaylistList(APIView):

    def get(self, request):
        playlists = PlaylistHandler.get_playlists_of_user(request.user)
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data)


class AddNewPlaylist(APIView):

    def get(self, request):
        playlist_name = request.GET.get('name')
        playlist = PlaylistHandler.add_new_playlist(playlist_name, request.user)
        return Response(playlist.id)


class SongListFromPlaylist(APIView):

    def get(self, request):
        playlist_id = request.GET.get('playlist')
        songlist = PlaylistHandler.get_songs_from_playlist(playlist_id)
        serializer = SongSerializer(songlist, many=True)
        return Response(serializer.data)


def download(request, file_name):
    file_path = os.path.join(settings.MEDIA_ROOT, file_name)
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type="application/vnd.ms-excel")
            response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
            return response
    raise Http404

class EditSong(APIView):

    def get(self, request):

        #TODO: delete this experiment!

        json_data = request.GET.get('data')
        data = json.loads(json_data)
        print(data["title"])

        CollectionDao.edit_song(data["id"], data["title"], data["album"], data["artist"], data["tags"])
        return Response("success")

def home(request):
    if not request.user.is_authenticated:
        return redirect(reverse('login'))
    # CollectionDao.add_tags_for_songs()
    return render(request, 'collection/index.html', {'user': request.user})




def delete_song(request):
    if request.user.is_authenticated:
        song = Song.objects.get(id=request.GET.get('id'))
        os.remove(MEDIA_ROOT +"/" + song.path)
        Song.objects.filter(id=request.GET.get('id')).delete()
    return render(request, 'collection/index.html', {'user': request.user})



def add_user_to_playlist(request):
    playlist = Playlist.objects.get(id=request.get('playlist_id'))
    user = User.objects.get(id=request.get('user_id'))
    PlaylistHandler.add_user_to_playlist(playlist, user)

def send_email(request):
    song = Song.objects.get(id=request.GET.get('id'))
    user = request.user
    print("start mail")
    send_mail(
        'Licence',
        'Dear Admin, \n user.username wants to buy a song. \n data of the song: \n' + song.name + '\n-' + song.album.album_name + '\n-' + song.artist.artist_name +
        '\n\n And the user: \n' + user.username + '\n' + user.first_name+' ' + user.last_name + '\n' + user.email,
        'kerteszannanak@gmail.com',
        ['kerteszannanak@gmail.com'],
        fail_silently=False,
    )
    print("sent")