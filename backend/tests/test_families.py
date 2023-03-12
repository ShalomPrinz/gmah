import openpyxl
import unittest
from shutil import copy
from dotenv import load_dotenv
from os import getenv, remove

from src.families import get_count, search_families

load_dotenv()
FAMILIES_FILENAME = getenv('FAMILIES_FILENAME')

def write_families_file(families):
    workbook = openpyxl.Workbook()
    worksheet = workbook.active
    worksheet.append(['Header 1', 'Header 2', 'Header 3'])
    for i in range(1, len(families) + 1):
        worksheet.append([str(families[i - 1]), 'Value 1', 'Value 2'])
    workbook.save(FAMILIES_FILENAME)

def write_file(rows_num):
    workbook = openpyxl.Workbook()
    worksheet = workbook.active
    worksheet.append(['Header 1', 'Header 2', 'Header 3'])
    for i in range(1, rows_num + 1):
        worksheet.append([f'Family {i}', 'Value 1', 'Value 2'])
    workbook.save(FAMILIES_FILENAME)

class TestExcel(unittest.TestCase):
    def setUpClass():
        copy(FAMILIES_FILENAME, 'temp.xlsx')
    
    def tearDownClass():
        copy('temp.xlsx', FAMILIES_FILENAME)
        remove('temp.xlsx')

    def test_get_families_num(self):
        rows_num = 10
        write_file(rows_num=rows_num)
        self.assertEqual(rows_num, get_count())

    def test_search_families(self):
        families = ["פרינץ", "כהנא", "נתאי"]
        test_cases = [
            ("None", None, 3),
            ("Empty String", "", 3),
            ("Two Matches", "י", 2),
            ("First Letter", "פ", 1),
            ("Second Letter", "ה", 1),
            ("Not Found", "ברוזוביץ", 0)
        ]
        for title, query, expected_len in test_cases:
            with self.subTest(title=title):
                write_families_file(families=families)
                search_result = search_families(query)
                print(search_result)
                self.assertEqual(expected_len, len(search_result))
