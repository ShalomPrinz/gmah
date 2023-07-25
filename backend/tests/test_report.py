import unittest
from os import path

from src.data import date_prop, status_prop, key_prop, driver_prop_index
from src.month import generate_month_files, get_report_path, get_reports_list
from src.report import get_no_driver_families, get_no_manager_drivers, search_report, search_report_column, update_receipt_status, get_receipt_status
from src.results import receipt_update_results

from tests.families_util import Family, write_families, setUpFamilies, tearDownFamilies
from tests.managers_util import write_managers, setUpManagers, tearDownManagers
from tests.report_util import generate_report, tearDownMonth, remove_all_reports

class TestReportValidation(unittest.TestCase):
    def setUpClass():
        setUpFamilies()
        setUpManagers()
    
    def tearDownClass():
        tearDownFamilies()
        tearDownManagers()

    def test_validate_no_driver_families(self):
        test_cases = [
            ([None],            1, "Should treat 'None' as indicating the lack of a driver name"),
            ([""],              1, "Should treat empty string as indicating the lack of a driver name"),
            (["שם נהג"],        0, "Should count all non-driver families"),
            (["נהג אחר", ""],   1, "Should count all non-driver families"),
            (["שם נהג", "", "נהג אחר", "פלוני", None], 2, "Should count all non-driver families")
        ]

        for drivers, expected_count, message in test_cases:
            with self.subTest(f"drivers: {drivers}"):
                families = [Family({"שם מלא": "פרינץ", "נהג": driver_name}) for driver_name in drivers]
                write_families(families=families)
                error, no_driver_families = get_no_driver_families()
                self.assertTrue(error is None, "Failed getting no driver families")
                self.assertEqual(expected_count, no_driver_families, message)
    
    def test_no_driver_families_special_family_name(self):
        special_names = ["", None]

        for name in special_names:
            families = [Family({"שם מלא": name})]
            write_families(families=families)

            error, no_driver_families = get_no_driver_families()
            self.assertTrue(error is None, "Failed getting no driver families")
            self.assertEqual(0, no_driver_families, "Should not count any of 'special_names' (family names) as a non-driver family")

    def test_validate_no_manager_drivers(self):
        managers = [{ "id": 0, "name": "אחראי", "drivers": [
            { "name": "פלוני", "phone": "000-0000000"},
            {"name": "אלמוני", "phone": "111-1111111"}
        ]}]
        write_managers(managers)

        test_cases = [
            ([None],     0, "Should not count 'None' as a non-manager driver"),
            ([""],       0, "Should not count empty string as a non-manager driver"),
            (["שם נהג"], 1, "Should return a list of all non-manager driver"),
            (["נהג אחר", "אלמוני"], 1, "Should return a list of all non-manager driver"),
            (["שם נהג", "פלוני", "נהג כלשהו", "פלוני", None], 2, "Should return a list of all non-manager driver")
        ]

        for drivers, expected_count, message in test_cases:
            with self.subTest(f"drivers: {drivers}"):
                families = [Family({"שם מלא": "פרינץ", "נהג": driver_name}) for driver_name in drivers]
                write_families(families=families)
                error, no_manager_drivers = get_no_manager_drivers()
                self.assertTrue(error is None, "Failed getting no manager drivers")
                self.assertEqual(expected_count, len(no_manager_drivers), message)

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
        self.assertIn({ "name": "פלוני", "count": 3}, no_manager_drivers, "Should return a driver occurrences count")
        self.assertIn({ "name": "נהג אחר", "count": 1}, no_manager_drivers, "Should return a driver occurrences count")

class TestReportGeneration(unittest.TestCase):
    def setUpClass():
        setUpFamilies()
        setUpManagers()
    
    def tearDownClass():
        tearDownFamilies()
        tearDownManagers()
        tearDownMonth()

    def generate_report(self, families):
        return generate_report(self.assertTrue, families)
        
    def test_report_generated_in_folder(self):
        name = 'שם כלשהו'
        error = generate_month_files(name)
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

class TestReportsInfo(unittest.TestCase):
    def setUpClass():
        setUpFamilies()
        setUpManagers()
    
    def tearDownClass():
        tearDownFamilies()
        tearDownManagers()
        tearDownMonth()

    def generate_report(self, name):
        families = [Family({"שם מלא": "שלום פרינץ", "נהג": "נהגוס"})]
        return generate_report(self.assertTrue, families, name)

    def test_get_reports_list_count(self):
        test_cases = [
            (0, "Should not generate reports, and return empty list"),
            (1, "Should generate 1 report, and return 1 element list"),
            (3, "Should generate 3 reports, and return 3 elements list")
        ]

        for reports_count, message in test_cases:
            with self.subTest(f"reports count: {reports_count}"):
                for current in range(reports_count):
                    self.generate_report(f"report_{current}")
                
                actual_reports_count = len(get_reports_list())
                self.assertEqual(actual_reports_count, reports_count, message)
    
    def test_get_reports_list_names(self):
        test_cases = [
            ([],            "Should not generate reports, and return empty list"),
            (["single"],    "Should generate 1 report, and return 3 elements list"),
            (["first", "second", "third"], "Should not generate reports, and return empty list")
        ]

        for reports_names, message in test_cases:
            with self.subTest(f"reports names: {reports_names}"):
                remove_all_reports()
                for name in reports_names:
                    self.generate_report(name)
                
                actual_reports_names = sorted(get_reports_list())
                expected_reports_names = sorted(reports_names)
                self.assertListEqual(actual_reports_names, expected_reports_names, message)

class TestSearchReport(unittest.TestCase):
    def setUpClass():
        setUpFamilies()
        setUpManagers()
    
    def tearDownClass():
        tearDownFamilies()
        tearDownManagers()
        tearDownMonth()

    def generate_report(self, families):
        return generate_report(self.assertTrue, families)

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
                report_file = self.generate_report(families)
                search_result = search_report(report_file, query)
                self.assertEqual(expected_len, len(search_result), message)
    
    def test_search_by_manager(self):
        managers = [
            { "id": 0, "name": "שלמה", 
                    "drivers": [{"name": "נהג 1", "phone": "000-0000000"}]},
            { "id": 1, "name": "חיים",
                    "drivers": [{"name": "נהג 2", "phone": "111-1111111"}]},
            { "id": 2, "name": "נחום",
                    "drivers": [{"name": "נהג 3", "phone": "222-2222222"}]}
        ]
        write_managers(managers)
        families = [Family({"שם מלא": "פרינץ", "נהג": "נהג 1"}),
            Family({"שם מלא": "כהנא", "נהג": "נהג 2"}),
            Family({"שם מלא": "נתאי", "נהג": "נהג 3"})]
        
        test_cases = [
            (None,  3, "Should return all families when query is 'None'"),
            ("",    3, "Should return all families when query is empty string"),
            ("ם",   2, "Should return families that have managers containing 'ם'"),
            ("נח",  1, "Should return families that have managers containing 'נח'"),
            ("ש",   1, "Should return families that have managers containing 'ש'"),
            ("דהו", 0, "Should return empty list when no families found for a query")
        ]

        for query, expected_len, message in test_cases:
            with self.subTest(self.get_title(query)):
                report_file = self.generate_report(families)
                search_result = search_report(report_file, query, 'manager')
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
                report_file = self.generate_report(families)
                search_result = search_report(report_file, query, 'driver')
                self.assertEqual(expected_len, len(search_result), message)

    def test_search_no_value_cell(self):
        families = [Family({"שם מלא": "פרינץ", "נהג": None})]
        
        test_cases = [
            (None,  0, "Should not return a family if its searched value is None"),
            ("",    0, "Should not return a family if its searched value is None"),
            ("פ",   0, "Should not return a family if its searched value is None")
        ]

        for query, expected_len, message in test_cases:
            with self.subTest(self.get_title(query)):
                report_file = self.generate_report(families)
                search_result = search_report(report_file, query, 'driver')
                self.assertEqual(expected_len, len(search_result), message)

    def test_search_column_name(self):        
        test_cases = [
            ([None],    "Should return empty list"),
            ([],        "Should return empty list"),
            (["פרינץ"], "Should return a list with all family names"),
            (["פרינץ", "שלום", "נתאי"], "Should return a list with all family names")
        ]

        for families_list, message in test_cases:
            with self.subTest(families_list):
                families = list(map(lambda family: Family({ key_prop: family }), families_list))
                report_file = self.generate_report(families)
                expected_list = map(lambda family: family.excel_row[0], families)
                expected_list = list(filter(lambda family: family is not None, expected_list))

                search_result = search_report_column(report_file, '', 'name')
                self.assertListEqual(search_result, expected_list, message)
    
    def test_search_column_driver(self):        
        test_cases = [
            ([None],    "Should return empty list"),
            ([],        "Should return empty list"),
            (["נהגוס"], "Should return a list with all families drivers"),
            (["פרינץ", "שלום", "נתאי"], "Should return a list with all family drivers")
        ]

        for index, (families_list, message) in enumerate(test_cases):
            with self.subTest(families_list):
                families = list(map(lambda driver: Family({ key_prop: f"family_{index}", "נהג": driver }), families_list))
                report_file = self.generate_report(families)
                expected_list = map(lambda family: family.excel_row[driver_prop_index], families)
                expected_list = list(filter(lambda family: family is not None, expected_list))

                search_result = search_report_column(report_file, '', 'driver')
                self.assertListEqual(search_result, expected_list, message)

class TestMarkReport(unittest.TestCase):
    def setUpClass():
        setUpFamilies()
        setUpManagers()

    def tearDownClass():
        tearDownFamilies()
        tearDownManagers()
        tearDownMonth()

    def generate_report(self, family_name="פרינץ"):
        families = [Family({"שם מלא": family_name})]
        return family_name, generate_report(self.assertTrue, families)
    
    def test_default_receipt_status(self):
        family_name, report_file = self.generate_report()
        
        result = search_report(report_file, family_name, 'name')
        self.assertIsNone(result[0][date_prop], "Date should be None after generating report")
        self.assertIsNone(result[0][status_prop], "Receipt status should be None after generating report")

    def test_update_receipt_status(self):
        test_cases = [
            ({}, None, None, "Empty object should not update family receipt"),
            ({ "some": "2023-12-12" }, None,         None, "Wrong props should not update family receipt"),
            ({ "date": "2023-12-12" }, "2023-12-12", None, "Single right prop should update family receipt"),
            ({ "status": True },       None,         None, "Should not update family receipt if date is not present"),
            ({ "status": True, "date": "" }, None,   None, "Should not update family receipt if date is empty string"),
            ({ "date": "2000-01-01", "status": False }, "2000-01-01", False, "Both right props should update family receipt")
        ]

        for update_obj, expected_date, expected_status, message in test_cases:
            with self.subTest(f"{update_obj}"):
                family_name, report_file = self.generate_report()

                update_receipt_status(report_file, family_name, update_obj)

                result = search_report(report_file, family_name, 'name')
                self.assertEqual(result[0][date_prop], expected_date, message)
                self.assertEqual(result[0][status_prop], expected_status, message)
    
    def test_update_receipt_status_result(self):
        test_cases = [
            ({}, receipt_update_results["MISSING_DATE"], "Empty object should return missing date result"),
            ({ "some": "2023-12-12" }, receipt_update_results["MISSING_DATE"], "Wrong props should return missing date result"),
            ({ "date": "2023-12-12" }, receipt_update_results["RECEIPT_UPDATED"], "Date prop only should update family receipt"),
            ({ "date": "19-04-2023" }, receipt_update_results["DATE_MALFORMED"], "Should return malformed date result if date isn't formed correctly"),
            ({ "status": True },       receipt_update_results["MISSING_DATE"], "Status prop only should return missing date result"),
            ({ "status": True, "date": "" }, receipt_update_results["MISSING_DATE"], "Should return missing date result if date is empty string"),
            ({ "date": "2000-01-01", "status": False }, receipt_update_results["RECEIPT_UPDATED"], "Both right props should return receipt updated result")
        ]

        for update_obj, expected_result, message in test_cases:
            with self.subTest(f"{update_obj}"):
                family_name, report_file = self.generate_report()
                actual_update_result = update_receipt_status(report_file, family_name, update_obj)
                self.assertEqual(actual_update_result, expected_result, message)
    
    def test_get_receipt_status_not_found(self):
        default_receipt_status = {
            "date": "",
            "status": False,
        }

        test_cases = [
            (None,  "Should return default receipt status if family not found"),
            ("",    "Should return default receipt status if family not found"),
        ]

        for family_name, message in test_cases:
            with self.subTest(f"{family_name}"):
                _, report_file = self.generate_report(family_name)
                receipt_status = get_receipt_status(report_file, family_name)
                self.assertEqual(receipt_status, default_receipt_status, message)

    def test_get_receipt_status_found(self):
        expected_receipt_status = {
            "date": "1928-12-12",
            "status": True,
        }
        family_name, report_file = self.generate_report()
        update_receipt_status(report_file, family_name, expected_receipt_status)
        
        receipt_status = get_receipt_status(report_file, family_name)
        self.assertEqual(receipt_status, expected_receipt_status, "Should return updated receipt status")
