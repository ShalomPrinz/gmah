import unittest

from src.managers import get_managers, load_managers_file, find_manager, remove_manager, add_manager

from tests.managers_util import setUpManagers, tearDownManagers, write_managers

class TestManagersInfo(unittest.TestCase):
    def setUpClass():
        setUpManagers()

    def tearDownClass():
        tearDownManagers()

    def test_load_managers_file(self):
        error, managers = load_managers_file()
        self.assertIsNone(error)
        self.assertIsNotNone(managers)

    def test_get_managers(self):
        expected_managers = [{ "id": "0", "name": "Testname", "drivers": [] }]
        managers_file = write_managers(expected_managers)

        actual_managers = get_managers(managers_file)
        self.assertEqual(actual_managers, expected_managers, "Should get managers from managers file")

    def test_find_manager(self):
        manager = "שלום"
        driver = "פלוני"
        managers_file = write_managers([{ "id": "0", "name": manager, "drivers": [
            { "name": driver, "phone": "052-5381648" },
            { "name": None },
            { "name": "" }
        ]}])

        test_cases = [
            (None,          None,       "Should return None if driver is None"),
            ("",            None,       "Should return None if driver is empty string"),
            (driver[:-1],   None,       "Should return None for a partial match"),
            (driver,        manager,    "Should return manager name for exact match")
        ]

        for driver, expected_manager, message in test_cases:
            with self.subTest(f"{expected_manager}, {driver}"):
                found_manager = find_manager(managers_file, driver)
                self.assertEqual(found_manager, expected_manager, message)

class TestManagersEdit(unittest.TestCase):
    def setUpClass():
        setUpManagers()

    def tearDownClass():
        tearDownManagers()
    
    def test_update_managers(self):
        initial_managers = [{ "id": "0", "name": "Testname", "drivers": [] }]
        managers_file = write_managers(initial_managers)

        expected_managers = [{ "id": "other", "name": "hello", "drivers": [] }]
        managers_file.update_json(expected_managers)

        actual_managers = get_managers(managers_file)
        self.assertEqual(actual_managers, expected_managers, "Should get updated managers from managers file")

    def test_remove_manager(self):
        correct_id = "0"
        initial_managers = [{ "id": correct_id, "name": "Testname", "drivers": [] }]
        managers_file = write_managers(initial_managers)

        test_cases = [
            (None,              1, "Should not remove any manager if manager_id is None"),
            ("",                1, "Should not remove any manager if manager_id is empty string"),
            (f"{correct_id}X",  1, "Should not remove any manager if manager_id doesn't exist"),
            (correct_id,        0, "Should remove the manager which his id matches given manager_id")
        ]

        for manager_id, expected_managers_count, message in test_cases:
            with self.subTest(f"{expected_managers_count}, {manager_id}"):
                remove_manager(managers_file, manager_id)
                actual_managers_count = len(get_managers(managers_file))
                self.assertEqual(actual_managers_count, expected_managers_count, message)
    
    def test_add_manager(self):
        managers_file = write_managers([])

        test_cases = [
            (None,      0, "Should not add manager if manager_name is None"),
            ("",        0, "Should not add manager if manager_name is empty string"),
            ("testy",   1, "Should add manager if manager_name is a non-empty string")
        ]

        for manager_name, expected_managers_count, message in test_cases:
            with self.subTest(f"manager_name: {manager_name}"):
                add_manager(managers_file, manager_name)
                actual_managers_count = len(get_managers(managers_file))
                self.assertEqual(actual_managers_count, expected_managers_count, message)

