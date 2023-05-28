from src.data import key_prop, family_properties, families_filename
from src.excel import Excel
from src.util import without_hyphen, insert_hyphen
from src.results import Result, add_results, add_many_error, add_many_results

def open_families_file():
    '''
    Tries to connect to the application source file.

    Returns a tuple: (error, file)
        - If connection has failed, file will be None
        - If connection has succeed, error will be None
    '''
    try:
        families_file = Excel(families_filename)
        return (None, families_file)
    except Exception as e:
        return (e, None)

def to_excel_row(family):
    '''
    Cast family data to excel row format in the right order
    '''
    return [family.get(attr, None) for attr in family_properties]

def get_count(families_file: Excel):
    '''
    Returns the number of families, which should be the number of rows
    in the families file minus the headline row
    '''
    return families_file.get_rows_num() - 1

def search_families(families_file: Excel, query='', search_by=''):
    '''
    Returns list of families who their value of the search_by cell
    matches the given query
    '''
    query = '' if query is None else query
    search_by = '' if search_by is None else search_by

    return families_file.search(query, search_by)

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
    search_result = families_file.search(family_name, 'name')
    if len(search_result) > 0 and \
        any(found_family[key_prop] == family_name for found_family in search_result):
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

def add_family(families_file: Excel, family):
    '''
    Adds the given family to the families file. family should be a dictionary
    with custom family properties, key_prop property required
    '''
    if not key_prop in family:
        return add_results["MISSING_FULL_NAME"]

    if is_family_exists(families_file, family[key_prop]):
        return add_results["FAMILY_EXISTS"]

    if validation_error := validate_phones(family):
        return validation_error

    excel_row = to_excel_row(family)
    families_file.append_row(excel_row)
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
