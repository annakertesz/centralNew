from central_publishing_new.settings import MEDIA_ROOT
from collection.models import Album, Artist, Song, Tag
import eyed3


class CollectionDao:

    @classmethod
    def add_song(cls, file, file_name):
        print("ADD SONG")
        song = eyed3.load(MEDIA_ROOT + '/' + file_name)
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

        song = Song(name=song.tag.title, artist=artist, album=album, path=file_name)
        song.save()

    @classmethod
    def simple_search(cls, string, isExact):
        print(string)
        was_filtered = False
        keyword_list = string.split(' ')
        artist_list = []
        album_list = []
        tag_list = []
        name_list = []

        for keyword in keyword_list:

            objects = Artist.objects.filter(artist_name__icontains=keyword)
            for item in objects:
                artist_list.append(item.id)

            objects = Song.objects.filter(name__icontains=keyword)
            for item in objects:
                name_list.append(item.name)

            objects = Album.objects.filter(album_name__icontains=keyword)
            for item in objects:
                album_list.append(item.id)

            objects = Tag.objects.filter(tag_name__icontains=keyword)
            for item in objects:
                tag_list.append(item.id)

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

            if len(artist_result) == 0: artist_result = Song.objects.all()
            if len(album_result) == 0: album_result = Song.objects.all()
            if len(name_result) == 0: name_result = Song.objects.all()
            if was_filtered: return set(name_result).intersection(set(artist_result).intersection(album_result))
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

