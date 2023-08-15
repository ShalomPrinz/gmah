from uuid import uuid4
from os import makedirs, path, umask

from src.results import driver_update_results

def without_hyphen(string: str):
    return string.replace('-', '')

def insert_hyphen(string: str, index: int):
    return string[:index] + '-' + string[index:]

def letter_by_index(index: int):
    '''
    Index starts at 1. To get the letter A, call the function with index = 1.
    '''
    return chr(ord('A') + index - 1)

def generate_random_id():
    return str(uuid4())

def create_folders_path(folders):
    '''
    If given folders path doesn't exist, creates all folders in path, full permission granted.
    '''
    if path.exists(folders):
        return

    try:
        original_umask = umask(0)
        makedirs(folders, 0o777)
    finally:
        umask(original_umask)

def unique_list(lst):
    return list(dict.fromkeys(lst))

DRIVER_NAME_MIN_LENGTH = 2

def validate_driver_name(driver_name):
    '''
    Validates driver_name is valid and not too short.
    If result is None, validation succeed.
    '''
    if not driver_name or not isinstance(driver_name, str):
        return driver_update_results["MISSING_DRIVER"]

    if len(driver_name) < DRIVER_NAME_MIN_LENGTH:
        return driver_update_results["TOO_SHORT_DRIVER"]
    
    return None
