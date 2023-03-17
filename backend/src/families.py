from dotenv import load_dotenv
from os import getenv

from src.excel import Excel

load_dotenv()
FAMILIES_FILENAME = getenv('FAMILIES_FILENAME')

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
