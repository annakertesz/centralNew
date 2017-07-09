# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-06-29 09:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collection', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='playlistusermap',
            name='playlist',
        ),
        migrations.RemoveField(
            model_name='playlistusermap',
            name='user',
        ),
        migrations.AddField(
            model_name='album',
            name='artwork_path',
            field=models.CharField(default='no_artwork', max_length=40),
        ),
        migrations.DeleteModel(
            name='PlaylistUserMap',
        ),
    ]
