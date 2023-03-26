from dotenv import load_dotenv
from os import getenv
from enum import Enum

from src.excel import Excel
from src.util import without_hyphen, insert_hyphen

load_dotenv()
FAMILIES_FILENAME = getenv('FAMILIES_FILENAME')

def to_excel_row(fullName=None, street=None, house=None,
    apartmentNumber=None, floor=None, homePhone=None, mobilePhone=None,
    originalDriver=None, referrer=None, notes=None):
    '''
    Cast family data to excel row format in the right order
    '''
    return [fullName, street, house, apartmentNumber, floor,
        homePhone, mobilePhone, originalDriver, referrer, notes]

def get_count():
    '''
    Returns the number of families, which should be the number of rows
    in the families file minus the headline row
    '''
    families_file = Excel(FAMILIES_FILENAME)
    return families_file.get_rows_num() - 1

def search_families(query='', search_by=''):
    '''
    Returns list of families who their value of the search_by cell
    matches the given query
    '''
    query = '' if query is None else query
    search_by = '' if search_by is None else search_by

    families_file = Excel(FAMILIES_FILENAME)
    return families_file.search(query, search_by)

class AddFamilyResult(Enum):
    FAMILY_ADDED = { 
        "status": 200 
    }
    MISSING_FULL_NAME = {
        "status": 400,
        "description": "לא ניתן להכניס משפחה ללא שם לרשימת הנתמכים"
    }
    FAMILY_EXISTS = {
        "status": 409,
        "description": "כבר קיימת משפחה עם השם הזה"
    }
    PHONE_NOT_DIGITS = {
        "status": 400,
        "description": "מספר הטלפון של המשפחה יכול להכיל ספרות בלבד"
    }
    PHONE_WRONG_LEN = {
        "status": 400,
        "description": "מספר הטלפון של המשפחה צריך להיות באורך של 9 או 10 ספרות"
    }

    @property
    def status(self):
        return self.value["status"]

    @property
    def description(self):
        return self.value["description"]

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
        return AddFamilyResult.PHONE_NOT_DIGITS.name
    
    if len(phone) == 9:
        phone = insert_hyphen(phone, 2)
    elif len(phone) == 10:
        phone = insert_hyphen(phone, 3)
    else:
        return AddFamilyResult.PHONE_WRONG_LEN.name
    
    return phone

def add_family(family):
    '''
    Adds the given family to the families file.
    family should be a dictionary with family properties, fullName property required
    '''
    if not "fullName" in family:
        return AddFamilyResult.MISSING_FULL_NAME

    families_file = Excel(FAMILIES_FILENAME)

    # Don't allow duplicate families name
    search_result = families_file.search(family["fullName"], 'name')
    if len(search_result) > 0:
        if any(found_family["fullName"] == family["fullName"] for found_family in search_result):
            return AddFamilyResult.FAMILY_EXISTS
    
    # Validate and format phone numbers
    for phone_type in ["homePhone", "mobilePhone"]:
        result = format_phone(family, phone_type)
        if result is None:
            continue
        elif result in [AddFamilyResult.PHONE_WRONG_LEN.name, AddFamilyResult.PHONE_NOT_DIGITS.name]:
            return AddFamilyResult[result]
        else:
            family[phone_type] = result

    excel_row = to_excel_row(**family)
    families_file.append_row(excel_row)
    return AddFamilyResult.FAMILY_ADDED
