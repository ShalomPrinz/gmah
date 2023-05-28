import unittest
from shutil import copy
from os import remove

from src.data import families_filename
from src.search import find, FindRequest

from tests.test_families import Family, load_families_file, write_families_file

class TestFind(unittest.TestCase):
    def setUpClass():
        copy(families_filename, 'temp.xlsx')
    
    def tearDownClass():
        copy('temp.xlsx', families_filename)
        remove('temp.xlsx')

    def test_find(self):
        families = [Family({"שם מלא": "פרינץ"}), Family({"שם מלא": "כהנא"}), Family({"שם מלא": "נתאי"})]
        
        test_cases = [
            ("None", None, -1),
            ("Partial Match", "פ", -1),
            ("Exact Match", "פרינץ", 0),
            ("Exact Match", "כהנא", 1),
            ("Exact Match", "נתאי", 2)
        ]

        for title, query, expected_index in test_cases:
            with self.subTest(title=title):
                write_families_file(families=families)
                families_file = load_families_file()

                request = FindRequest(
                    rows_iter=families_file.get_rows_iter(),
                    query=query
                )

                find_result = find(request)
                self.assertEqual(expected_index, find_result)
