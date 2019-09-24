import os
import sys

import PIL
import io
from django.utils.text import slugify
from central_publishing_new.settings import MEDIA_ROOT
from collection.models import Album, Artist, Song
import eyed3
from eyed3.utils import art
from PIL import Image
import threading


class CollectionDao:

    lock = threading.RLock()

    def add_song(self, file_name):
        sys.stdout.write('\nadd_song:\n')
        with CollectionDao.lock: # lock the thread so it doesnt save the same album/artist twice
            # TODO: iterate through albums and artists
            song = eyed3.load(MEDIA_ROOT + '/' + file_name)
            sys.stdout.write('\nfilename : '+ file_name)
            sys.stdout.write('artist_name= ' + song.tag.artist)
            song.tag.artist='NewQueen2'
            try:
                sys.stdout.write('\nartist:' + song.tag.artist)
                artist = Artist.objects.get(artist_name=song.tag.artist)
            except Artist.DoesNotExist:
                sys.stdout.write('\n1')
                artist = Artist(artist_name=song.tag.artist)
                sys.stdout.write("\nNEW ARTIST :" + song.tag.artist)
                try:
                    sys.stdout.write('\n2')
                    artist.save()
                except Exception:
                    sys.stdout.write('\n3')
                    sys.stdout.write("\nartist save falied :" + Exception)
            except Exception:
                sys.stdout.write('\n4')
                sys.stdout.write("\nartist save falied :")
                sys.stdout.write(Exception)
                sys.stdout.write("\n...")
            try:
                sys.stdout.write('\nalbum:' + song.tag.album)
                album = Album.objects.get(album_name=song.tag.album)
            except Album.DoesNotExist:
                album = Album(album_name=song.tag.album, artist=artist, cover=slugify(song.tag.album))
                sys.stdout.write("\nNEW ALBUm :" + song.tag.album)
                try:
                    album.save()
                except Exception:
                    sys.stdout.write("\nartist save falied :" + Exception)
            images = art.getArtFromTag(song.tag)
            for image in images: # an mp3 file can  have multiple images
                img = Image.open(io.BytesIO(image.image_data))
                img = img.resize((300, 300), PIL.Image.ANTIALIAS)
                cover_dir = MEDIA_ROOT + "/covers/"
                if not os.path.exists(cover_dir):
                    os.makedirs(cover_dir)
                img.save(cover_dir + slugify(song.tag.album)+".jpg")
                # print("saved image of " + song.tag.album)
            song = Song(name=song.tag.title, artist=artist, album=album, path=file_name)
            song.save()