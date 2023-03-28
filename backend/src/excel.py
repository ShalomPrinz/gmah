import openpyxl
from os import path

from src.search import SearchRequest, search
from src.errors import FileResourcesMissingError

class Excel:
    def __init__(self, filename):
        if not path.exists(filename):
            raise FileNotFoundError(f'הקובץ {filename} לא נמצא')

        self.filename = filename
        self.workbook = openpyxl.load_workbook(filename)
        self.worksheet = self.workbook[self.workbook.sheetnames[0]]

        self.table_name = 'נתמכים'
        self.cell_style = 'שורת נתמך'
        self.last_column = 'J' # = 10 Columns

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
    
    def search(self, query, search_by=''):
        request = SearchRequest(
            rows_iter=self.worksheet.iter_rows(min_row=2),
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
