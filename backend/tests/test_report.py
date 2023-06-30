import unittest

from src.month import get_no_driver_families, get_no_manager_drivers

from tests.families_util import Family, write_families, setUpFamilies, tearDownFamilies
from tests.managers_util import write_managers, setUpManagers, tearDownManagers

class TestReportValidation(unittest.TestCase):
    def setUpClass():
        setUpFamilies()
        setUpManagers()
    
    def tearDownClass():
        tearDownFamilies()
        tearDownManagers()

    def test_validate_no_driver_families(self):
        test_cases = [
            ("None", [None], 1),
            ("Empty String", [""], 1),
            ("One Driver", ["שם נהג"], 0),
            ("One of Two Drivers", ["נהג אחר", ""], 1),
            ("Many Drivers", ["שם נהג", "", "נהג אחר", "פלוני", None], 2)
        ]

        for title, drivers, expected_count in test_cases:
            with self.subTest(title=title):
                families = [Family({"שם מלא": "פרינץ", "נהג": driver_name}) for driver_name in drivers]
                write_families(families=families)
                error, no_driver_families = get_no_driver_families()
                self.assertTrue(error is None, "Failed getting no driver families")
                self.assertEqual(expected_count, no_driver_families)
    
    def test_validate_no_manager_drivers(self):
        managers = [{ "id": 0, "name": "אחראי", "drivers": [
            { "name": "פלוני", "phone": "000-0000000"},
            {"name": "אלמוני", "phone": "111-1111111"}
        ]}]
        write_managers(managers)

        test_cases = [
            ("None", [None], 0),
            ("Empty String", [""], 0),
            ("One Driver", ["שם נהג"], 1),
            ("One of Two Drivers", ["נהג אחר", "אלמוני"], 1),
            ("Many Drivers", ["שם נהג", "פלוני", "נהג כלשהו", "פלוני", None], 2)
        ]

        for title, drivers, expected_count in test_cases:
            with self.subTest(title=title):
                families = [Family({"שם מלא": "פרינץ", "נהג": driver_name}) for driver_name in drivers]
                write_families(families=families)
                error, no_manager_drivers = get_no_manager_drivers()
                self.assertTrue(error is None, "Failed getting no manager drivers")
                self.assertEqual(expected_count, len(no_manager_drivers))

        