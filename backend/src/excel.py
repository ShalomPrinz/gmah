import openpyxl
from os import path

from src.data import family_properties
from src.search import SearchRequest, search, FindRequest, find
from src.errors import FileResourcesMissingError, FamilyNotFoundError
from src.util import letter_by_index

last_excel_column = letter_by_index(len(family_properties))

class Excel:
    def __init__(self, filename):
        if not path.exists(filename):
            raise FileNotFoundError(f'הקובץ {filename} לא נמצא')

        self.filename = filename
        self.workbook = openpyxl.load_workbook(filename)
        self.worksheet = self.workbook[self.workbook.sheetnames[0]]

        self.table_name = 'נתמכים'
        self.cell_style = 'שורת נתמך'
        self.last_column = last_excel_column
        self.first_content_row = 2

        if len(self.workbook.named_styles) < 2 or \
            self.cell_style not in self.workbook.named_styles:
            raise FileResourcesMissingError(f"חסר עיצוב תא בשם '{self.cell_style}' בקובץ {filename}")

        if len(self.worksheet.tables) < 1 or \
            self.table_name not in self.worksheet.tables:
            raise FileResourcesMissingError(f"על הקובץ {filename} להכיל טבלה בשם '{self.table_name}'")
    
    def save(self):
        self.workbook.save(self.filename)

    def get_rows_num(self):
        return self.worksheet.max_row

    def get_headers(self):
        return [cell.value for cell in next(self.worksheet.rows)]

    def get_rows_iter(self):
        return self.worksheet.iter_rows(min_row=self.first_content_row)

    def get_row_index(self, row_key):
        request = FindRequest(
            rows_iter=self.get_rows_iter(),
            query=row_key
        )

        result = find(request)
        if result != -1:
            return result + self.first_content_row
        else:
            raise FamilyNotFoundError(f"המשפחה {row_key} לא נמצאת")
    
    def search(self, query, search_by=''):
        request = SearchRequest(
            rows_iter=self.get_rows_iter(),
            headers=self.get_headers(),
            query=query,
            search_by=search_by
        )

        return search(request)

    def append_row(self, row_data):
        new_row = self.get_rows_num() + 1
        self.worksheet.insert_rows(idx=new_row, amount=1)

        for column, value in enumerate(row_data, 1):
            cell = self.worksheet.cell(row=new_row, column=column)
            cell.value = value
            cell.style = self.cell_style

        self.worksheet.tables[self.table_name].ref = f'A1:{self.last_column}{new_row}'
        self.save()

    def replace_row(self, row_index, row_data):
        for key, value in row_data.items():
            if key not in family_properties:
                continue

            col_index = family_properties.index(key) + 1
            cell = self.worksheet.cell(row=row_index, column=col_index)
            cell.value = value

        self.save()
