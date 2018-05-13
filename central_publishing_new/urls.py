"""central_publishing_new URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
import django
from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views.generic import RedirectView

from central_publishing_new import settings
from collection import views

urlpatterns = [
    url(r'^api/', include('collection.urls')),
    url(r'^home/$', views.home, name='home'),
    url(r'^sent_playlist/$', views.sent_playlist, name='sent_playlist'),
    url(r'^login/$', auth_views.login, name='login'),
    url(r'^logout/$', views.log_user_out, name='logout'),
    url(r'^$', RedirectView.as_view(url='/home')),
    url(r'^media/(?P<path>.*)$', django.views.static.serve, {'document_root': settings.MEDIA_ROOT}),
    url(r'^admin/', admin.site.urls),
    url(r'^download/(?P<file_name>.+)$', views.download, name='download'),
    url(r'^upload/', include('fileupload.urls')),
]
