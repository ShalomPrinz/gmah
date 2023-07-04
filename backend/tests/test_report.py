import unittest
from os import path

from src.month import generate_month_report, get_no_driver_families, get_no_manager_drivers, get_report_path

from tests.families_util import Family, write_families, setUpFamilies, tearDownFamilies
from tests.managers_util import write_managers, setUpManagers, tearDownManagers
from tests.report_util import load_report, tearDownMonth

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
    
    def test_no_driver_families_special_family_name(self):
        special_names = ["", None]

        for name in special_names:
            families = [Family({"שם מלא": name})]
            write_families(families=families)

            error, no_driver_families = get_no_driver_families()
            self.assertTrue(error is None, "Failed getting no driver families")
            self.assertEqual(0, no_driver_families)

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

    def test_no_manager_drivers_count(self):
        managers = [{ "id": 0, "name": "אחראי", "drivers": [
            { "name": "אלמוני", "phone": "000-0000000"},
        ]}]
        write_managers(managers)

        drivers = ["פלוני", "פלוני", "נהג אחר", "פלוני", "אלמוני"]
        families = [Family({"שם מלא": "פרינץ", "נהג": driver_name}) for driver_name in drivers]
        write_families(families=families)

        error, no_manager_drivers = get_no_manager_drivers()
        self.assertTrue(error is None, "Failed getting no manager drivers")
        self.assertIn({ "name": "פלוני", "count": 3}, no_manager_drivers)
        self.assertIn({ "name": "נהג אחר", "count": 1}, no_manager_drivers)

class TestReportGeneration(unittest.TestCase):
    def setUpClass():
        setUpFamilies()
        setUpManagers()
    
    def tearDownClass():
        tearDownFamilies()
        tearDownManagers()
        tearDownMonth()

    def generate_report(self, families):
        '''
        Generates monthly report out of given families.
        Returns report path.
        '''
        write_families(families)

        name = "שם דוח"
        error = generate_month_report(name)
        self.assertTrue(error is None, "Failed generating month report")

        path = get_report_path(name)
        return load_report(path)
        
    def test_report_generated_in_folder(self):
        name = 'שם כלשהו'
        error = generate_month_report(name)
        self.assertTrue(error is None, "Failed generating month report")
        
        filepath = get_report_path(name)
        file_exists = path.isfile(filepath)
        self.assertTrue(file_exists,
                        "Should validate report file exists in the right path")

    def test_report_lines_number(self):
        names = ["שלום", "פרינץ", "נתאי", "אביגל", "אפרת"]
        families = [Family({"שם מלא": family_name, "נהג": "נהגוס"}) for family_name in names]

        report = self.generate_report(families)

        families_on_report = report.get_rows_num() - 1 # Headline
        expected_families_count = len(names)
        self.assertEqual(families_on_report, expected_families_count,
                        "Should generate families count of report lines")

    def test_report_family_without_name(self):
        names = ["שלום", None]
        families = [Family({"שם מלא": family_name, "נהג": "נהגוס"}) for family_name in names]

        report = self.generate_report(families)

        families_on_report = report.get_rows_num() - 1 # Headline
        expected_families_count = len(names) - 1 # "None" doesn't count as a family
        self.assertEqual(families_on_report, expected_families_count,
                        "Should not generate line in report for family without name")
    
    def test_report_family_without_driver(self):
        names = ["פלוני", None, ""]
        families = [Family({"שם מלא": "שלום", "נהג": driver_name}) for driver_name in names]

        report = self.generate_report(families)

        families_on_report = report.get_rows_num() - 1 # Headline
        expected_families_count = len(names) # None and "" are valid as driver names
        self.assertEqual(families_on_report, expected_families_count,
                         "Should generate line in report even for families without driver")

