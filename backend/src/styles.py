from openpyxl.styles import Alignment, Border, Font, NamedStyle, Side
from dataclasses import dataclass

@dataclass
class RequiredStyle:
    name: str
    style: NamedStyle

style_name = 'שורת נתמך'

def get_cell_style(border_size):
    border_style = Side(style=border_size, color="000000")
    return NamedStyle(
        name=style_name,
        font=Font(name="Calibri", size=11),
        border=Border(top=border_style, bottom=border_style, left=border_style, right=border_style),
        alignment=Alignment(horizontal="center", vertical="center")
    )

families_cell_style = RequiredStyle(
    name=style_name,
    style=get_cell_style("medium")
)

report_cell_style = RequiredStyle(
    name=style_name,
    style=get_cell_style("thin")
)
