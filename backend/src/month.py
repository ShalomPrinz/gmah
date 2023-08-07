from glob import glob
from os import path, listdir

from src.data import key_prop, driver_prop, pdf_properties, system_files_folder
from src.errors import FileAlreadyExists
from src.families import search_families
from src.managers import load_managers_file
from src.report import load_report_file, create_empty_report, append_report
from src.pdf import PDFBuilder, get_print_path, get_print_folder_path

month_reports_folder = f"{system_files_folder}/דוחות קבלה"
month_reports_path = f"{month_reports_folder}/"
month_reports_template = f"{system_files_folder}/template.xlsx"

month_report_prefix = "דוח קבלה "
month_report_suffix = ".xlsx"
month_reports_pattern = f"{month_reports_path}{month_report_prefix}*{month_report_suffix}"

month_printable_report_name = "כל הנהגים"
month_printable_suffix = '.pdf'

# General monthly information

def get_report_path(report_name):
    '''
    Returns report path from project parent directory.
    '''
    return f'{month_reports_path}{month_report_prefix}{report_name}{month_report_suffix}'

def load_month_report(report_name):
    '''
    Connects to a month report file with the given report_name.

    Returns a tuple: (error, file)
        - If connection has failed, file will be None
        - If connection has succeed, error will be None
    '''
    filepath = get_report_path(report_name)
    return load_report_file(filepath)

def is_report_name_exists(report_name):
    '''
    Validates if a report already exists in generated reports.
    '''
    filepath = get_report_path(report_name)
    return not path.isfile(filepath)

def get_reports_list():
    '''
    Returns a list with all the generated monthly reports.
    '''
    start_index = len(month_report_prefix)
    end_index = len(month_report_suffix)
    return [path.basename(file)[start_index:-end_index]
            for file in glob(month_reports_pattern)]

def get_printable_report(report_name, printable_name):
    '''
    Returns a single printable file.
    '''
    filename = printable_name or month_printable_report_name
    path = get_print_path(report_name, filename)
    try:
        with open(f'{path}{month_printable_suffix}', 'rb') as printable:
            return printable.read(), None
    except Exception as e:
        return None, e

def get_printable_files(report_name):
    '''
    Returns a list of all printable files of report_name.
    '''
    folder_path = get_print_folder_path(report_name)
    def without_ending(filename):
        return filename[:-len(month_printable_suffix)]
    return list(map(without_ending, listdir(folder_path)))

# Monthly files generation

def generate_month_report(month_name, families, managers_file):
    '''
    Generates new monthly report tracker based on given families and managers.
    '''
    sheet_title = f'{month_report_prefix}{month_name}'
    filepath = get_report_path(month_name)
    create_empty_report(month_reports_template, sheet_title, filepath)

    error, report_file = load_month_report(month_name)
    if error is not None:
        return error
    append_report(report_file, families, managers_file)

def generate_month_pdf(month_name, families, managers_file):
    '''
    Generates new monthly report in print format based on given families and managers.
    '''
    managers = managers_file.load_json()
    pages = get_all_pages(managers, families)
    builder = PDFBuilder(month_name, month_printable_report_name)
    builder.build_multi(pages, pdf_properties)

def generate_month_files(families_file, month_name, override_name=False):
    '''
    Generates new month report with the given month_name, based on current families and managers files.
    Allows override of exist report by setting override_name to True.

    In addition to monthly report tracker file, this function generates a pdf file which contains
    all managers, drivers and families for this month.
    '''
    if not override_name and not is_report_name_exists(month_name):
        return FileAlreadyExists(f"דוח קבלה בשם {month_name} קיים כבר")

    error, managers_file = load_managers_file()
    if error is not None:
        return error

    families = search_families(families_file)

    generate_month_report(month_name, families, managers_file)
    generate_month_pdf(month_name, families, managers_file)

def get_all_pages(managers, families):
    ignore_drivers = [None, "", "בני מנשה", "וענונו"]
    pages = []

    for manager in managers:
        manager_name = manager['name']
        pages.append({ "title": manager_name })

        for driver in manager['drivers']:
            driver_name = driver['name']
            if driver_name in ignore_drivers:
                continue

            driver_families = [f for f in families
                               if f[driver_prop] == driver_name]
            if len(driver_families) > 0:
                pages.append({
                    "title": driver_name,
                    "content": driver_families
                })

    return pages

def generate_completion_pdf(month_name, title, families_file, families):
    '''
    Generates new completion file in print format.
    '''
    pdf_content = get_families_content(families_file, families)
    builder = PDFBuilder(month_name, title)
    builder.build_single(title, pdf_properties, pdf_content)

def get_families_content(families_file, completion_families):
    families_content = []
    families = search_families(families_file)

    for cf in completion_families:
        family = next((f for f in families if f[key_prop] == cf[key_prop]), None)
        if family is not None:
            families_content.append(family)
    
    return families_content
