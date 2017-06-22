import os
from random import choice
from string import ascii_lowercase
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from central_publishing_new.settings import MEDIA_ROOT


class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    email = forms.EmailField(max_length=254)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', )


def content_file_name(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s_%s.%s" % (instance.user.id, instance.questid.id, ext)
    return os.path.join('uploads', filename)


class SongAddForm(forms.Form):
    song = forms.FileField()

    # def update_filename(instance):
    #     path = "upload/path/"
    #     format = instance.userid + instance.transaction_uuid + instance.file_extension
    #     return os.path.join(path, format)
