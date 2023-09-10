from os import listdir, path

from src.data import key_prop, system_files_folder
from src.excel import Excel
from src.families import search_families, load_holiday_families_file, permanent_remove_family, add_families, to_holiday_row
from src.util import create_folders_path, duplicate_excel_template

holidays_folder_name = f"{system_files_folder}/חגים"
holidays_folder = f"./{holidays_folder_name}"

holidays_template_path = f"{system_files_folder}/holiday_template.xlsx"

def get_holiday_path(holiday_name):
    '''
    Returns the path for given holiday_name files folder.
    '''
    return f"{holidays_folder_name}/{holiday_name}"

def get_holiday_families_path(holiday_name):
    '''
    Returns the path for families file of given holiday_name.
    '''
    folder_path = get_holiday_path(holiday_name)
    return f"{folder_path}/נתמכים.xlsx"

def get_holiday_added_families_path(holiday_name):
    '''
    Returns the path for added families file of given holiday_name.
    '''
    folder_path = get_holiday_path(holiday_name)
    return f"{folder_path}/נתמכים נוספים.xlsx"

def get_holidays_list():
    '''
    Returns a list of all holiday names in system.
    Sorts the list so the latest created holiday will be first item in list.
    '''
    holidays_list = listdir(holidays_folder_name)

    def get_creation_time(folder):
        folder_path = get_holiday_path(folder)
        return path.getctime(folder_path)
    sorted_holidays = sorted(holidays_list, key=get_creation_time, reverse=True)

    def has_files_filter(folder):
        folder_path = get_holiday_path(folder)
        return len(listdir(folder_path)) > 0
    
    return list(filter(has_files_filter, sorted_holidays))

def create_holiday_path(name):
    '''
    Creates new holiday folder to contain all holiday files.
    '''
    folder_path = get_holiday_path(name)
    create_folders_path(folder_path)

def initialize_holiday(families_file: Excel, holiday_name):
    '''
    Generates new families source file out of current families_file.
    New source file will be located in a new subfolder inside "חגים" folder, and named holiday_name.
    '''
    create_holiday_path(holiday_name)

    holiday_families_path = get_holiday_families_path(holiday_name)
    families_file.duplicate(holiday_families_path)

    holiday_added_families_path = get_holiday_added_families_path(holiday_name)
    duplicate_excel_template(holidays_template_path, "נתמכים", holiday_added_families_path)

def load_added_families_file(holiday_name):
    '''
    Returns added families file of the given holiday_name.
    '''
    filepath = get_holiday_added_families_path(holiday_name)
    return load_holiday_families_file(filepath)

def get_holiday_families_status(holiday_file: Excel, holiday_name):
    '''
    Returns added holiday families.
    '''
    error, added_families_file = load_added_families_file(holiday_name)
    if error is not None:
        return error, None

    added_families = search_families(added_families_file)
    added_families_names = list(map(lambda f: f[key_prop], added_families))

    all_holiday_families = search_families(holiday_file)
    def name_filter(family):
        return family[key_prop] not in added_families_names
    not_added_families = list(filter(name_filter, all_holiday_families))
    return None, {
        "added": added_families,
        "extra": not_added_families
    }

def update_holiday_families_status(holiday_file: Excel, holiday_name, holiday_families):
    '''
    Updates added holiday families to given holiday_families.
    holiday_families should be a list of family names.
    '''
    error, added_families_file = load_added_families_file(holiday_name)
    if error is not None:
        return error, None
    
    already_added_families = search_families(added_families_file)
    already_added_families = list(map(lambda f: f[key_prop], already_added_families))

    for family in already_added_families:
        if family not in holiday_families:
            permanent_remove_family(added_families_file, family)

    families_to_add = []
    for family_name in holiday_families:
        if family_name not in already_added_families:
            families = search_families(holiday_file, family_name, exact=True)
            if len(families) == 0:
                continue
            families_to_add.append(families[0])
    return None, add_families(added_families_file, families_to_add, to_holiday_row)
