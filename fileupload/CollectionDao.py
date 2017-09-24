import PIL
import io
from django.utils.text import slugify
from central_publishing_new.settings import MEDIA_ROOT
from collection.models import Album, Artist, Song
import eyed3
from eyed3.utils import art
from PIL import Image
import pathlib
import threading


class CollectionDao:

    lock = threading.RLock()

    def add_song(self, file_name):
        with CollectionDao.lock: # lock the thread so it doesnt save the same album/artist twice
            # TODO: iterate through albums and artists
            song = eyed3.load(MEDIA_ROOT + '/' + file_name)
            try:
                artist = Artist.objects.get(artist_name=song.tag.artist)
            except Artist.DoesNotExist:
                artist = Artist(artist_name=song.tag.artist)
                print("NEW ARTIST:" + song.tag.artist)
                artist.save()
            try:
                album = Album.objects.get(album_name=song.tag.album)
            except Album.DoesNotExist:
                album = Album(album_name=song.tag.album, artist=artist, cover=slugify(song.tag.album))
                album.save()
                print("NEW ALBUM:" + song.tag.album)
            images = art.getArtFromTag(song.tag)
            for image in images: # an mp3 file can  have multiple images
                img = Image.open(io.BytesIO(image.image_data))
                img = img.resize((300, 300), PIL.Image.ANTIALIAS)
                pathlib.Path(MEDIA_ROOT + "/covers/").mkdir(parents=True, exist_ok=True)
                img.save(MEDIA_ROOT + "/covers/" + slugify(song.tag.album)+".jpg")
                # print("saved image of " + song.tag.album)
            song = Song(name=song.tag.title, artist=artist, album=album, path=file_name)
            song.save()