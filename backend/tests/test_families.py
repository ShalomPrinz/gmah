import openpyxl
import unittest
from dotenv import load_dotenv
from os import getenv, path, remove

from src.families import get_count

load_dotenv()
FAMILIES_FILENAME = getenv('FAMILIES_FILENAME')

def write_families_file(rows_num):
    workbook = openpyxl.Workbook()
    worksheet = workbook.active
    worksheet.append(['Header 1', 'Header 2', 'Header 3'])
    for i in range(1, rows_num + 1):
        row_data = [f'Row {i}', 'Value 1', 'Value 2']
        worksheet.append(row_data)
    workbook.save(FAMILIES_FILENAME)

def delete_families_file():
    if path.exists(FAMILIES_FILENAME):
        remove(FAMILIES_FILENAME)

class TestExcel(unittest.TestCase):
    def tearDown(self):
        delete_families_file()

    def test_get_rows_num(self):
        rows_num = 10
        write_families_file(rows_num)
        self.assertEqual(rows_num, get_count())

if __name__ == '__main__':
    unittest.main()