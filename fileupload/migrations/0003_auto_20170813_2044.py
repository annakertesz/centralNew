# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-08-13 20:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fileupload', '0002_auto_20170725_2042'),
    ]

    operations = [
        migrations.AlterField(
            model_name='musicfile',
            name='file',
            field=models.FileField(upload_to=''),
        ),
    ]
