# encoding: utf-8
import json
import sys

from django.http import HttpResponse
from django.views.generic import CreateView

from .CollectionDao import *
from .models import MusicFile
from .response import JSONResponse, response_mimetype
from .serialize import serialize

import django.utils.text


class PictureCreateView(CreateView):
    model = MusicFile
    fields = "__all__"

    dao = CollectionDao()
    def form_valid(self, form):
        try:
            sys.stdout.write('from valid')
            self.object = form.save()
            files = [serialize(self.object)]
            path = self.create_good_path()
            # rename the file to this one
            os.rename(self.object.file.path, path)  # TODO handle if rename fails, e.g. file with such name exists
            data = {'files': files}
            response = JSONResponse(data, mimetype=response_mimetype(self.request))
            response['Content-Disposition'] = 'inline; filename=files.json'
            try:
                self.dao.add_song(os.path.basename(path))
            except Exception:
                sys.stdout.write('addsong exception: ' + Exception)
            return response
        except Exception:
            sys.stdout.write('whole stuff exception: ' +  Exception)

    def form_invalid(self, form):
        sys.stdout.write('from invalid')
        data = json.dumps(form.errors)
        return HttpResponse(content=data, status=400, content_type='application/json')

    def create_good_path(self):
        sys.stdout.write('create_good_path')
        curr_path = self.object.file.path
        curr_filename = os.path.basename(curr_path)
        curr_filename_arr = os.path.splitext(curr_filename)
        good_filename_no_ext = django.utils.text.slugify(curr_filename_arr[0])
        #      path                                     filename                extension
        return os.path.join(os.path.dirname(curr_path), good_filename_no_ext) + curr_filename_arr[1]


class BasicVersionCreateView(PictureCreateView):
    template_name_suffix = '_basic_form'
