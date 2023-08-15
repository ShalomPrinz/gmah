from src.data import driver_prop, key_prop
from src.excel import Excel
from src.families import update_driver
from src.json import Json
from src.managers import get_managers, get_managers_drivers, update_managers
from src.results import driver_update_results
from src.util import unique_list, validate_driver_name

def get_drivers(families_file: Excel, managers_file: Json):
    '''
    Returns all unique drivers in the families file.
    '''
    families_drivers = families_file.column_search("", 'driver')
    managers_drivers = get_managers_drivers(managers_file)
    return unique_list(families_drivers + managers_drivers)

def get_driver_families(families_file: Excel, driver_name):
    '''
    Returns all families whom their driver is the given driver.
    '''
    return families_file.search(driver_name, 'driver', exact=True)

def get_driverless_families(families_file: Excel):
    '''
    Returns all families without driver in the given families_file.
    '''
    return families_file.search('', 'driver', empty=True)

def update_manager_driver(managers_file: Json, original, updated):
    '''
    Updates a driver name from 'original' to 'updated' in the given managers_file.
    '''
    managers = get_managers(managers_file)
    for manager in managers:
        driver = next((d for d in manager['drivers'] if d['name'] == original), None)
        if driver is None:
            continue
        driver['name'] = updated
    update_managers(managers_file, managers)

def is_driver_exists(families_file: Excel, driver_name):
    '''
    Returns whether a driver is in the given families_file.
    '''
    return len(families_file.search(driver_name, 'driver', exact=True)) > 0

def update_driver_name(families_file: Excel, managers_file: Json, original, updated):
    '''
    Updates a driver name of all families whom their driver is 'original' to 'updated'.
    Updates managers file too, the driver whose name is 'original' is changed to 'updated'.
    * Note that update validations are based on families_file only and ignores managers_file.
    '''
    if not is_driver_exists(families_file, original):
        return driver_update_results["NO_SUCH_DRIVER"]

    if (result := validate_driver_name(updated)) is not None:
        return result
    
    update_manager_driver(managers_file, original, updated)
    for family in get_driver_families(families_file, original):
        update_driver(families_file, family[key_prop], updated)

    return driver_update_results["DRIVER_UPDATED"]
