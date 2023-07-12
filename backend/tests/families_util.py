from openpyxl import load_workbook
from shutil import copy
from os import remove

from src.data import family_properties, families_filename
from src.families import load_families_file

default_family_properties = {
    "שם מלא": "פלוני פלוני",
    "רחוב": "שפרינצק",
    "בניין": 10,
    "דירה": 2,
    "קומה": 1,
    "מס' בית": "012-3456789",
    "מס' פלאפון": "987-6543210",
    "נהג": "שלמה שלומי",
    "ממליץ": "רווחה",
    "הערות": "",
}

class Family:
    def __init__(self, family):
        self.excel_row = [family.get(key, default_family_properties.get(key, None)) for key in family_properties]

def write_families(families):
    workbook = load_workbook(families_filename)
    worksheet = workbook[workbook.sheetnames[0]]
    worksheet.delete_rows(2, worksheet.max_row - 1)

    for family in families:
        worksheet.append(family.excel_row)
    workbook.save(families_filename)

def load_families():
    error, families_file = load_families_file()
    if error is not None:
        raise Exception("Couldn't load families file", error)
    else:
        return families_file

def setUpFamilies():
    copy(families_filename, 'temp_families.xlsx')

def tearDownFamilies():
    copy('temp_families.xlsx', families_filename)
    remove('temp_families.xlsx')
