from openpyxl.worksheet.worksheet import Worksheet
from dataclasses import dataclass
from typing import Any, Dict, List, Generator
from enum import Enum

from src.util import without_hyphen

@dataclass
class BaseRequest:
    '''
    Provides properties for all search requests, for internal module use only.
    '''
    rows_iter: Generator[Worksheet, None, None]
    query: str
    search_enum: Enum

@dataclass
class FindRequest(BaseRequest):
    pass

@dataclass
class ColumnSearchRequest(BaseRequest):
    search_by: str

@dataclass
class SearchRequest(BaseRequest):
    headers: List[str]
    search_by: str
    empty_search: bool = False
    exact: bool = False

@dataclass
class StyleSearchRequest(BaseRequest):
    headers: List[str]
    search_by: str
    search_style: str
    style_map: Dict[str, Any]
    exact: bool = False

def is_match(request, value):
    return request.query == value if request.exact else request.query in value

def search(request: SearchRequest):
    searching_by_phone = bool('PHONE' in request.search_enum.__members__ and
                              request.search_by == request.search_enum.PHONE.value)
    if searching_by_phone:
        request.query = without_hyphen(request.query)

    search_columns = request.search_enum.get_search_columns(request.search_by)

    matching_rows = []
    def append_matching_row(row):
        matching_rows.append({
            request.headers[index]: cell.value for index, cell in enumerate(row) if index < len(request.headers)
        })

    for row in request.rows_iter:
        for column in search_columns:
            cell_value = row[column].value
            if request.empty_search:
                if not cell_value:
                    append_matching_row(row)
                continue

            if cell_value is None:
                continue # Don't insert no value cell into search result
            if searching_by_phone:
                cell_value = without_hyphen(cell_value)
            if is_match(request, cell_value):
                append_matching_row(row)
                break # Row added to matching_rows, skip to next row
    return matching_rows

def style_search(request: StyleSearchRequest):
    search_columns = request.search_enum.get_search_columns(request.search_by)
    style_columns = request.search_enum.get_search_columns(
        request.search_style)

    matching_rows = []
    for row in request.rows_iter:
        for column in search_columns:
            cell_value = row[column].value
            if cell_value is None:
                continue # Don't insert no value cell into search result
            if is_match(request, cell_value):
                matching_row = {}
                for index, cell in enumerate(row):
                    key = request.headers[index]
                    if index in style_columns:
                        style_value = request.style_map.get(cell.style, None)
                        matching_row |= { key: style_value }
                    else:
                        matching_row |= { key: cell.value }
                matching_rows.append(matching_row)
                break # Row added to matching_rows, skip to next row
    return matching_rows

def search_column(request: ColumnSearchRequest):
    search_columns = request.search_enum.get_search_columns(request.search_by)

    matching_rows = []
    for row in request.rows_iter:
        for column in search_columns:
            cell_value = row[column].value
            if cell_value is None:
                continue # Don't insert no value cell into search result
            if request.query in cell_value:
                matching_rows.append(cell_value)
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
