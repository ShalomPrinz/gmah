from os import listdir, path

from src.data import key_prop, system_files_folder, pdf_properties
from src.drivers import get_drivers_multi_files, get_driver_families, get_driverless_families
from src.excel import Excel
from src.families import search_families, load_families_file, permanent_remove_family, add_families, remove_driver, add_driver
from src.json import Json
from src.pdf import PDFBuilder
from src.util import create_folders_path, duplicate_excel_template, get_all_pages

holidays_folder_name = f"{system_files_folder}/חגים"
holidays_folder = f"./{holidays_folder_name}"

holiday_main_printable_name = "כל הנהגים"
holiday_printable_suffix = ".pdf"

holidays_template_path = f"{system_files_folder}/holiday_template.xlsx"

def get_holiday_path(holiday_name):
    '''
    Returns the path for given holiday_name files folder.
    '''
    return f"{holidays_folder_name}/{holiday_name}"

def get_holiday_print_folder(holiday_name):
    '''
    Returns the path for given holiday_name printables folder.
    '''
    folder_path = get_holiday_path(holiday_name)
    return f"{folder_path}/להדפסה"

def get_holiday_print_filepath(holiday_name, printable_name, with_suffix=False):
    '''
    Returns the path for given holiday_name printable_name file.
    '''
    folder_path = get_holiday_print_folder(holiday_name)
    printable_path = f"{folder_path}/{printable_name}"
    return f"{printable_path}{holiday_printable_suffix}" if with_suffix else printable_path

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
        folder_contents = listdir(get_holiday_path(folder))
        def is_not_folder(name):
            full_path = path.join(get_holiday_path(folder), name)
            return not path.isdir(full_path)
        folder_files = list(filter(is_not_folder, folder_contents))
        return len(folder_files) > 0
    
    return list(filter(has_files_filter, sorted_holidays))

def get_printable_files(holiday_name):
    '''
    Returns a list of all printable files of holiday_name.
    '''
    folder_path = get_holiday_print_folder(holiday_name)
    def without_ending(filename):
        return filename[:-len(holiday_printable_suffix)]
    return list(map(without_ending, listdir(folder_path)))

def get_holiday_printable(holiday_name, printable_name):
    '''
    Returns a single holiday printable file.
    '''
    printables = get_printable_files(holiday_name)
    if len(printables) == 0:
        return None, None

    filename = printable_name or holiday_main_printable_name
    filepath = get_holiday_print_filepath(holiday_name, filename, with_suffix=True)
    try:
        with open(filepath, 'rb') as printable:
            return printable.read(), None
    except Exception as e:
        return None, e

def create_holiday_path(name):
    '''
    Creates new holiday folder to contain all holiday files.
    '''
    folder_path = get_holiday_path(name)
    create_folders_path(folder_path)

def generate_holiday_main_pdf(holiday_name, managers_file: Json):
    '''
    Generates new holiday printable based on given managers and holiday families files.
    '''
    error, files = load_both_holiday_files(holiday_name)
    if error is not None:
        return error
    
    families = []
    for f in files:
        families += search_families(f)

    managers = managers_file.load_json()
    pages = get_all_pages(managers, families)
    filepath = get_holiday_print_filepath(holiday_name, holiday_main_printable_name)
    builder = PDFBuilder(holiday_main_printable_name, filepath=filepath)
    builder.build_multi(pages, pdf_properties)

def generate_holiday_custom_pdf(holiday_name, title, content):
    filepath = get_holiday_print_filepath(holiday_name, title)
    builder = PDFBuilder(title, filepath=filepath)
    builder.build_single(title, pdf_properties, content)

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

    full_prints_path = get_holiday_print_folder(holiday_name)
    create_folders_path(full_prints_path)

def load_holiday_specific_families_file(holiday_name):
    '''
    Returns families file of the given holiday.
    '''
    filepath = get_holiday_families_path(holiday_name)
    return load_families_file(filepath)

def load_added_families_file(holiday_name):
    '''
    Returns added families file of the given holiday_name.
    '''
    filepath = get_holiday_added_families_path(holiday_name)
    return load_families_file(filepath)

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
    return None, add_families(added_families_file, families_to_add)

def load_both_holiday_files(holiday_name):
    '''
    Returns both holiday families file and holiday added families file, in that order.
    '''
    error, holiday_families_file = load_holiday_specific_families_file(holiday_name)
    if error is not None:
        return error, None

    error, added_families_file = load_added_families_file(holiday_name)
    if error is not None:
        return error, None    
    
    return None, [holiday_families_file, added_families_file]

def get_holiday_regular_families(holiday_name):
    '''
    Returns holiday regular families.
    '''
    error, families_file = load_holiday_specific_families_file(holiday_name)
    if error is not None:
        return error, None
    
    families = search_families(families_file)
    return None, families

def get_holiday_drivers(managers_file: Json, holiday_name):
    '''
    Returns all holiday drivers.
    '''
    error, files = load_both_holiday_files(holiday_name)
    if error is not None:
        return error, None

    drivers = get_drivers_multi_files(files, managers_file)
    return None, drivers

def get_holiday_driver_families(holiday_name, driver_name):
    '''
    Returns all families whom their driver is the given driver in the given holiday.
    '''
    error, files = load_both_holiday_files(holiday_name)
    if error is not None:
        return error, None
    
    families = []
    for f in files:
        families += get_driver_families(f, driver_name)
    return None, families

def get_holiday_driverless_families(holiday_name):
    '''
    Returns all families without driver in the given holiday.
    '''
    error, files = load_both_holiday_files(holiday_name)
    if error is not None:
        return error, None
    
    families = []
    for f in files:
        families += get_driverless_families(f)
    return None, list(filter(lambda f: f[key_prop], families))

def remove_holiday_driver_family(holiday_name, family_name):
    '''
    Removes driver name from given family in given holiday.
    '''
    error, files = load_both_holiday_files(holiday_name)
    if error is not None:
        return error
    
    for f in files:
        try:
            remove_driver(f, family_name)
        except:
            continue

def add_holiday_driver(holiday_name, family_name, driver_name):
    '''
    Adds given driver to family.
    '''
    error, files = load_both_holiday_files(holiday_name)
    if error is not None:
        return error
    
    for f in files:
        try:
            add_driver(f, family_name, driver_name)
        except:
            continue
