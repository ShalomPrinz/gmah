from src.data import driver_prop, key_prop
from src.excel import Excel
from src.json import Json
from src.managers import get_managers, update_managers
from src.results import driver_update_results
from src.util import unique_list

DRIVER_NAME_MIN_LENGTH = 2

def get_drivers(families_file: Excel):
    '''
    Returns all unique drivers in the families file.
    '''
    all_drivers = families_file.column_search("", 'driver')
    return unique_list(all_drivers)

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

def update_driver_name(families_file: Excel, managers_file: Json, original, updated):
    '''
    Updates a driver name of all families whom their driver is 'original' to 'updated'.
    Updates managers file too, the driver whose name is 'original' is changed to 'updated'.
    * Note that update validations are based on families_file only and ignores managers_file.
    '''
    if not updated or not isinstance(updated, str):
        return driver_update_results["MISSING_DRIVER"]

    if len(updated) < DRIVER_NAME_MIN_LENGTH:
        return driver_update_results["TOO_SHORT_DRIVER"]

    if original == updated:
        return driver_update_results["DRIVER_UPDATED"]
    
    drivers = families_file.search(original, 'driver', exact=True)
    if len(drivers) == 0:
        return driver_update_results["NO_SUCH_DRIVER"]
    
    update_manager_driver(managers_file, original, updated)
    for family in get_driver_families(families_file, original):
        row_index = families_file.get_row_index(family[key_prop])
        families_file.replace_cell(row_index, {
            "key": driver_prop,
            "value": updated
        })

    return driver_update_results["DRIVER_UPDATED"]
