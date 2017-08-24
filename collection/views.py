import eyed3
import io

from PIL import Image
from django.contrib.auth import login, authenticate
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
# from django.urls import reverse
from django.urls import reverse
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse

from central_publishing_new.settings import MEDIA_ROOT
from collection import CollectionDao
from collection.CollectionDao import simple_search
from collection.forms import SignUpForm, SongAddForm
from collection.models import Song, Album, Artist, Tag, Playlist
from collection.playlistHandler import PlaylistHandler
from collection.serializers import SongSerializer, AlbumSerializer, ArtistSerializer, PlaylistSongSerializer, \
    PlaylistSerializer


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


def get_artwork(request):
    song = Song.objects.get(id= request.GET.get('id'))
    song_data = eyed3.load(MEDIA_ROOT + '/' + song.path)
    image = song_data.tag.images[0]
    im = io.BytesIO(image.render())
    return HttpResponse(im, content_type='image/JPG')



def home(request):
    if not request.user.is_authenticated:
        return redirect(reverse('login'))
    return render(request, 'collection/index.html', {'user': request.user})


def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('home')
    else:
        form = SignUpForm()
    return render(request, 'registration/signup.html', {'form': form})