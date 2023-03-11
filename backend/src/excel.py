import openpyxl
from os import path

class Excel:
    def __init__(self, filename):
        if not path.exists(filename):
            raise Exception(f'No such file {filename}')
        workbook = openpyxl.load_workbook(filename)
        self.worksheet = workbook[workbook.sheetnames[0]]
    
    def get_rows_num(self):
        return self.worksheet.max_row
