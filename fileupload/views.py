# encoding: utf-8
import json
import os

from django.http import HttpResponse
from django.views.generic import CreateView, DeleteView, ListView

from central_publishing_new import settings
from .models import MusicFile
from .response import JSONResponse, response_mimetype
from .serialize import serialize
from collection import CollectionDao


class PictureCreateView(CreateView):
    model = MusicFile
    fields = "__all__"

    def form_valid(self, form):
        self.object = form.save()
        print(self.object.file.path)

        files = [serialize(self.object)]
        path = self.create_new_filename()
        os.rename(self.object.file.path, path)

        data = {'files': files}
        response = JSONResponse(data, mimetype=response_mimetype(self.request))
        response['Content-Disposition'] = 'inline; filename=files.json'
        print(self.get_file_name(path))
        CollectionDao.add_song(self.get_file_name(path))
        return response

    def form_invalid(self, form):
        data = json.dumps(form.errors)
        return HttpResponse(content=data, status=400, content_type='application/json')

    def create_new_filename(self):
        path = list(self.object.file.path)
        for i in range(len(path)-4, 0, -1):
            l = path[i-1]
            if l == " " or l == "." or l == "'":
                path[i - 1] = "_"
            elif l== "_" and path[i-2] == "_":
                path[i-1] = "-"
                path[i-2] = ""
            elif l == "/":
                break
        return "".join(path)

    def get_file_name(self, path):
        index = 0
        for i in range(len(path), 0, -1):
            l = path[i - 1]
            if l == "/":
                index = i
                break
        return "".join(path[index:])



class BasicVersionCreateView(PictureCreateView):
    template_name_suffix = '_basic_form'

class PictureDeleteView(DeleteView):
    model = MusicFile

    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()
        self.object.delete()
        response = JSONResponse(True, mimetype=response_mimetype(request))
        response['Content-Disposition'] = 'inline; filename=files.json'
        return response


class PictureListView(ListView):
    model = MusicFile

    def render_to_response(self, context, **response_kwargs):
        files = [ serialize(p) for p in self.get_queryset() ]
        data = {'files': files}
        response = JSONResponse(data, mimetype=response_mimetype(self.request))
        response['Content-Disposition'] = 'inline; filename=files.json'
        return response
