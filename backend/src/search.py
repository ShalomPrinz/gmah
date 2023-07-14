from openpyxl.worksheet.worksheet import Worksheet
from dataclasses import dataclass
from typing import List, Generator
from enum import Enum

from src.data import search_column_prop
from src.util import without_hyphen

@dataclass
class SearchRequest:
    rows_iter: Generator[Worksheet, None, None]
    headers: List[str]
    query: str
    search_by: str
    search_enum: Enum

@dataclass
class FindRequest:
    rows_iter: Generator[Worksheet, None, None]
    query: str
    search_enum: Enum

def search(request: SearchRequest):
    searching_by_phone = bool('PHONE' in request.search_enum.__members__ and \
                         request.search_by == request.search_enum.PHONE.value)
    if searching_by_phone:
        request.query = without_hyphen(request.query)

    search_columns = request.search_enum.get_search_columns(request.search_by)

    matching_rows = []
    for row in request.rows_iter:
        for column in search_columns:
            cell_value = row[column].value
            if cell_value is None:
                continue # Don't insert no value cell into search result
            if searching_by_phone:
                cell_value = without_hyphen(cell_value)
            if request.query in cell_value:
                matching_row = {
                    request.headers[index]: cell.value for index, cell in enumerate(row)}
                matching_rows.append(matching_row)
                break # Row added to matching_rows, skip to next row
    return matching_rows

def search_column(request: SearchRequest):
    search_columns = request.search_enum.get_search_columns(request.search_by)

    matching_rows = []
    for row in request.rows_iter:
        for column in search_columns:
            cell_value = row[column].value
            if cell_value is None:
                continue # Don't insert no value cell into search result
            if request.query in cell_value:
                matching_rows.append({ search_column_prop: cell_value })
                break # Row added to matching_rows, skip to next row
    return matching_rows

def find(request: FindRequest):
    '''
    Returns the index of query in rows_iter, first item match will return 1.

    If query is not found in rows_iter, returns -1.
    '''
    search_columns = request.search_enum.get_search_columns('name')

    for index, row in enumerate(request.rows_iter):
        for column in search_columns:
            if row[column].value == request.query:
                return index

    return -1
