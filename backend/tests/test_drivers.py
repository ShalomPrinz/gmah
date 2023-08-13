import unittest

from src.drivers import get_drivers, get_driver_families, update_driver_name, unique_list
from src.results import driver_update_results

from tests.families_util import setUpFamilies, tearDownFamilies, write_families, Family, load_families
from tests.tests_util import generate_random_name

class TestDriverInfo(unittest.TestCase):
    def setUpClass():
        setUpFamilies()

    def tearDownClass():
        tearDownFamilies()

    def test_get_drivers(self):
        test_cases = [
            ([], "Should return empty list if no drivers found"),
            (["פלוני", "פלוני"],            "Should return unique list"),
            (["פלוני", "אלמוני"],           "Should return list containing all drivers"),
            (["פלוני", "אלמוני", "פלוני"],  "Should return list containing all unique drivers"),
        ]
        
        for drivers, message in test_cases:
            with self.subTest(f"Drivers: {drivers}"):
                families = [Family({"שם מלא": generate_random_name(), "נהג": d}) for d in drivers]
                write_families(families)
                result = get_drivers(load_families())
                unique_drivers = unique_list(drivers)
                self.assertEqual(result, unique_drivers, message)

    def test_get_driver_families(self):
        driver_name = "פלוני"
        other_driver = "אלמוני"
        write_families([Family({"שם מלא": "שלום", "נהג": driver_name}),
                        Family({"שם מלא": "פרינץ", "נהג": driver_name}),
                        Family({"שם מלא": "נתאי", "נהג": other_driver})])
        families_file = load_families()

        test_cases = [
            (None,                  0, "Should return 0 families if driver name is None"),
            ("",                    0, "Should return 0 families if driver name is empty string"),
            (driver_name,           2, "Should return all driver families for an exist driver name"),
            (driver_name[:-1],      0, "Should return 0 families for a partial driver name"),
            (other_driver,          1, "Should return all driver families for an exist driver name"),
            ("not-a-real-driver",   0, "Should return 0 families for a non-existent driver")
        ]

        for driver, expected_families_count, message in test_cases:
            with self.subTest(f"Driver name: {driver}"):
                families = get_driver_families(families_file, driver)
                self.assertEqual(len(families), expected_families_count, message)

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
            (None,          0, 2, driver_update_results["MISSING_DRIVER"], "Should not update driver if given name is None"),
            ("",            0, 2, driver_update_results["MISSING_DRIVER"], "Should not update driver if given name is empty string"),
            ("א",           0, 2, driver_update_results["TOO_SHORT_DRIVER"], "Should not update driver if given name is too short"),
            ("חיה",         2, 0, driver_update_results["DRIVER_UPDATED"], "Should return driver updated if given name is a valid string"),
            (original_name, 2, 2, driver_update_results["DRIVER_UPDATED"], "Should return driver updated if given name is the original"),
        ]

        for driver_name, expected_new_count, expected_original_count, expected_result, message in test_cases:
            with self.subTest(f"Driver name: {driver_name}"):
                write_families(families)
                families_file = load_families()
                result = update_driver_name(families_file, original_name, driver_name)
                self.assertEqual(result, expected_result, message)

                new_name_families = len(get_driver_families(families_file, driver_name))
                self.assertEqual(new_name_families, expected_new_count, message)
                original_families = len(get_driver_families(families_file, original_name))
                self.assertEqual(original_families, expected_original_count, message)
