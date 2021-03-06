import json

import os
import zipfile
import time

from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
# from django.core.urlresolvers import reverse
from rest_framework.decorators import api_view
# from rest_framework.views import APIView as api_view
from rest_framework.response import Response
from django.http import HttpResponse, Http404

from central_publishing_new import settings
from central_publishing_new.settings import MEDIA_ROOT
from collection import CollectionDao
from collection.CollectionDao import simple_search
from collection.models import Song, Album, Artist, Tag, Playlist, PlaylistSongMap, TagSongMap
from collection.PlaylistHandler import PlaylistHandler
from collection.serializers import SongSerializer, AlbumSerializer, ArtistSerializer, PlaylistSongSerializer, \
    PlaylistSerializer, UserSerializer, TagSerializer
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
def delete_song_from_playlist(request):
    playlist_song_id = request.GET.get('playlist_song_id')
    print("Deleting from playlist with id:" + playlist_song_id)
    PlaylistSongMap.objects.filter(id=playlist_song_id).delete()
    return Response("success")


def download_playlist(request):
    playlist_id = request.GET.get('playlist_id')
    print("Downloading playlist with id:" + playlist_id)
    file_name=createZipFile(playlist_id)
    file_path = os.path.join(settings.MEDIA_ROOT, file_name)
    print(file_path)
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type="application/zip")
            response['Content-Disposition'] = 'inline; filename=' + file_name
            deleteZipFile(file_name)
            return response
    print("not found")
    raise Http404


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
def get_tags(request):
    song_id = request.GET.get('id')
    tags = []
    song = Song.objects.get(id=song_id)
    for tag in TagSongMap.objects.filter(song=song).values('tag'):
        tags.append(Tag.objects.get(id=tag['tag']))
    serializer = TagSerializer(tags, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def song_list_from_playlist(request):
    playlist_id = request.GET.get('playlist')
    songlist = PlaylistHandler.get_songs_from_playlist(playlist_id)
    serializer = PlaylistSongSerializer(songlist, many=True)
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
    CollectionDao.edit_song(data["id"], data["title"], data["tags"])
    return Response("success")


def log_user_out(request):
    logout(request)
    return redirect('login')


def home(request):
    if not request.user.is_authenticated:
        return redirect('login')
    # CollectionDao.add_tags_for_songs()
    return render(request, 'collection/index.html', {'user': request.user})


@api_view(['GET'])
@user_passes_test(admin_check)
def delete_song(request):
    song_id = request.GET.get('id')
    song = Song.objects.get(id=song_id)
    os.remove(MEDIA_ROOT + "/" + song.path)
    Song.objects.filter(id=song_id).delete()
    return Response("Deleted song " + str(song_id))


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
    if (request.GET.get('id')!=None):
        song = Song.objects.get(id=request.GET.get('id'))
        user = request.user
        subject='License'
        message='Dear Admin, \n' + user.username + \
                ' wants to buy a song. \nData of the song: \n' + song.name +'\n-' + song.album.album_name + \
                '\n-' + song.artist.artist_name + '\n\n And the user: \n' + user.username + '\nname: ' + user.first_name + ' ' + \
                user.last_name + '\nemail:' + user.email
    else:
        subject='Registration request'
        message=request.GET.get('message')
    print("Trying to send mail")
    try:
        resp = send_mail(
            subject, # subject
            message,
            'centralpublishingemail@gmail.com', # from_email
            [settings.ADMIN_EMAIL], # recipient list
            fail_silently = False,
            auth_user=settings.EMAIL_HOST_USER,
            auth_password=settings.EMAIL_HOST_PASSWORD
        )
    except Exception:
        return Response(settings.ADMIN_EMAIL)
    print("Email sent")
    print(str(resp))
    return Response("success" )


def createZipFile(playlist_id):
    timestamp = "%.9f" % time.time()
    filename = timestamp.replace(".", "") + ".zip"
    zipFile = zipfile.ZipFile(os.path.join(settings.MEDIA_ROOT, filename), "w")

    songObjects = PlaylistSongMap.objects.filter(playlist=playlist_id)

    for songObject in songObjects:

        song=Song.objects.get(id=songObject.song_id)
        file_path = os.path.join(settings.MEDIA_ROOT, song.path)
        print(file_path)
        zipFile.write(file_path, song.path, compress_type=zipfile.ZIP_DEFLATED)
    return filename

def deleteZipFile(filename):
    os.remove(os.path.join(settings.MEDIA_ROOT, filename))