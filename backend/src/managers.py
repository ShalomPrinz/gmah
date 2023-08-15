from src.data import managers_filename
from src.json import Json
from src.util import generate_random_id

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

def get_managers_drivers(managers_file: Json):
    '''
    Returns all drivers from the given managers_file.
    '''
    drivers = []
    for manager in get_managers(managers_file):
        manager_drivers = map(lambda d: d["name"], manager["drivers"])
        manager_drivers = filter(lambda d: d, manager_drivers)
        drivers.extend(list(manager_drivers))
    return drivers

def update_managers(managers_file: Json, managers):
    '''
    Updates managers to match the given managers json.
    '''
    return managers_file.update_json(managers)

def find_manager(managers_file: Json, driver_name):
    '''
    Returns the corresponding manager to the given driver, or None if not found.
    '''
    if not driver_name:
        return None

    for manager in managers_file.load_json():
        if any(driver_name == driver['name'] for driver in manager['drivers']):
            return manager['name']

    return None

def remove_manager(managers_file: Json, manager_id):
    '''
    Removes given manager and all his data from managers_file.
    '''
    if not manager_id:
        return

    managers = managers_file.load_json()
    new_managers = list(
        filter(
            lambda manager: manager["id"] != str(manager_id),
            managers))
    return update_managers(managers_file, new_managers)

def add_manager(managers_file: Json, manager_name):
    '''
    Adds a manager with the given name to managers_file, and gives him a unique id,
    and empty array of drivers.
    '''
    if not manager_name:
        return

    managers = managers_file.load_json()
    managers.append({
        "id": generate_random_id(),
        "name": manager_name,
        "drivers": []
    })
    return update_managers(managers_file, managers)
