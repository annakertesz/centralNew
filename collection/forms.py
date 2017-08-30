import os
from random import choice
from string import ascii_lowercase
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from central_publishing_new.settings import MEDIA_ROOT



def content_file_name(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s_%s.%s" % (instance.user.id, instance.questid.id, ext)
    return os.path.join('uploads', filename)


