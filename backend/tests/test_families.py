import openpyxl
import unittest
from shutil import copy
from dotenv import load_dotenv
from os import getenv, remove

from src.families import get_count, search_families

load_dotenv()
FAMILIES_FILENAME = getenv('FAMILIES_FILENAME')

class Family:
    def __init__(self, fullName="פלוני פלוני", street="שפרינצק", house=10,
        apartmentNumber=2, floor=1, homePhone="012-3456789", mobilePhone="987-6543210",
        originalDriver="נחום נחום", referrer="רווחה", notes=""):

        self.fullName = fullName
        self.street = street
        self.house = house
        self.apartmentNumber = apartmentNumber
        self.floor = floor
        self.homePhone = homePhone
        self.mobilePhone = mobilePhone
        self.originalDriver = originalDriver
        self.referrer = referrer 
        self.notes = notes

    def to_excel_row(self):
        return [self.fullName, self.street, self.house, self.apartmentNumber, 
            self.floor, self.homePhone, self.mobilePhone, 
            self.originalDriver, self.referrer, self.notes]

def write_families_file(families):
    workbook = openpyxl.Workbook()
    worksheet = workbook.active
    # Families file headers
    worksheet.append(['שם מלא', 'רחוב', 'בניין', 'דירה', 'קומה', "מס' בית", "מס' פלאפון", 'נהג במקור', 'ממליץ', 'הערות'])
    for family in families:
        worksheet.append(family.to_excel_row())
    workbook.save(FAMILIES_FILENAME)

def write_file(rows_num):
    workbook = openpyxl.Workbook()
    worksheet = workbook.active
    worksheet.append(['שם מלא', 'רחוב', 'בניין'])
    for i in range(1, rows_num + 1):
        worksheet.append([f'Family {i}', 'שפרינצק', 10])
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

    def test_search_by_name(self):
        families = [Family(fullName="פרינץ"), Family(fullName="כהנא"), Family(fullName="נתאי")]
        
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
                self.assertEqual(expected_len, len(search_result))
    
    def test_search_by_street(self):
        families = [Family(fullName="פרינץ", street="הבנים"),
            Family(fullName="כהנא", street="השופטים"),
            Family(fullName="נתאי", street="סלינג'ר")]
        
        test_cases = [
            ("None", None, 3),
            ("Empty String", "", 3),
            ("Two Matches", "ם", 2),
            ("One Match", "סלי", 1),
            ("Second Letter", "ב", 1),
            ("Not Found", "ברוזוביץ", 0)
        ]

        for title, query, expected_len in test_cases:
            with self.subTest(title=title):
                write_families_file(families=families)
                search_result = search_families(query, 'street')
                self.assertEqual(expected_len, len(search_result))

    def test_search_by_phone(self):
        families = [Family(fullName="פרינץ", mobilePhone="333-4444444", homePhone="000-1111111"),
            Family(fullName="כהנא", mobilePhone="444-5555555", homePhone="111-2222222"),
            Family(fullName="נתאי", mobilePhone="555-6666666", homePhone="222-3333333")]
        
        test_cases = [
            ("None", None, 3),
            ("Empty String", "", 3),
            ("Home: One Match", "0", 1),
            ("Home: Two Matches", "1", 2),
            ("Mobile: One Match", "6", 1),
            ("Mobile: Two Matches", "5", 2),
            ("Both: Two Matches", "3", 2),
            ("Not Found", "7", 0)
        ]

        for title, query, expected_len in test_cases:
            with self.subTest(title=title):
                write_families_file(families=families)
                search_result = search_families(query, 'phone')
                self.assertEqual(expected_len, len(search_result))

    def test_search_no_value_cell(self):
        # Should not return this cell for all queries
        families = [Family(fullName="פרינץ", street=None)]
        
        test_cases = [
            ("None", None, 0),
            ("Empty String", "", 0),
            ("Not Found", "פ", 0)
        ]

        for title, query, expected_len in test_cases:
            with self.subTest(title=title):
                write_families_file(families=families)
                search_result = search_families(query, 'street')
                self.assertEqual(expected_len, len(search_result))
