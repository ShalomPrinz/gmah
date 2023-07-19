from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm

from reportlab.platypus import SimpleDocTemplate, Table, PageTemplate
from reportlab.platypus import Paragraph
from reportlab.platypus.frames import Frame

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from bidi.algorithm import get_display

from src.styles import header_style, table_style, title_style

fonts_dir = "./src/fonts/"

def to_hebrew(text):
    if text is None or text == "":
        return ""
    return get_display(str(text))

def basad_header(canvas, doc):
    content = Paragraph(to_hebrew('בס"ד'), header_style)
    canvas.saveState()
    content.wrap(doc.width, doc.topMargin)
    content.drawOn(
        canvas,
        doc.width +
        doc.rightMargin -
        10,
        doc.height +
        doc.bottomMargin)
    canvas.restoreState()

class PDFBuilder():
    '''
    Builds a pdf with the given name.
    Access it with build_single().
    '''
    def __init__(self, filename):
        self.filename = filename

        pdfmetrics.registerFont(
            TTFont(
                'Hebrew',
                f'{fonts_dir}Rubik-Regular.ttf'))
        pdfmetrics.registerFont(
            TTFont(
                'Hebrew-Bold',
                f'{fonts_dir}Rubik-Bold.ttf'))

    def start_document(self):
        '''
        (Internal) First function to call when generating document.
        Returns a customizable pdf document.
        '''
        self.elements = []
        return SimpleDocTemplate(
            f"{self.filename}.pdf",
            pagesize=A4,
            leftMargin=2.2 * cm,
            rightMargin=2.2 * cm,
            topMargin=1.5 * cm,
            bottomMargin=2.5 * cm)

    def finish_document(self, doc):
        '''
        Finishes the build process and exports the pdf document.
        '''
        frame = Frame(
            doc.leftMargin,
            doc.bottomMargin,
            doc.width,
            doc.height,
            id='frame')
        template = PageTemplate(
            id='template',
            frames=frame,
            onPage=basad_header)

        doc.addPageTemplates([template])
        doc.build(self.elements)

    def build_single(self, title, headers, content):
        '''
        Builds a single-page pdf document with a title and a table.
        '''
        doc = self.start_document()

        self.append_title(title)
        self.append_table(headers, content)

        self.finish_document(doc)

    def append_title(self, title):
        '''
        Appends the given title to the pdf document.
        '''
        self.elements.append(Paragraph("", title_style))
        self.elements.append(Paragraph("", title_style))
        self.elements.append(Paragraph(to_hebrew(title), title_style))

    def append_table(self, headers, content):
        '''
        Appends the given table to the pdf document.
        '''
        table_headers = self.to_table_header_row(headers)
        table_content = self.to_table_content_rows(headers, content)
        table_data = [table_headers] + table_content

        table = Table(table_data)
        table.setStyle(table_style)

        self.elements.append(table)

    def to_table_header_row(self, headers):
        '''
        Transforms the given headers into the first row of the pdf table.
        '''
        table_headers = [to_hebrew(h) for h in headers]
        table_headers.reverse()
        return table_headers

    def to_table_content_rows(self, headers, content):
        '''
        Transforms the given content into all data rows of the pdf table.
        '''
        table_data = []
        for data_row in content:
            table_row = [to_hebrew(data_row.get(h)) for h in headers]
            table_row.reverse()
            table_data.append(table_row)
        return table_data
