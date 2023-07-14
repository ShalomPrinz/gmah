from openpyxl import load_workbook
from os import path

from src.data import family_properties
from src.search import SearchRequest, search, search_column, FindRequest, find
from src.errors import FileResourcesMissingError, FamilyNotFoundError
from src.util import letter_by_index
from src.styles import RequiredStyle

last_excel_column = letter_by_index(len(family_properties))

class Excel:
    def __init__(self, filename: str, required_style: RequiredStyle, table_name: str = ""):
        if not path.exists(filename):
            raise FileNotFoundError(f'הקובץ {filename} לא נמצא')

        self.filename = filename
        self.workbook = load_workbook(filename)
        self.worksheet = self.workbook[self.workbook.sheetnames[0]]

        self.table_name = table_name
        self.cell_style = required_style.name
        self.last_column = last_excel_column
        self.first_content_row = 2 # First row is 1, and contains titles

        if self.cell_style not in self.workbook.named_styles:
            self.add_named_style(required_style.style)
        
        if self.table_name and self.table_name not in self.worksheet.tables:
            raise FileResourcesMissingError(f"על הקובץ {filename} להכיל טבלה בשם '{self.table_name}'")
    
    def save(self):
        self.workbook.save(self.filename)

    def get_rows_num(self):
        return self.worksheet.max_row

    def get_headers(self):
        return [cell.value for cell in next(self.worksheet.rows)]

    def get_rows_iter(self):
        return self.worksheet.iter_rows(min_row=self.first_content_row)

    def get_row_index(self, row_key, search_enum):
        request = FindRequest(
            rows_iter=self.get_rows_iter(),
            query=row_key,
            search_enum=search_enum
        )

        result = find(request)
        if result != -1:
            return result + self.first_content_row
        else:
            raise FamilyNotFoundError(f"המשפחה {row_key} לא נמצאת")
    
    def search(self, query, search_enum, search_by='', column_search=False):
        request = SearchRequest(
            rows_iter=self.get_rows_iter(),
            headers=self.get_headers(),
            query=query,
            search_by=search_by,
            search_enum=search_enum
        )

        if column_search:
            return search_column(request)
        else:
            return search(request)

    def append_rows(self, families, to_excel_row):
        for family in families:    
            new_row = self.get_rows_num() + 1
            self.worksheet.insert_rows(idx=new_row, amount=1)

            row_data = to_excel_row(family)
            for column, value in enumerate(row_data, 1):
                cell = self.worksheet.cell(row=new_row, column=column)
                cell.value = value
                cell.style = self.cell_style

            if self.table_name:
                self.worksheet.tables[self.table_name].ref = f'A1:{self.last_column}{new_row}'
            
        self.save()

    def replace_row(self, row_index, row_data, row_properties):
        for key, value in row_data.items():
            if key not in row_properties:
                continue

            col_index = row_properties.index(key) + 1
            cell = self.worksheet.cell(row=row_index, column=col_index)
            cell.value = value

        self.save()

    def add_named_style(self, named_style):
        self.workbook.add_named_style(named_style)
        self.save()
