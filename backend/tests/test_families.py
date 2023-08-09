import unittest

from src.families import get_count, search_families, add_family, add_families, update_family, remove_family, restore_family, FamiliesSearchBy
from src.results import add_results, add_many_results, add_many_error
from src.errors import FamilyNotFoundError
from src.search import find, FindRequest

from tests.families_util import Family, HistoryFamily, load_families, load_families_history, load_both_families_files, write_families, write_history_families, empty_families, empty_families_history, setUpFamilies, tearDownFamilies

class TestSearch(unittest.TestCase):
    def setUpClass():
        setUpFamilies()
    
    def tearDownClass():
        tearDownFamilies()

    def get_title(self, query):
        return f"query: {query}"

    def test_search_by_name(self):
        families = [Family({"שם מלא": "פרינץ"}), Family({"שם מלא": "כהנא"}), Family({"שם מלא": "נתאי"})]
        
        test_cases = [
            (None,  3, "Should return all families when query is 'None'"),
            ("",    3, "Should return all families when query is empty string"),
            ("י",   2, "Should return families that have names containing 'י'"),
            ("פ",   1, "Should return families that have names containing 'פ'"),
            ("ה",   1, "Should return families that have names containing 'ה'"),
            ("אבג", 0, "Should return empty list when no families found for a query")
        ]

        for query, expected_len, message in test_cases:
            with self.subTest(self.get_title(query)):
                write_families(families=families)
                families_file = load_families()
                search_result = search_families(families_file, query)
                self.assertEqual(expected_len, len(search_result), message)
    
    def test_search_by_street(self):
        families = [Family({"שם מלא": "פרינץ", "רחוב": "הבנים"}),
            Family({"שם מלא": "כהנא", "רחוב": "השופטים"}),
            Family({"שם מלא": "נתאי", "רחוב": "סלינג'ר"})]
        
        test_cases = [
            (None,  3, "Should return all families when query is 'None'"),
            ("",    3, "Should return all families when query is empty string"),
            ("ם",   2, "Should return families that have streets containing 'ם'"),
            ("סל",  1, "Should return families that have streets containing 'סל'"),
            ("ב",   1, "Should return families that have streets containing 'ב'"),
            ("דהו", 0, "Should return empty list when no families found for a query")
        ]

        for query, expected_len, message in test_cases:
            with self.subTest(self.get_title(query)):
                write_families(families=families)
                families_file = load_families()
                search_result = search_families(families_file, query, 'street')
                self.assertEqual(expected_len, len(search_result), message)

    def test_search_by_phone(self):
        families = [Family({"שם מלא": "פרינץ", "מס' פלאפון": "333-4444444", "מס' בית": "000-1111111"}),
            Family({"שם מלא": "כהנא", "מס' פלאפון": "444-5555555", "מס' בית": "111-2222222"}),
            Family({"שם מלא": "נתאי", "מס' פלאפון": "555-6666666", "מס' בית": "222-3333333"})]
        
        test_cases = [
            (None,  3, "Should return all families when query is 'None'"),
            ("",    3, "Should return all families when query is empty string"),
            ("0",   1, "Should return families that have phone numbers containing '0'"),
            ("1",   2, "Should return families that have phone numbers containing '1'"),
            ("6",   1, "Should return families that have phone numbers containing '6'"),
            ("5",   2, "Should return families that have phone numbers containing '5'"),
            ("3",   2, "Should return families that have phone numbers containing '3'"),
            ("7",   0, "Should return empty list when no families found for a query")
        ]

        for query, expected_len, message in test_cases:
            with self.subTest(self.get_title(query)):
                write_families(families=families)
                families_file = load_families()
                search_result = search_families(families_file, query, 'phone')
                self.assertEqual(expected_len, len(search_result), message)

    def test_search_by_driver(self):
        families = [Family({"שם מלא": "פרינץ", "נהג": "ארז משה"}),
            Family({"שם מלא": "כהנא", "נהג": "אלי לולו"}),
            Family({"שם מלא": "נתאי", "נהג": "יוסי זהר"})]
        
        test_cases = [
            (None,  3, "Should return all families when query is 'None'"),
            ("",    3, "Should return all families when query is empty string"),
            ("א",   2, "Should return families that have drivers containing 'א'"),
            ("מ",   1, "Should return families that have drivers containing 'מ'"),
            ("ר",   2, "Should return families that have drivers containing 'ר'"),
            ("זחט", 0, "Should return empty list when no families found for a query")
        ]

        for query, expected_len, message in test_cases:
            with self.subTest(self.get_title(query)):
                write_families(families=families)
                families_file = load_families()
                search_result = search_families(families_file, query, 'driver')
                self.assertEqual(expected_len, len(search_result), message)

    def test_search_no_value_cell(self):
        families = [Family({"שם מלא": "פרינץ", "רחוב": None})]
        
        test_cases = [
            (None,  0, "Should not return a family if its searched value is None"),
            ("",    0, "Should not return a family if its searched value is None"),
            ("פ",   0, "Should not return a family if its searched value is None")
        ]

        for query, expected_len, message in test_cases:
            with self.subTest(self.get_title(query)):
                write_families(families=families)
                families_file = load_families()
                search_result = search_families(families_file, query, 'street')
                self.assertEqual(expected_len, len(search_result), message)

    def test_search_hyphen(self):
        families = [Family({"שם מלא": "פרינץ", "רחוב": "שפרינצק", "מס' בית": "000-1111111"})]
        
        test_cases = [
            ("פר",  "name",     1, "Should return one result, validates for next test"),
            ("פ-ר", "name",     0, "Should not ignore hyphen when searching by name"),
            ("צק",  "street",   1, "Should return one result, validates for next test"),
            ("צ-ק", "street",   0, "Should not ignore hyphen when searching by street"),
            ("01",  "phone",    1, "Should ignore hyphen absence when searching by phone"),
            ("0-1", "phone",    1, "Should ignore hyphen existence when searching by phone"),
        ]

        for query, search_by, expected_len, message in test_cases:
            with self.subTest(self.get_title(query)):
                write_families(families=families)
                families_file = load_families()
                search_result = search_families(families_file, query, search_by)
                self.assertEqual(expected_len, len(search_result), message)

    def test_search_history_by_r11r(self):
        families = [HistoryFamily({"שם מלא": "פרינץ", "ממליץ": "רווחה"}),
            HistoryFamily({"שם מלא": "כהנא", "ממליץ": "ממליץ"}),
            HistoryFamily({"שם מלא": "נתאי", "ממליץ": "יועצת"})]
        
        test_cases = [
            (None,  3, "Should return all families when query is 'None'"),
            ("",    3, "Should return all families when query is empty string"),
            ("י",   2, "Should return families that have recommender (r11r) containing 'י'"),
            ("לי",  1, "Should return families that have recommender (r11r) containing 'לי'"),
            ("ח",   1, "Should return families that have recommender (r11r) containing 'ח'"),
            ("יכל", 0, "Should return empty list when no families found for a query")
        ]

        for query, expected_len, message in test_cases:
            with self.subTest(self.get_title(query)):
                write_history_families(families=families)
                history_file = load_families_history()
                search_result = search_families(history_file, query, 'r11r')
                self.assertEqual(expected_len, len(search_result), message)

    def test_search_exact(self):
        families = [Family({"שם מלא": "פרינץ"}), Family({"שם מלא": "פרינ"}), Family({"שם מלא": "רינ"})]
        
        test_cases = [
            ("רינ",     False,  3, "Should return families that have names containing 'רינ'"),
            ("רינ",     True,   1, "Should return families who their name is 'רינ'"),
            ("פרינץ",   True,   1, "Should return families who their name is 'פרינץ'"),
        ]

        for query, exact, expected_len, message in test_cases:
            with self.subTest(self.get_title(query)):
                write_families(families=families)
                families_file = load_families()
                search_result = search_families(families_file, query, exact=exact)
                self.assertEqual(expected_len, len(search_result), message)

class TestFind(unittest.TestCase):
    def setUpClass():
        setUpFamilies()
    
    def tearDownClass():
        tearDownFamilies()
    
    def test_find_families(self):
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
                    query=query,
                    search_enum=FamiliesSearchBy
                )

                find_result = find(request)
                self.assertEqual(expected_index, find_result, message)

class TestDataManagement(unittest.TestCase):
    def setUpClass():
        setUpFamilies()
    
    def tearDownClass():
        tearDownFamilies()

    def test_get_families_num(self):
        expected_count = 10
        families = [Family({"שם מלא": f"משפחה מס' {i}"}) for i in range(expected_count)]
        write_families(families)
        families_file = load_families()
        self.assertEqual(expected_count, get_count(families_file), "Should return correct number of families")

    def test_add_family(self):
        exist_families = [Family({"שם מלא": "שלום פרינץ"})]

        test_cases = [
            ({"שם מלא": "נתאי פרינץ"},  add_results["FAMILY_ADDED"],        "Should return 'Family Added' result"),
            ({"שם מלא": "שלום פרינץ"},  add_results["FAMILY_EXISTS"],       "Should return 'Family Exists' result"),
            ({"שם מלא": "שלום"},        add_results["FAMILY_ADDED"],        "Should return 'Family Added' result"),
            ({},                         add_results["MISSING_FULL_NAME"],  "Should return 'Missing Full Name' result"),
            ({"שם מלא": "א", "מס' בית": "שלוםפרינץ"},     add_results["PHONE_NOT_DIGITS"], "Should return 'Phone is Not Digits' result"),
            ({"שם מלא": "א", "מס' פלאפון": "05253816"},    add_results["PHONE_WRONG_LEN"], "Should return 'Phone has Wrong Length' result"),
            ({"שם מלא": "א", "מס' בית": "05253816480"},    add_results["PHONE_WRONG_LEN"], "Should return 'Phone has Wrong Length' result"),
            ({"שם מלא": "א", "מס' פלאפון": "0525381648"},  add_results["FAMILY_ADDED"],   "Should return 'Family Added' result"),
            ({"שם מלא": "א", "מס' בית": "04-5381648"},     add_results["FAMILY_ADDED"], "Should return 'Family Added' result"),
            ({"שם מלא": "א", "מס' פלאפון": "052-5381648"}, add_results["FAMILY_ADDED"], "Should return 'Family Added' result")
        ]

        for family, expected_result, message in test_cases:
            with self.subTest(expected_result.title):
                write_families(families=exist_families)
                families_file = load_families()
                result = add_family(families_file, family)
                self.assertEqual(expected_result, result, message)

    def test_add_many_families(self):
        family = {"שם מלא": "שלום פרינץ"}
        exist_families = [Family(family)]
        exists_error = add_many_error(add_results["FAMILY_EXISTS"], family["שם מלא"])

        test_cases = [
            ([],                                               add_many_results["FAMILIES_ADDED"], "Should return 'Family Added' result, and add no families"),
            ([{"שם מלא": "נתאי פרינץ"}],                      add_many_results["FAMILIES_ADDED"], "Should return 'Family Added' result "),
            ([{"שם מלא": "שלום פרינץ"}],                      exists_error, "Should return 'Family Exists' result"),
            ([{"שם מלא": "שלום"}, {"שם מלא": "שלום פרינץ"}], exists_error, "Should return 'Family Added' result for second family too"),
        ]

        for families, expected_result, message in test_cases:
            with self.subTest(expected_result.title):
                write_families(families=exist_families)
                families_file = load_families()
                result = add_families(families_file, families)
                self.assertEqual(expected_result, result, message)

    def test_add_families_before_error(self):
        family = {"שם מלא": "שלום פרינץ"}
        exist_families = [Family(family)]
        write_families(families=exist_families)
        
        families_file = load_families()
        families = [{"שם מלא": "דוד חיים"}, {"שם מלא": "משפוחה"}, {"שם מלא": "שלום פרינץ"}]
        result = add_families(families_file, families)
        
        exists_error = add_many_error(add_results["FAMILY_EXISTS"], family["שם מלא"])
        self.assertEqual(exists_error, result, "Should return 'Family Exists' result")

        first_search = search_families(families_file, "דוד חיים", 'name')
        self.assertEqual(1, len(first_search), "Should add first family before error")
        second = search_families(families_file, "משפוחה", 'name')
        self.assertEqual(1, len(second), "Should add second family before error")

    def test_update_family(self):
        updated_family = {"שם מלא": "שם חדש"}
        families = [{"שם מלא": ""}, {"שם מלא": None}, {"שם מלא": "שלום פרינץ"}, {"שם מלא": "נתאי"}, {"שם מלא": "חיים"}]
        exist_families = [Family(f) for f in families]

        test_cases = [
            ("No Such Name",        "גרון", updated_family, FamilyNotFoundError),
            ("Partial Name Match",  "שלום", updated_family, FamilyNotFoundError),
            ("Exact Match",         "נתאי", updated_family, None)
        ]

        for title, original_name, family_data, expected_result in test_cases:
            with self.subTest(title=title):
                write_families(families=exist_families)
                families_file = load_families()
                result = update_family(families_file, original_name, family_data)
                if expected_result is None:
                    self.assertIs(result, None, "Should return None if successful")
                else:
                    self.assertIsInstance(result, expected_result, "Should raise FamilyNotFound Exception")

class TestFamiliesHistory(unittest.TestCase):
    def setUpClass():
        setUpFamilies()
    
    def tearDownClass():
        tearDownFamilies()

    def test_remove_family(self):
        families = [Family({"שם מלא": "פרינץ"})]

        test_cases = [
            (None,      1, 0, "Should return error if family name is None"),
            ("",        1, 0, "Should return error if family name is empty string"),
            ("שלום",    1, 0, "Should return error if family not found"),
            ("פרינץ",   0, 1, "Should return None and remove family from families file")
        ]

        for family, expected_families_count, expected_history_count, message in test_cases:
            with self.subTest(f"{family}: {expected_families_count}"):
                write_families(families=families)
                empty_families_history()

                families_file, history_file = load_both_families_files()
                error = remove_family(families_file, history_file, family, "", "")
                if expected_families_count == 1:
                    self.assertIsInstance(error, Exception, message)
                elif expected_families_count == 0:
                    self.assertIsNone(error, message)
                
                actual_families_count = get_count(families_file)
                actual_history_count = get_count(history_file)
                self.assertEqual(expected_families_count, actual_families_count, message)
                self.assertEqual(expected_history_count, actual_history_count, message)

    def test_restore_family(self):
        history_families = [Family({"שם מלא": "פרינץ"})]

        test_cases = [
            (None,      0, 1, "Should return error if family name is None"),
            ("",        0, 1, "Should return error if family name is empty string"),
            ("שלום",    0, 1, "Should return error if family not found"),
            ("פרינץ",   1, 0, "Should return None and restore family from families history file")
        ]

        for family, expected_families_count, expected_history_count, message in test_cases:
            with self.subTest(f"{family}: {expected_history_count}"):
                write_history_families(history_families)
                empty_families()

                families_file, history_file = load_both_families_files()
                error = restore_family(families_file, history_file, family)
                if expected_history_count == 1:
                    self.assertIsInstance(error, Exception, message)
                elif expected_history_count == 0:
                    self.assertIsNone(error, message)
                
                actual_history_count = get_count(history_file)
                actual_families_count = get_count(families_file)
                self.assertEqual(expected_history_count, actual_history_count, message)
                self.assertEqual(expected_families_count, actual_families_count, message)
