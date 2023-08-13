from random import choice
from shutil import copy
from string import ascii_lowercase
from os import path, remove

def store_file(filename, temp_filename):
    copy(filename, temp_filename)

def restore_file(filename, temp_filename):
    if not path.exists(temp_filename):
        return
    
    copy(temp_filename, filename)
    remove(temp_filename)

def generate_random_name(chars=4):
    return ''.join(choice(ascii_lowercase) for _ in range(chars))
