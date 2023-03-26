import openpyxl
import unittest
from shutil import copy
from dotenv import load_dotenv
from os import getenv, remove

from src.families import get_count, search_families, add_family, AddFamilyResult

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
    workbook = openpyxl.load_workbook(FAMILIES_FILENAME)
    worksheet = workbook[workbook.sheetnames[0]]
    worksheet.delete_rows(2, worksheet.max_row - 1)

    for family in families:
        worksheet.append(family.to_excel_row())
    workbook.save(FAMILIES_FILENAME)

class TestSearch(unittest.TestCase):
    def setUpClass():
        copy(FAMILIES_FILENAME, 'temp.xlsx')
    
    def tearDownClass():
        copy('temp.xlsx', FAMILIES_FILENAME)
        remove('temp.xlsx')

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

    def test_search_hyphen(self):
        families = [Family(fullName="פרינץ", street="שפרינצק", homePhone="000-1111111")]
        
        test_cases = [
            ("Name Without Hyphen", "פר", "name", 1),
            ("Name With Hyphen", "פ-ר", "name", 0),
            ("Street Without Hyphen", "צק", "street", 1),
            ("Street With Hyphen", "צ-ק", "street", 0),
            ("Phone Without Hyphen", "01", "phone", 1),
            ("Phone With Hyphen", "0-1", "phone", 1),
        ]

        for title, query, search_by, expected_len in test_cases:
            with self.subTest(title=title):
                write_families_file(families=families)
                search_result = search_families(query, search_by)
                self.assertEqual(expected_len, len(search_result))

class TestDataManagement(unittest.TestCase):
    def setUpClass():
        copy(FAMILIES_FILENAME, 'temp.xlsx')
    
    def tearDownClass():
        copy('temp.xlsx', FAMILIES_FILENAME)
        remove('temp.xlsx')

    def test_get_families_num(self):
        expected_count = 10
        families = [Family(f"משפחה מס' {i}") for i in range(expected_count)]
        write_families_file(families)
        self.assertEqual(expected_count, get_count())

    def test_add_family(self):
        families = [Family(fullName="שלום פרינץ")]

        test_cases = [
            ("New Name", {"fullName": "נתאי פרינץ"}, AddFamilyResult.FAMILY_ADDED),
            ("Name Exists", {"fullName": "שלום פרינץ"}, AddFamilyResult.FAMILY_EXISTS),
            ("Name Partially Exists", {"fullName": "שלום"}, AddFamilyResult.FAMILY_ADDED),
            ("Missing Name", {}, AddFamilyResult.MISSING_FULL_NAME),
            ("Phone Not Digits", {"fullName": "א", "homePhone": "שלוםפרינץ"}, AddFamilyResult.PHONE_NOT_DIGITS),
            ("Phone Too Short", {"fullName": "א", "mobilePhone": "05253816"}, AddFamilyResult.PHONE_WRONG_LEN),
            ("Phone Too Long", {"fullName": "א", "homePhone": "05253816480"}, AddFamilyResult.PHONE_WRONG_LEN),
            ("Phone OK", {"fullName": "א", "mobilePhone": "0525381648"}, AddFamilyResult.FAMILY_ADDED),
            ("Phone With Hyphen", {"fullName": "א", "homePhone": "04-5381648"}, AddFamilyResult.FAMILY_ADDED),
            ("Phone With Hyphen", {"fullName": "א", "mobilePhone": "052-5381648"}, AddFamilyResult.FAMILY_ADDED),
        ]

        for title, family, expected_result in test_cases:
            with self.subTest(title=title):
                write_families_file(families=families)
                result = add_family(family)
                self.assertEqual(expected_result, result)
