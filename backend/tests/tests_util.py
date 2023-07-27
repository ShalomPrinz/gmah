from shutil import copy
from os import path, remove

def store_file(filename, temp_filename):
    copy(filename, temp_filename)

def restore_file(filename, temp_filename):
    if not path.exists(temp_filename):
        return
    
    copy(temp_filename, filename)
    remove(temp_filename)