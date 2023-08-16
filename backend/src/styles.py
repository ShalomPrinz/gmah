from dataclasses import dataclass
from openpyxl.styles import Alignment, Border, Font, NamedStyle, Side, PatternFill

# Excel Styles

style_name = 'שורת נתמך'

def get_cell_style(border_size):
    border_style = Side(style=border_size, color="000000")
    return NamedStyle(
        name=style_name,
        font=Font(
            name="Calibri",
            size=11),
        border=Border(
            top=border_style,
            bottom=border_style,
            left=border_style,
            right=border_style),
        alignment=Alignment(
            horizontal="center",
            vertical="center",
            readingOrder=2 # RTL
        ))

families_border_size = "medium"
families_cell_style = get_cell_style(families_border_size)

report_border_size = "thin"
report_cell_style = get_cell_style(report_border_size)

def get_received_style(name, bg_color):
    border_style = Side(style=report_border_size, color="000000")
    return NamedStyle(
        name=name,
        fill=PatternFill(
            start_color=bg_color,
            end_color=bg_color,
            fill_type="solid"),
        font=Font(
            name="Calibri",
            size=11),
        border=Border(
            top=border_style,
            bottom=border_style,
            left=border_style,
            right=border_style),
        alignment=Alignment(
            horizontal="center",
            vertical="center") )

report_received_name = "נתמך קיבל/ה"
received_bg_color = "6BCF6B"
report_received_style = get_received_style(
    report_received_name, received_bg_color)

report_not_received_name = "נתמך לא קיבל/ה"
not_received_bg_color = "E0503D"
report_not_received_style = get_received_style(
    report_not_received_name, not_received_bg_color)

from reportlab.lib.colors import gray, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import TableStyle

# PDF Styles

table_style = TableStyle([
    # All table
    ('ALIGN',           (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN',          (0, 0), (-1, -1), 'MIDDLE'),
    ('FONTNAME',        (0, 0), (-1, -1), 'Hebrew'),
    ('GRID',            (0, 0), (-1, -1), .5, gray),
    ('BACKGROUND',      (0, 0), (-1, -1), white),
    ('FONTSIZE',        (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING',   (0, 0), (-1, -1), 8),
    ('TOPPADDING',      (0, 0), (-1, -1), 8),
    ('RIGHTPADDING',    (0, 0), (-1, -1), 8),
    ('LEFTPADDING',     (0, 0), (-1, -1), 8),

    # Header
    ('FONTNAME',        (0, 0), (-1, 0), 'Hebrew-Bold'),
    ('FONTSIZE',        (0, 0), (-1, 0), 12),
    ('BOTTOMPADDING',   (0, 0), (-1, 0), 12),
])

title_style = ParagraphStyle(name='TitleStyle',
    fontName="Hebrew",
    fontSize=26,
    leading=50,
    spaceBefore=15,
    spaceAfter=15,
    alias='h1',
    alignment=1
)

title_page_style = ParagraphStyle(name='TitlePageStyle',
    fontName="Hebrew-Bold",
    fontSize=60,
    leading=60,
    spaceBefore=15,
    spaceAfter=15,
    alias='h1',
    alignment=1
)

note_header_style = ParagraphStyle(name='NoteHeaderStyle',
    fontName="Hebrew",
    fontSize=16,
    alignment=2)

note_title_style = ParagraphStyle(name='NoteTitleStyle',
    fontName="Hebrew-Bold",
    fontSize=12,
    spaceAfter=6,
    alignment=2)

note_content_style = ParagraphStyle(name='NoteContentStyle',
    fontName="Hebrew",
    fontSize=12,
    spaceAfter=15,
    alignment=2)

header_style = ParagraphStyle(name='HeaderStyle', fontName="Hebrew")

@dataclass
class Styles:
    table_style = table_style
    title_style = title_style
    title_page_style = title_page_style
    note_header_style = note_header_style
    note_title_style = note_title_style
    note_content_style = note_content_style
    header_style = header_style
