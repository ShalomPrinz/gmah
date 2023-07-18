import os

from src.month import generate_month_report, load_report_file
from tests.families_util import write_families

def load_report(name):
    error, report_file = load_report_file(name)
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

    error = generate_month_report(name, override_name)
    assertTrue(error is None, "Failed generating month report")

    return load_report(name)

def remove_all_reports():
    '''
    Removes all testing-purposes generated monthly reports.
    '''
    folder_path = f"{os.getcwd()}/דוחות קבלה"
    retain = ['template.xlsx']

    for item in os.listdir(folder_path):
        file_path = os.path.join(folder_path, item)
        if item not in retain:
            os.remove(file_path)

def tearDownMonth():
    remove_all_reports()
