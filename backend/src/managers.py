from src.data import managers_filename
from src.json import Json

def load_managers_file():
    '''
    Connects to the managers source file.

    Returns a tuple: (error, file)
        - If connection has failed, file will be None
        - If connection has succeed, error will be None
    '''
    try:
        managers = Json(managers_filename)
        return (None, managers)
    except Exception as e:
        return (e, None)

def get_managers(managers_file: Json):
    '''
    Returns all managers in json format.
    '''
    return managers_file.load_json()

def update_managers(managers_file: Json, managers):
    '''
    Updates managers to match the given managers json.
    '''
    return managers_file.update_json(managers)
