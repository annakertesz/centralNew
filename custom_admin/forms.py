
from django import forms


class SongAddForm(forms.Form):
    song = forms.FileField(required=True)

class SearchForm(forms.Form):
    keywords = forms.CharField(label='Search', max_length=200, required=False)
    isExact = forms.BooleanField(label='Stuff', required=False)