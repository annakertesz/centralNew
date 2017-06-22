from django.contrib.auth import login, authenticate
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
# from django.urls import reverse
from django.urls import reverse
from rest_framework.response import Response
from rest_framework.views import APIView

from collection import CollectionDao
from collection.forms import SignUpForm, SongAddForm
from collection.models import Song, Album, Artist, MusicFile, Tag
from collection.serializers import SongSerializer, AlbumSerializer, ArtistSerializer, PlaylistSongSerializer


class SongList(APIView):

    def get(self, request):
        if request.GET.get('album') != None:
            songs = Song.objects.filter(album=request.GET.get('album'))

        elif request.GET.get('artist') != None:
            songs = Song.objects.filter(artist=request.GET.get('artist'))

        elif request.GET.get('keywords') != None:
            songs = CollectionDao.CollectionDao.simple_search(request.GET.get('keywords'), True)

        else:
            songs = Song.objects.all()
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)



class AlbumList(APIView):

    def get(self, request):
        albums = Album.objects.all()
        serializer = AlbumSerializer(albums, many=True)
        return Response(serializer.data)


class ArtistList(APIView):

    def get(self, request):
        artists = Artist.objects.all()
        serializer = ArtistSerializer(artists, many=True)
        return Response(serializer.data)


class PlaylistList(APIView):

    def get(self, request):
        print("jujuuuu")
        playlists = request.user.playlists.all()
        serializer = PlaylistSongSerializer(playlists, many=True)
        print(request.user)
        return Response(serializer.data)


def add_song(request):
    if request.method == 'POST':
        data = SongAddForm(request.POST, request.FILES)
        if data.is_valid():
            instance = MusicFile(music_file=request.FILES['song'])
            file_name = request.FILES['song'].name
            instance.save()
            CollectionDao.CollectionDao.add_song(instance, file_name)
            return HttpResponseRedirect('/')
        else: print('fokkyuuu')
    else:
        form = SongAddForm()
        return render(request, 'collection/browser/add_song.html', {'form': form})


def home(request):
    if not request.user.is_authenticated:
        return redirect(reverse('login'))
    return render(request, 'collection/home.html', {'user': request.user})


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