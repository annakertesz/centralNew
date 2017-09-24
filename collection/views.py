import json

import os

from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response
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
from django.contrib.auth import logout


def admin_check(user):
    return user.is_staff


@api_view(['GET'])
def song_list(request):
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


@api_view(['GET'])
@user_passes_test(admin_check)
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def album_list(request):
    if request.GET.get('artist') != None:
        albums = Album.objects.filter(artist=request.GET.get('artist'))
    else:
        albums = Album.objects.all()
    serializer = AlbumSerializer(albums, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def artist_list(request):
    artists = Artist.objects.all()
    serializer = ArtistSerializer(artists, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def add_to_playlist(request):
    playlist = Playlist.objects.get(id=request.GET.get('playlist'))
    song = Song.objects.get(id=request.GET.get('song'))
    print("Adding '" + song.name + "' to '" + playlist.playlist_name + "'")
    PlaylistHandler.add_song_to_playlist(playlist, song)
    serializer = PlaylistSerializer(Playlist.objects.all(), many=True)
    return Response(serializer.data)


@api_view(['GET'])
def playlist_list(request):
    playlists = PlaylistHandler.get_playlists_of_user(request.user)
    serializer = PlaylistSerializer(playlists, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def add_new_playlist(request):
    playlist_name = request.GET.get('name')
    playlist = PlaylistHandler.add_new_playlist(playlist_name, request.user)
    return Response(playlist.id)


@api_view(['GET'])
def song_list_from_playlist(request):
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


@api_view(['GET'])
@user_passes_test(admin_check)
def edit_song(request):
    json_data = request.GET.get('data')
    data = json.loads(json_data)
    print("edit song: " + str(data["title"]))
    CollectionDao.edit_song(data["id"], data["title"], data["album"], data["artist"], data["tags"])
    return Response("success")


def log_user_out(request):
    logout(request)
    return redirect(reverse('login'))


def home(request):
    if not request.user.is_authenticated:
        return redirect(reverse('login'))
    # CollectionDao.add_tags_for_songs()
    return render(request, 'collection/index.html', {'user': request.user})


@api_view(['GET'])
@user_passes_test(admin_check)
def delete_song(request):
    song = Song.objects.get(id=request.GET.get('id'))
    os.remove(MEDIA_ROOT + "/" + song.path)
    Song.objects.filter(id=request.GET.get('id')).delete()
    return render(request, 'collection/index.html', {'user': request.user})


@api_view(['GET'])
@user_passes_test(admin_check)
def add_user_to_playlist(request):
    playlist = Playlist.objects.get(id=request.GET.get('playlist_id'))
    user = User.objects.get(id=request.GET.get('user_id'))
    print("Adding user '" + user.username + "' to '" + playlist.playlist_name + "'")
    PlaylistHandler.add_user_to_playlist(playlist, user)
    return Response("success")


@api_view(['GET'])
def send_email(request):
    song = Song.objects.get(id=request.GET.get('id'))
    user = request.user
    print("Trying to send mail")
    resp = send_mail(
        'Licence', # subject
        'Dear Admin, \n' + user.username + 'wants to buy a song. \nData of the song: \n' + song.name +
        '\n-' + song.album.album_name + '\n-' + song.artist.artist_name +
        '\n\n And the user: \n' + user.username + '\nname: ' + user.first_name + ' ' + user.last_name + '\nemail:' + user.email,
        'centralpublishingemail@gmail.com', # from_email
        ['kerteszannanak@gmail.com'], # recipient list
        fail_silently = False
    )
    print("Email sent")
    return Response("Number of emails sent: " + str(resp) )
