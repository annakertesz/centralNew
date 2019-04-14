import os


def content_file_name(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s_%s.%s" % (instance.user.id, instance.questid.id, ext)
    return os.path.join('uploads', filename)


