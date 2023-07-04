import unittest

from src.search import find, FindRequest

from tests.families_util import Family, load_families, write_families, setUpFamilies, tearDownFamilies

class TestFind(unittest.TestCase):
    def setUpClass():
        setUpFamilies()
    
    def tearDownClass():
        tearDownFamilies()

    def test_find(self):
        families = [Family({"שם מלא": "פרינץ"}), Family({"שם מלא": "כהנא"}), Family({"שם מלא": "נתאי"})]
        
        test_cases = [
            (None,      -1, "Should return -1 if query is 'None'"),
            ("פ",       -1, "Should return -1 for partial match"),
            ("פרינץ",   0,  "Should return index in families if exact match is found"),
            ("כהנא",    1,  "Should return index in families if exact match is found"),
            ("נתאי",    2,  "Should return index in families if exact match is found")
        ]

        for query, expected_index, message in test_cases:
            with self.subTest(f"query: {query}"):
                write_families(families=families)
                families_file = load_families()

                request = FindRequest(
                    rows_iter=families_file.get_rows_iter(),
                    query=query
                )

                find_result = find(request)
                self.assertEqual(expected_index, find_result, message)
