# encoding: utf-8
from django.conf.urls import url
from django.core import wsgi

from fileupload.views import (
        BasicVersionCreateView
        )
wsgi


urlpatterns = [
    url(r'^basic/$', BasicVersionCreateView.as_view(), name='upload-basic')
]
