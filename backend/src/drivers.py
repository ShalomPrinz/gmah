from src.data import driver_prop, key_prop
from src.excel import Excel
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

def update_driver_name(families_file: Excel, original, updated):
    '''
    Updates a driver name of all families whom their driver is 'original' to 'updated'.
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
    
    for family in get_driver_families(families_file, original):
        row_index = families_file.get_row_index(family[key_prop])
        families_file.replace_cell(row_index, {
            "key": driver_prop,
            "value": updated
        })

    return driver_update_results["DRIVER_UPDATED"]
