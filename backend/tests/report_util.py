import os

from src.month import load_report_file

def load_report(path):
    error, report_file = load_report_file(path)
    if error is not None:
        raise Exception("Couldn't load report file", error)
    else:
        return report_file

def tearDownMonth():
    '''
    Removes all testing-purposes generated monthly reports.
    '''
    folder_path = f"{os.getcwd()}/דוחות קבלה"
    retain = ['template.xlsx']

    for item in os.listdir(folder_path):
        file_path = os.path.join(folder_path, item)
        if item not in retain:
            os.remove(file_path)
