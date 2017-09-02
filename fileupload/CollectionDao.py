import PIL
import io

from django import db
from django.utils.text import slugify

from central_publishing_new.settings import MEDIA_ROOT
from collection.models import Album, Artist, Song, Tag, SongToEdit
import eyed3
from eyed3.utils import art
from PIL import Image
import pathlib



class CollectionDao:

    is_busy = False

    def add_song(self, file_name):

        # TODO: iterate through albums and artists
        self.is_busy = True
        success = True
        song = eyed3.load(MEDIA_ROOT + '/' + file_name)
        try:
            artist = Artist.objects.get(artist_name=song.tag.artist)
        except Artist.DoesNotExist:
            artist = Artist(artist_name=song.tag.artist)
            try:
                artist.save()
            except db.utils.IntegrityError:
                success=False


        try:
            album = Album.objects.get(album_name=song.tag.album)
        except Album.DoesNotExist:
            album = Album(album_name=song.tag.album, artist=artist, cover=slugify(song.tag.album))
            try:
                album.save()
            except db.utils.IntegrityError:
                success=False


            images = art.getArtFromTag(song.tag)
            for image in images: # an mp3 file can  have multiple images
                img = Image.open(io.BytesIO(image.image_data))
                img = img.resize((300, 300), PIL.Image.ANTIALIAS)
                pathlib.Path(MEDIA_ROOT + "/covers/").mkdir(parents=True, exist_ok=True)
                img.save(MEDIA_ROOT + "/covers/" + slugify(song.tag.album)+".jpg")
                # print("saved image of " + song.tag.album)

        if success:
            song = Song(name=song.tag.title, artist=artist, album=album, path=file_name)
            song.save()
        else:
            song = SongToEdit(name=file_name, path=file_name)
            song.save()
        self.is_busy=False

