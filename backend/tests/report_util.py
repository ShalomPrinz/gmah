import os

from src.month import generate_month_files, load_month_report, month_reports_folder
from src.pdf import print_dir_name
from tests.families_util import load_families, write_families

def load_report(name):
    error, report_file = load_month_report(name)
    if error is not None:
        raise Exception("Couldn't load report file", error)
    else:
        return report_file

def generate_report(assertTrue, families, name="שם דוח", override_name=True):
    '''
    Generates monthly report out of given families.
    Returns report path.
    '''
    write_families(families)

    families_file = load_families()
    error = generate_month_files(families_file, name, override_name)
    assertTrue(error is None, "Failed generating month report")

    return load_report(name)

def remove_all_files(folder_path, retain=[]):
    for item in os.listdir(folder_path):
        file_path = os.path.join(folder_path, item)
        if item not in retain:
            os.remove(file_path)

def remove_empty_folders(folder_path):
    for folder in os.listdir(folder_path):
        folder_full_path = os.path.join(folder_path, folder)
        if os.path.isdir(folder_full_path) and not os.listdir(folder_full_path):
            os.rmdir(folder_full_path)

def remove_all_reports():
    '''
    Removes all testing-purposes generated monthly reports.
    '''
    folder_path = f"{os.getcwd()}/{month_reports_folder}"
    retain = ['template.xlsx']
    remove_all_files(folder_path, retain)

def remove_all_pdfs():
    '''
    Removes all testing-purposes generated monthly pdf files.
    '''
    folder_path = f"{os.getcwd()}/{print_dir_name}"
    for folder in os.listdir(folder_path):
        remove_all_files(f"{folder_path}/{folder}")
    
    remove_empty_folders(folder_path)

def tearDownMonth():
    remove_all_reports()
    remove_all_pdfs()
