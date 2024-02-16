from glob import glob
from os import path, listdir

from src.data import key_prop, pdf_properties, system_files_folder, date_prop, status_prop
from src.errors import FileAlreadyExists, ActiveReportNotFound
from src.families import search_families
from src.managers import load_managers_file
from src.report import load_report_file, append_report, report_late_append, get_family_receipt_status, default_receipt, remove_from_report
from src.pdf import PDFBuilder, get_print_path, get_print_folder_path
from src.util import duplicate_excel_template, get_all_pages

month_reports_folder = f"{system_files_folder}/דוחות קבלה"
month_reports_path = f"{month_reports_folder}/"
month_reports_template = f"{system_files_folder}/template.xlsx"

month_report_prefix = "דוח קבלה "
month_report_suffix = ".xlsx"
month_reports_pattern = f"{month_reports_path}{month_report_prefix}*{month_report_suffix}"
reportname_start_index = len(month_report_prefix)
reportname_end_index = len(month_report_suffix)

month_printable_report_name = "כל הנהגים"
month_printable_suffix = '.pdf'

month_active_report_prop = "is_active_report"

# General monthly information

def get_report_path(report_name):
    '''
    Returns report path from project parent directory.
    '''
    return f'{month_reports_path}{month_report_prefix}{report_name}{month_report_suffix}'

def get_report_name(report_path):
    '''
    Cuts info such as full file path and file type.
    Returns report name.
    '''
    return path.basename(report_path)[reportname_start_index:-reportname_end_index]

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

def is_active_report(report_file):
    '''
    Returns whether given report is the active report.
    '''
    return report_file.get_custom_property(month_active_report_prop)

def get_reports_list():
    '''
    Returns a list with all the generated monthly reports.
    '''
    reports = []
    for filepath in glob(month_reports_pattern):
        filename = get_report_name(filepath)
        error, report = load_report_file(filepath)
        if error is not None:
            return error, None
        reports.append({
            "name": filename,
            "active": is_active_report(report)
        })
    return None, reports

def get_active_report():
    '''
    Returns the active report file.
    If no active report found, returns None.
    '''
    for filepath in glob(month_reports_pattern):
        error, report = load_report_file(filepath)
        if error is not None:
            return error, None
        if is_active_report(report):
            return None, report
    return None, ActiveReportNotFound("לא נמצא דוח קבלה פעיל")

def get_printable_report(report_name, printable_name):
    '''
    Returns a single printable file.
    '''
    printables = get_printable_files(report_name)
    if len(printables) == 0:
        return None, None

    filename = printable_name or month_printable_report_name
    path_prefix = get_print_path(report_name, filename)
    try:
        with open(f'{path_prefix}{month_printable_suffix}', 'rb') as printable:
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

def get_family_receipt_history(family_name):
    '''
    Returns family receipt statuses of all-time month reports history.
    '''
    error, reports_list = get_reports_list()
    if error is not None:
        return error, None
    
    statuses = []
    for report_props in reports_list:
        current_month = report_props["name"]
        error, report_file = load_month_report(current_month)
        if error is not None:
            return error, None
        status = get_family_receipt_status(report_file, family_name)
        if status == default_receipt:
            continue
        statuses.append({
            **{ "חודש": current_month },
            date_prop: status["date"],
            status_prop: status["status"]
        })

    return None, statuses

# Monthly files generation

def generate_month_report(month_name, families, managers_file):
    '''
    Generates new monthly report tracker based on given families and managers.
    If the generated report is the only report, it will be set as active report.
    '''
    sheet_title = f'{month_report_prefix}{month_name}'
    filepath = get_report_path(month_name)
    duplicate_excel_template(month_reports_template, sheet_title, filepath)

    error, report_file = load_month_report(month_name)
    if error is not None:
        return error

    append_report(report_file, families, managers_file)
    
    error, reports = get_reports_list()
    if error is not None:
        return error
    
    is_only_report = len(reports) == 1
    set_report_active_status(report_file, is_only_report)

def generate_month_pdf(month_name, families, managers_file):
    '''
    Generates new monthly report in print format based on given families and managers.
    '''
    managers = managers_file.load_json()
    pages = get_all_pages(managers, families)
    builder = PDFBuilder(month_printable_report_name, folder=month_name)
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

def generate_completion_pdf(month_name, title, families_file, families):
    '''
    Generates new completion file in print format.
    '''
    pdf_content = get_families_content(families_file, families)
    builder = PDFBuilder(title, folder=month_name)
    builder.build_single(title, pdf_properties, pdf_content)

def get_families_content(families_file, completion_families):
    families_content = []
    families = search_families(families_file)

    for cf in completion_families:
        family = next((f for f in families if f[key_prop] == cf[key_prop]), None)
        if family is not None:
            families_content.append(family)
    
    return families_content

def set_report_active_status(report_file, status):
    '''
    Sets report active status to given status.
    '''
    report_file.set_custom_property(month_active_report_prop, status)

def is_report_name_valid(report_name):
    '''
    Validates report name is an actual report name.
    '''
    if not report_name:
        return False
    
    error, reports_list = get_reports_list()
    if error is not None:
        return False
    
    if not any(report_name == report["name"] for report in reports_list):
        return False
    
    return True

def activate_report(report_name):
    '''
    Sets given report to be the active report, and sets all other reports to inactive status.
    '''
    if not is_report_name_valid(report_name):
        return

    for filepath in glob(month_reports_pattern):
        filename = get_report_name(filepath)
        error, report_file = load_month_report(filename)
        if error is not None:
            return error

        if filename == report_name:
            set_report_active_status(report_file, True)
        elif is_active_report(report_file):
            set_report_active_status(report_file, False)

def insert_families_to_active(families):
    '''
    Adds given families to the active report.
    '''
    error, active_report = get_active_report()
    if error is not None:
        return error
    report_late_append(active_report, families)

def remove_family_from_report(report_name, family_name):
    '''
    Removes given family from given report.
    '''
    error, report_file = load_month_report(report_name)
    if error is not None:
        return error
    return remove_from_report(report_file, family_name)
