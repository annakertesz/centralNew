web: python manage.py runserver 0.0.0.0:$PORT
web: gunicorn centralNew.wsgi --log-file -
worker: python script.py
