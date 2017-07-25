from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse

from collection import CollectionDao
from collection.models import Song, Album, Artist, Tag
from custom_admin.forms import SongAddForm, SearchForm


def home(request):
    if not (request.user.is_authenticated and request.user.is_staff):
        return redirect(reverse('login'))
    return render(request, 'custom_admin/index.html', {'user': request.user})

def usermanager(request):
    if not (request.user.is_authenticated and request.user.is_staff):
        return redirect(reverse('login'))
    return render(request, 'custom_admin/usermanager.html', {'user': request.user})

def songdetails(request):
    if not (request.user.is_authenticated and request.user.is_staff):
        return redirect(reverse('login'))
    return render(request, 'custom_admin/songdetails.html', {'user': request.user})

def playlistmanager(request):
    if not (request.user.is_authenticated and request.user.is_staff):
        return redirect(reverse('login'))
    return render(request, 'custom_admin/playlistmanager.html', {'user': request.user})

def songmanager(request):
    if not request.user.is_authenticated:
        return redirect(reverse('login'))

    albums = Album.objects.all()
    artists = Artist.objects.all()
    tags = Tag.objects.all()


    if request.method == 'POST':
        # search_form = SearchForm(request.POST)
        # if search_form.is_valid():
        #     print("why is it valid")
        #     print(search_form.cleaned_data['keywords'])
        #     songs = CollectionDao.CollectionDao.simple_search(search_form.cleaned_data['keywords'], search_form.cleaned_data['isExact'])
        # else:
        #     print("I'M in the else stuff")
        #     songs = Song.objects.all()
        #     add_form = SongAddForm(request.POST)
        #     if add_form.is_valid():
        #         print("SUCCESS")
        #     else:
        #         print("not a valid input")

        songs = Song.objects.all()
        add_form = SongAddForm(request.POST, request.FILES)
        if add_form.is_valid():
            print("SUCCESS")
            add_form = SongAddForm()
        else:
            print("add song is not valid")
            search_form = SearchForm(request.POST)
            if search_form.is_valid():
                search_form = SearchForm()
                print("why is it valid")
                print(search_form.cleaned_data['keywords'])
                songs = CollectionDao.CollectionDao.simple_search(search_form.cleaned_data['keywords'],
                                                                  search_form.cleaned_data['isExact'])
            else:
                print("Mistake")
    else:
        search_form = SearchForm()
        add_form = SongAddForm()
        if request.GET.get('album') != None:
            songs = Song.objects.filter(album=request.GET.get('album'))

        elif request.GET.get('artist') != None:
            songs = Song.objects.filter(artist=request.GET.get('artist'))

        # elif request.GET.get('tag') != None:
        #     songs = Song.objects.
        else:
            songs = Song.objects.all()
    return render(request, 'custom_admin/songmanager.html',
                  {'all_song': songs, 'albums': albums, 'artists': artists, 'tags': tags, 'search_form': search_form, 'add_form': add_form})

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
