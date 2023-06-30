from shutil import copy
from os import remove

from src.data import managers_filename
from src.managers import load_managers_file

def write_managers(managers):
    error, managers_file = load_managers_file()
    if error is not None:
        raise Exception("Couldn't load managers file", error)
    managers_file.update_json(managers)

def setUpManagers():
    copy(managers_filename, 'temp_managers.json')

def tearDownManagers():
    copy('temp_managers.json', managers_filename)
    remove('temp_managers.json')
