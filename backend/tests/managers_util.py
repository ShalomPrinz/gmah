from src.data import managers_filename
from src.managers import load_managers_file

from tests.tests_util import restore_file, store_file

temp_managers_filename = 'temp_managers.json'

def write_managers(managers):
    error, managers_file = load_managers_file()
    if error is not None:
        raise Exception("Couldn't load managers file", error)
    managers_file.update_json(managers)
    return managers_file

def setUpManagers():
    store_file(managers_filename, temp_managers_filename)

def tearDownManagers():    
    restore_file(managers_filename, temp_managers_filename)
