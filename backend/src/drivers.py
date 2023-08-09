from src.excel import Excel

def get_drivers(families_file: Excel):
    '''
    Returns all drivers in the families file.
    '''
    return families_file.column_search("", 'driver')

def get_driver_families(families_file: Excel, driver_name):
    '''
    Returns all families whom their driver is the given driver.
    '''
    return families_file.search(driver_name, 'driver', exact=True)
