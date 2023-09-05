
from src.data import key_prop, system_files_folder
from src.excel import Excel
from src.families import search_families, add_families, load_families_file
from src.util import create_folders_path

holidays_folder_name = f"{system_files_folder}/חגים"
holidays_folder = f"./{holidays_folder_name}"

def create_holiday_path(name):
    '''
    Creates new holiday folder to contain all holiday files.
    Returns holiday path from project parent directory.
    '''
    full_path = f'{holidays_folder}/{name}'
    create_folders_path(full_path)
    return full_path

def initialize_holiday(families_file: Excel, holiday_file: Excel, holiday_name, holiday_families):
    '''
    Generates new families source file out of current families_file and selected holiday families.
    This file can be edited later, and should be used as a source file for holiday printables.

    New source file will be located in a new subfolder inside "חגים" folder, and named holiday_name.
    holiday_families should be a list of names only.
    '''
    all_holiday_families = search_families(holiday_file)
    def name_filter(family):
        return family[key_prop] in holiday_families
    filtered_holiday_families = list(filter(name_filter, all_holiday_families))
    
    holiday_path = create_holiday_path(holiday_name)
    filepath = f"{holiday_path}/נתמכים.xlsx"
    families_file.duplicate(filepath)

    error, generated_file = load_families_file(filepath)
    if error is not None:
        return error

    add_families(generated_file, filtered_holiday_families)
    return None
