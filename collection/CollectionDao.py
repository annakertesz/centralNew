import sys

import eyed3

from central_publishing_new.settings import MEDIA_ROOT
from collection.models import Album, Artist, Song, Tag, TagSongMap


def simple_search(string, isExact): #TODO: exact mode returns everything
    sys.stdout.write('simple search')
    if len(string) == 0:
        return Song.objects.all()

    was_filtered = True
    keyword_list = string.split(' ')
    artist_list = []
    album_list = []
    tag_list = []
    name_list = []

    for keyword in keyword_list:
        found = False
        objects = Artist.objects.filter(artist_name__icontains=keyword)
        print("\nartists:")
        for item in objects:
            artist_list.append(item.id)
            print(item.artist_name)
            found=True

        objects = Song.objects.filter(name__icontains=keyword)
        print('\ntitle:')
        for item in objects:
            name_list.append(item.name)
            print(item.name)
            found = True

        objects = Album.objects.filter(album_name__icontains=keyword)
        print('\nalbum:')
        for item in objects:
            album_list.append(item.id)
            print(item.album_name)
            found = True

        objects = Tag.objects.filter(tag_name__icontains=keyword)
        print('\ntag:')
        for item in objects:
            tag_list.append(item.id)
            print(item.tag_name)
            found = True

        if not found:
            return None

    if isExact:

        result = Song.objects.all()

        artist_result = []
        for artist in artist_list:
            artist_result += result.filter(artist=artist)
            was_filtered = True

        album_result = []
        for album in album_list:
            album_result += result.filter(album=album)
            was_filtered = True

        name_result =[]
        for name in name_list:
            name_result += result.filter(name=name)
            was_filtered = True

        tag_result=[]
        for tag in tag_list:
            rel_list = TagSongMap.objects.filter(tag=tag)
            for item in rel_list:
                tag_result += result.filter(id=item.song.id)
            # for item in rel_list:
            #     tag_result += item.song
            was_filtered = True

        if len(artist_result) == 0: artist_result = Song.objects.all()
        if len(album_result) == 0: album_result = Song.objects.all()
        if len(name_result) == 0: name_result = Song.objects.all()
        if len(tag_result) == 0: tag_result = Song.objects.all()
        if was_filtered: return set(tag_result).intersection(set(name_result).intersection(set(artist_result).intersection(album_result)))
        return None

    else:
        result = []
        for artist in artist_list:
            result += Song.objects.filter(artist=artist)
            was_filtered = True
        for album in album_list:
            result += Song.objects.filter(album=album)
            was_filtered = True
        for name in name_list:
            result += Song.objects.filter(name=name)
            was_filtered = True
    if was_filtered: return set(result)
    return None


def add_tags_for_songs():
    songs = Song.objects.all()
    for song in songs:
        file = eyed3.load(MEDIA_ROOT + '/' + song.path)
        try:
            for t in file.tag.genre._name.split(' / '):
                try:
                    tag = Tag.objects.get(tag_name=t)
                except Tag.DoesNotExist:
                    print("new tag: "+t)
                    tag = Tag(tag_name=t)
                    tag.save()
                relation = TagSongMap(tag=tag, song=song)
                relation.save()
        except AttributeError:
            print("has no genre")


def edit_song(id, title, tags):
    song = Song.objects.get(id=id)
    file = eyed3.load(MEDIA_ROOT + '/' + song.path)
    if song.name != title:
        song.name = title
        file.tag.title = title
        file.tag.save(MEDIA_ROOT + '/' + song.path)
    TagSongMap.objects.filter(song=id).delete()
    for t in tags.split(', '):
        try:
            tag = Tag.objects.get(tag_name=t)
        except Tag.DoesNotExist:
            tag = Tag(tag_name=t)
            tag.save()
        relation = TagSongMap(tag=tag, song=song)
        relation.save()
    song.save()