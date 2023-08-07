from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm

from reportlab.platypus import SimpleDocTemplate, Table, Paragraph, PageTemplate, PageBreak, NextPageTemplate
from reportlab.platypus.frames import Frame

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from bidi.algorithm import get_display

from src.data import system_files_folder
from src.styles import header_style, table_style, title_style, title_page_style
from src.util import create_folders_path

fonts_dir = "./src/fonts/"
print_dir_name = f"{system_files_folder}/הדפסות"
print_dir = f"./{print_dir_name}"

def get_print_folder_path(folder):
    folder_path = f"{print_dir}/{folder}"
    create_folders_path(folder_path)
    return folder_path

def get_print_path(folder, name):
    folder_path = get_print_folder_path(folder)
    return f"{folder_path}/{name}"

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
    Builds a pdf with the given path.
    Access it with build_single() or build_multi().
    '''
    def __init__(self, folder, filename):
        self.filename = filename
        self.filepath = get_print_path(folder, filename)
        self.template_id = 'basad_template'

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
            f"{self.filepath}.pdf",
            pagesize=A4,
            leftMargin=2.2 * cm,
            rightMargin=2.2 * cm,
            topMargin=1.5 * cm,
            bottomMargin=2.5 * cm,
            title=self.filename,
            author='גמ"ח אבישי - ישיבת קרית שמונה')

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
            id=self.template_id,
            frames=frame,
            onPage=basad_header)

        doc.addPageTemplates([template])
        doc.build(self.elements)

    def append_title_page(self, title):
        '''
        Appends page with title only, to be used as a delimiter between
        differrent parts of the pdf document.
        '''
        self.append_title(title, title_page_style)

    def append_page(self, title, headers, content):
        '''
        Appends full page to the pdf document, including a title and a table.
        '''
        self.append_title(title)
        self.append_table(headers, content)

    def build_multi(self, pages, headers):
        '''
        Builds a multi-page pdf document. Each page dictionary in the pages list should have
        title and content, which would render to a single-pdf page in the document.

        Page could also be a title page without a content, to be used as a delimiter page
        between different parts in the document.
        '''
        doc = self.start_document()

        inserted_first = False
        for page in pages:
            if "content" not in page:
                if "title" in page:
                    if inserted_first:
                        self.append_page_break()
                    self.append_title_page(page["title"])
                    inserted_first = True
                continue

            self.append_page_break()
            self.append_page(page["title"], headers, page["content"])

        self.finish_document(doc)

    def build_single(self, title, headers, content):
        '''
        Builds a single-page pdf document with a title and a table.
        '''
        doc = self.start_document()

        self.append_page(title, headers, content)

        self.finish_document(doc)

    def append_page_break(self):
        '''
        Appends a Page Break to the pdf document, in order to start a new page.
        '''
        self.elements.append(NextPageTemplate(self.template_id))
        self.elements.append(PageBreak())

    def append_title(self, title, style=title_style):
        '''
        Appends the given title to the pdf document.
        '''
        self.elements.append(Paragraph("", style))
        self.elements.append(Paragraph("", style))
        self.elements.append(Paragraph(to_hebrew(title), style))

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
