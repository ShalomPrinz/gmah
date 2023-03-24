from dotenv import load_dotenv
from os import getenv
from enum import Enum

from src.excel import Excel

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
    FAMILY_ADDED = 200
    MISSING_FULL_NAME = 400
    FAMILY_EXISTS = 409

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
    
    excel_row = to_excel_row(**family)
    families_file.append_row(excel_row)
    return AddFamilyResult.FAMILY_ADDED
