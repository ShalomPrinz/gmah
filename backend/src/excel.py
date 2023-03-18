import openpyxl
from openpyxl.worksheet.worksheet import Worksheet
from os import path
from dataclasses import dataclass
from typing import List, Generator
from enum import Enum

from src.util import format_family_header

@dataclass
class SearchRequest:
    rows_iter: Generator[Worksheet, None, None]
    headers: List[str]
    query: str
    column_search: List[int]

class SearchBy(Enum):
    NAME = 'name'
    STREET = 'street'
    PHONE = 'phone'

    @classmethod
    def get_search_columns(cls, search_by):
        search_by = getattr(SearchBy, search_by.upper(), SearchBy.NAME)
        match search_by:
            case SearchBy.NAME:
                return [0]
            case SearchBy.STREET:
                return [1]
            case SearchBy.PHONE:
                return [5, 6]
            case _:
                return [0]

def search(request: SearchRequest):
    matching_rows = []
    for row in request.rows_iter:
        for column in request.column_search:
            cell_value = row[column].value
            if cell_value is None:
                continue # Don't insert no value cell into search result
            if request.query in cell_value:
                matching_row = {
                    request.headers[index]: cell.value for index, cell in enumerate(row)}
                matching_rows.append(matching_row)
                break # Row added to matching_rows, skip to next row
    return matching_rows

class Excel:
    def __init__(self, filename):
        if not path.exists(filename):
            raise Exception(f'No such file {filename}')
        workbook = openpyxl.load_workbook(filename)
        self.worksheet = workbook[workbook.sheetnames[0]]
    
    def get_rows_num(self):
        return self.worksheet.max_row

    def get_headers(self):
        return [format_family_header(cell.value) for cell in next(self.worksheet.rows)]
    
    def search(self, query, search_by=''):
        request = SearchRequest(
            rows_iter=self.worksheet.iter_rows(min_row=2),
            headers=self.get_headers(),
            query=query,
            column_search=SearchBy.get_search_columns(search_by)
        )

        return search(request)
