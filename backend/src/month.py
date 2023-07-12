from enum import Enum
from glob import glob
from os.path import basename
from openpyxl import load_workbook

from src.data import key_prop
from src.excel import Excel
from src.families import load_families_file, search_families
from src.managers import find_manager, load_managers_file
from src.styles import report_cell_style

class ReportSearchBy(Enum):
    NAME = 'name'
    MANAGER = 'manager'
    DRIVER = 'driver'

    @classmethod
    def get_search_columns(cls, search_by):
        search_by = getattr(ReportSearchBy, search_by.upper(), ReportSearchBy.NAME)
        print("search by", search_by)
        match search_by:
            case ReportSearchBy.NAME:
                return [0]
            case ReportSearchBy.MANAGER:
                return [1]
            case ReportSearchBy.DRIVER:
                return [2]
            case _:
                return [0]

month_reports_folder = "דוחות קבלה"
month_reports_path = f"{month_reports_folder}/"
month_reports_template = f"{month_reports_path}template.xlsx"

month_report_prefix = "דוח קבלה "
month_report_suffix = ".xlsx"
month_reports_pattern = f"{month_reports_path}{month_report_prefix}*{month_report_suffix}"

default_driver = ""
default_manager = ""

def get_report_path(report_name):
    '''
    Returns report path from project parent directory.
    '''
    return f'{month_reports_path}{month_report_prefix}{report_name}{month_report_suffix}'

def load_report_file(report_name):
    '''
    Connects to a report file.

    Returns a tuple: (error, file)
        - If connection has failed, file will be None
        - If connection has succeed, error will be None
    '''
    path = get_report_path(report_name)
    try:
        report = Excel(
            filename=path,
            required_style=report_cell_style
        )
        return (None, report)
    except Exception as e:
        return (e, None)

def load_template(template_path, sheet_title):
    '''
    Loads a template, modifies its sheet title and returns the workbook.
    '''
    workbook = load_workbook(template_path)
    sheet = workbook[workbook.sheetnames[0]]
    sheet.title = sheet_title
    return workbook

def create_from_template(name):
    '''
    Creates empty month report.
    '''
    sheet_title = f'{month_report_prefix}{name}'
    workbook = load_template(month_reports_template, sheet_title)
    filepath = get_report_path(name)
    workbook.save(filepath)

def to_excel_row(family, managers_file):
    '''
    Cast family data to report excel row format in the right order.
    If family is missing key_prop, detailed exception is raised.
    If family is missing driver, default_driver will be their driver.
    '''
    family_key = family.get(key_prop, None)
    if family_key is None:
        raise Exception(f"שגיאה ביצירת דוח קבלה חודשי: למשפחה {family} אין שם")
    
    driver = family.get("נהג", default_driver)
    manager = find_manager(managers_file, driver) or default_manager

    return [family_key, manager, driver, None, None]

def generate_month_report(name):
    '''
    Generates new month report with the given name, based on current families and managers files.
    '''
    error, families_file = load_families_file()
    if error is not None:
        return error
    
    error, managers_file = load_managers_file()
    if error is not None:
        return error
    
    create_from_template(name)
    error, report_file = load_report_file(name)
    if error is not None:
        return error
    
    family_to_excel_row = lambda family: to_excel_row(family, managers_file)
    report_file.append_rows(search_families(families_file), family_to_excel_row)

def get_no_manager_drivers():
    '''
    Returns all the drivers from families file that have no corresponding manager in managers file.
    '''
    error, families_file = load_families_file()
    if error is not None:
        return error, None
    
    error, managers_file = load_managers_file()
    if error is not None:
        return error, None
    
    no_manager_drivers = []

    for family in search_families(families_file):
        family_key = family.get(key_prop, None)
        driver = family.get("נהג", None)
        if family_key is None or driver is None:
            continue

        manager = find_manager(managers_file, driver)
        if manager is None:
            for d in no_manager_drivers:
                if d["name"] == driver:
                    d["count"] += 1
                    break
            else:
                no_manager_drivers.append({ "name": driver, "count": 1 })

    return None, no_manager_drivers

def get_no_driver_families():
    '''
    Returns all the families from families file that doesn't have a driver.
    '''
    error, families_file = load_families_file()
    if error is not None:
        return error, None
    
    no_driver_families = 0

    for family in search_families(families_file):
        family_key = family.get(key_prop, None)
        if family_key is None:
            continue
        
        driver = family.get("נהג", None)
        if driver is None:
            no_driver_families += 1

    return None, no_driver_families

def get_reports_list():
    '''
    Returns a list with all the generated monthly reports.
    '''
    start_index = len(month_report_prefix)
    end_index = len(month_report_suffix)
    return [basename(file)[start_index:-end_index] for file in glob(month_reports_pattern)]

def search_report(report_file: Excel, query='', search_by=''):
    '''
    Returns list of families from the given report_file,
    who their value of the search_by cell matches the given query
    '''
    query = '' if query is None else query
    search_by = '' if search_by is None else search_by

    return report_file.search(query, ReportSearchBy, search_by)