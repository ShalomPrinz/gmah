import openpyxl
from os import path

from src.util import format_family_header

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

    def search_in_first_column(self, query):
        matching_rows = []
        headers = self.get_headers()
        for row in self.worksheet.iter_rows(min_row=2):
            if query in row[0].value:
                matching_row = {headers[index]: cell.value for index, cell in enumerate(row)}
                matching_rows.append(matching_row)
        return matching_rows

