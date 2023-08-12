import unittest

from src.drivers import update_driver_name
from src.results import driver_update_results

from tests.families_util import setUpFamilies, tearDownFamilies, write_families, Family, load_families

class TestUpdateDriver(unittest.TestCase):
    def setUpClass():
        setUpFamilies()

    def tearDownClass():
        tearDownFamilies()

    def test_update_driver_name_not_exists(self):
        write_families([Family({"שם מלא": "שלום", "נהג": "פלוני"})])
        families_file = load_families()
        result = update_driver_name(families_file, "not-exists-driver", "שם חדש")
        self.assertEqual(result, driver_update_results["NO_SUCH_DRIVER"], "Should not update driver if given name is not a driver name")

    def test_update_driver_name(self):
        original_name = "נחום"
        families = [Family({"שם מלא": "שלום", "נהג": original_name}),
                    Family({"שם מלא": "פרינץ", "נהג": original_name}),
                    Family({"שם מלא": "נתאי", "נהג": "נהג אחר"})]

        test_cases = [
            (None,          driver_update_results["MISSING_DRIVER"], "Should not update driver if given name is None"),
            ("",            driver_update_results["MISSING_DRIVER"], "Should not update driver if given name is empty string"),
            ("א",           driver_update_results["TOO_SHORT_DRIVER"], "Should not update driver if given name is too short"),
            ("חיה",         driver_update_results["DRIVER_UPDATED"], "Should return driver updated if given name is a valid string"),
            (original_name, driver_update_results["DRIVER_UPDATED"], "Should return driver updated if given name is the original"),
        ]

        for driver_name, expected_result, message in test_cases:
            with self.subTest(f"Driver name: {driver_name}"):
                write_families(families)
                families_file = load_families()
                result = update_driver_name(families_file, original_name, driver_name)
                self.assertEqual(result, expected_result, message)
