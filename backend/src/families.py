from enum import Enum

from src.data import driver_prop, key_prop, family_properties, families_filename, families_history_filename, holiday_families_filename, history_properties, holiday_properties, exit_date_prop, reason_prop
from src.excel import Excel
from src.util import without_hyphen, insert_hyphen, validate_driver_name
from src.results import Result, add_results, add_many_error, add_many_results, driver_update_results
from src.styles import families_cell_style

class FamiliesSearchBy(Enum):
    NAME = 'name'
    STREET = 'street'
    PHONE = 'phone'
    DRIVER = 'driver'
    R11R = 'r11r'

    @classmethod
    def get_search_columns(cls, search_by):
        if search_by is None:
            return []

        search_by = getattr(
            FamiliesSearchBy,
            search_by.upper(),
            FamiliesSearchBy.NAME)
        match search_by:
            case FamiliesSearchBy.NAME:
                return [0]
            case FamiliesSearchBy.STREET:
                return [1]
            case FamiliesSearchBy.PHONE:
                return [5, 6]
            case FamiliesSearchBy.DRIVER:
                return [7]
            case FamiliesSearchBy.R11R:
                return [8]
            case _:
                return [0]

class FamiliesHistorySearchBy(Enum):
    NAME = 'name'
    R11R = 'r11r'

    @classmethod
    def get_search_columns(cls, search_by):
        if search_by is None:
            return []

        search_by = getattr(
            FamiliesHistorySearchBy,
            search_by.upper(),
            FamiliesHistorySearchBy.NAME)
        match search_by:
            case FamiliesHistorySearchBy.NAME:
                return [0]
            case FamiliesHistorySearchBy.R11R:
                return [7]
            case _:
                return [0]

class HolidayFamiliesSearchBy(Enum):
    NAME = 'name'
    STREET = 'street'
    R11R = 'r11r'

    @classmethod
    def get_search_columns(cls, search_by):
        if search_by is None:
            return []

        search_by = getattr(
            HolidayFamiliesSearchBy,
            search_by.upper(),
            HolidayFamiliesSearchBy.NAME)
        match search_by:
            case HolidayFamiliesSearchBy.NAME:
                return [0]
            case HolidayFamiliesSearchBy.STREET:
                return [1]
            case HolidayFamiliesSearchBy.R11R:
                return [7]
            case _:
                return [0]

def load_families_excel(filename, row_properties, search_enum):
    '''
    Internal wrapper for loading excel files containing families
    '''
    try:
        families_file = Excel(
            filename=filename,
            row_properties=row_properties,
            search_enum=search_enum,
            required_style=families_cell_style,
            table_name='נתמכים')
        return (None, families_file)
    except Exception as e:
        return (e, None)

def load_families_file(filepath=families_filename):
    '''
    Connects to the families source file.

    Returns a tuple: (error, file)
        - If connection has failed, file will be None
        - If connection has succeed, error will be None
    '''
    return load_families_excel(
        filepath,
        family_properties,
        FamiliesSearchBy)

def load_families_history_file():
    '''
    Connects to the families history source file.

    Returns a tuple: (error, file)
        - If connection has failed, file will be None
        - If connection has succeed, error will be None
    '''
    return load_families_excel(
        families_history_filename,
        history_properties,
        FamiliesHistorySearchBy)

def load_holiday_families_file(filepath=holiday_families_filename):
    '''
    Connects to the holiday famileis source file.

    Returns a tuple: (error, file)
        - If connection has failed, file will be None
        - If connection has succeed, error will be None
    '''
    return load_families_excel(
        filepath,
        holiday_properties,
        HolidayFamiliesSearchBy)

def to_excel_row(family):
    '''
    Cast family data to excel row format in the right order
    '''
    return [family.get(attr, None) for attr in family_properties]

def to_history_row(family):
    '''
    Cast family data to history row format in the right order
    '''
    return [family.get(attr, None) for attr in history_properties]

def to_holiday_row(family):
    '''
    Cast family data to holiday row format in the right order
    '''
    return [family.get(attr, None) for attr in holiday_properties]

def get_count(families_file: Excel):
    '''
    Returns the number of families, which should be the number of rows
    in the families file minus the headline row
    '''
    return families_file.get_rows_num() - 1

def search_families(families_file: Excel, query='', search_by='', exact=False):
    '''
    Returns list of families who their value of the search_by cell
    matches the given query
    '''
    query = '' if query is None else query
    search_by = '' if search_by is None else search_by
    exact = False if exact is None else exact

    return families_file.search(query, search_by, exact=exact)

def format_phone(family, attr_name):
    '''
    Validates phone is 9 or 10 digits only.

    Returns:
        - None: Family doesn't have attr_name
        - AddFamilyResult key: Validation failed
        - string (phone): Validated & formatted phone
    '''
    if attr_name not in family:
        return None

    phone = family[attr_name]
    if phone is None or phone == '':
        return None

    phone = without_hyphen(str(phone))
    if not phone.replace('0', '').isdigit():
        return add_results["PHONE_NOT_DIGITS"]

    if len(phone) == 9:
        phone = insert_hyphen(phone, 2)
    elif len(phone) == 10:
        phone = insert_hyphen(phone, 3)
    else:
        return add_results["PHONE_WRONG_LEN"]

    return phone

def is_family_exists(families_file: Excel, family_name):
    '''
    Returns whether a family exists in the excel, by searching for
    a match of family name, assuming a family name property is unique.
    '''
    search_result = search_families(families_file, family_name, 'name')
    if len(search_result) > 0 and any(
            found_family[key_prop] == family_name for found_family in search_result):
        return True
    return False

def validate_phones(family):
    '''
    Validates and formats phone numbers for a given family.

    Returns:
        - If a phone number is invalid, an AddFamilyResult is returned.
        - If all phone numbers are valid and formatted, None is returned.
    '''
    for phone_type in ["מס' בית", "מס' פלאפון"]:
        result = format_phone(family, phone_type)
        if result is None:
            continue
        elif isinstance(result, Result):
            return result
        else:
            family[phone_type] = result

def add_family(families_file: Excel, family, excel_cast=to_excel_row):
    '''
    Adds the given family to the families file. family should be a dictionary
    with custom family properties, key_prop property required
    '''
    if key_prop not in family:
        return add_results["MISSING_FULL_NAME"]

    if is_family_exists(families_file, family[key_prop]):
        return add_results["FAMILY_EXISTS"]

    if validation_error := validate_phones(family):
        return validation_error

    excel_families = [excel_cast(family)]
    families_file.append_rows(excel_families)
    return add_results["FAMILY_ADDED"]

def add_families(families_file: Excel, families):
    '''
    Adds a list of families to the families file.

    If error occurres in adding a family, the function will
    stop the addition of families and return error information.
    '''
    for family in families:
        result = add_family(families_file, family)
        if result.status != 200:
            return add_many_error(result, family[key_prop])
    return add_many_results["FAMILIES_ADDED"]

def update_family(families_file: Excel, original_name, family):
    '''
    Changes the data of originalName family to the new family data.
    '''
    try:
        index = families_file.get_row_index(original_name)
    except Exception as e:
        return e
    families_file.replace_row(index, family)

def move_family(origin_file: Excel, family_name):
    '''
    Removes the given family from origin file and returns its data.
    '''
    try:
        index = origin_file.get_row_index(family_name)
    except Exception as e:
        return e, None
    
    family_data = origin_file.search(family_name, 'name')[0]
    origin_file.remove_row(index)
    return None, family_data

def remove_family(
        origin_families_file: Excel,
        history_file: Excel,
        family_name,
        exit_date,
        reason):
    '''
    Moves the given family from origin families file to families history file.
    '''
    error, family_data = move_family(origin_families_file, family_name)
    if error is not None:
        return error
    
    family_data[exit_date_prop] = exit_date
    family_data[reason_prop] = reason

    result = add_family(history_file, family_data, to_history_row)
    if result.status != 200:
        return Exception(
            "המשפחה הוסרה בהצלחה מהנתמכים, אך קרתה שגיאה בהוספת המשפחה להסטוריית הנתמכים")

def restore_family(families_file: Excel, history_file: Excel, family_name):
    '''
    Moves the given family from families history file to families file.
    '''
    error, family_data = move_family(history_file, family_name)
    if error is not None:
        return error

    result = add_family(families_file, family_data, to_excel_row)
    if result.status != 200:
        return Exception(
            "המשפחה הוסרה בהצלחה מהסטוריית הנתמכים, אך קרתה שגיאה בהוספת המשפחה לנתמכים")

def move_holiday_to_regular(families_file: Excel, holiday_file: Excel, family_name):
    '''
    Moves the given family from holiday file to families file.
    '''
    error, family_data = move_family(holiday_file, family_name)
    if error is not None:
        return error

    result = add_family(families_file, family_data, to_excel_row)
    if result.status != 200:
        return Exception(
            "המשפחה הוסרה בהצלחה מהמשפחות לחגים, אך קרתה שגיאה בהוספת המשפחה לנתמכים הקבועים")

def move_regular_to_holiday(families_file: Excel, holiday_file: Excel, family_name):
    '''
    Moves the given family from families file to holiday file.
    '''
    error, family_data = move_family(families_file, family_name)
    if error is not None:
        return error

    result = add_family(holiday_file, family_data, to_excel_row)
    if result.status != 200:
        return Exception(
            "המשפחה הוסרה בהצלחה מהמשפחות הקבועות, אך קרתה שגיאה בהוספת המשפחה למשפחות החגים")

def permanent_remove_family(families_file: Excel, family_name):
    '''
    Removes the given family from families_file permanently.
    Returns error if family not found in given families_file.
    '''
    try:
        index = families_file.get_row_index(family_name)
    except Exception as e:
        return e
    families_file.remove_row(index)

def update_driver(families_file: Excel, family_name, driver_name):
    '''
    Updates the given family driver to driver_name.
    '''
    row_index = families_file.get_row_index(family_name)
    families_file.replace_cell(row_index, {
        "key": driver_prop,
        "value": driver_name
    })

def remove_driver(families_file: Excel, family_name):
    '''
    Removes driver name from given family.
    '''
    update_driver(families_file, family_name, "")

def remove_many_drivers(families_file: Excel, drivers):
    '''
    Removes all given drivers from families_file.
    '''
    if drivers is None or len(drivers) <= 0:
        return

    for family in search_families(families_file):
        if family.get(driver_prop, None) in drivers:
            remove_driver(families_file, family.get(key_prop))

def add_driver(families_file: Excel, family_name, driver_name):
    '''
    Adds driver to given family.
    '''
    if (result := validate_driver_name(driver_name)) is not None:
        return result

    update_driver(families_file, family_name, driver_name)
    return driver_update_results["DRIVER_UPDATED"]
