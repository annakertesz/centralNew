from django.contrib import admin

from collection.models import Album, Artist, Song, Tag, TagSongMap, Playlist, PlaylistSongMap

admin.site.register(Album)
admin.site.register(Artist)
admin.site.register(Song)
admin.site.register(Tag)
admin.site.register(TagSongMap)
admin.site.register(Playlist)
admin.site.register(PlaylistSongMap)


