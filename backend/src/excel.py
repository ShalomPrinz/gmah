import openpyxl
from os import path

from src.search import SearchRequest, search
from src.util import format_family_header

class Excel:
    def __init__(self, filename):
        if not path.exists(filename):
            raise Exception(f'No such file {filename}')

        self.filename = filename
        self.workbook = openpyxl.load_workbook(filename)
        self.worksheet = self.workbook[self.workbook.sheetnames[0]]
    
    def save(self):
        self.workbook.save(self.filename)

    def get_rows_num(self):
        return self.worksheet.max_row

    def get_headers(self):
        return [format_family_header(cell.value) for cell in next(self.worksheet.rows)]
    
    def search(self, query, search_by=''):
        request = SearchRequest(
            rows_iter=self.worksheet.iter_rows(min_row=2),
            headers=self.get_headers(),
            query=query,
            search_by=search_by
        )

        return search(request)

    def append_row(self, row_data):
        self.worksheet.append(row_data)
        self.save()
