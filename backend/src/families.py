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