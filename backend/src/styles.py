from openpyxl.styles import Alignment, Border, Font, NamedStyle, Side, PatternFill

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
            vertical="center") )

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
