import csv
import docx2txt
from pypdf import PdfReader
from backend.app.tools.base import BaseDocumentReaderTool

class DocumentReaderTool(BaseDocumentReaderTool):
    def read_pdf(self, file_path: str) -> str:
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text
        except Exception as e:
            return f"Error reading PDF: {str(e)}"

    def read_docx(self, file_path: str) -> str:
        try:
            return docx2txt.process(file_path)
        except Exception as e:
            return f"Error reading DOCX: {str(e)}"

    def read_csv(self, file_path: str) -> str:
        try:
            rows = []
            with open(file_path, mode='r', encoding='utf-8') as f:
                reader = csv.reader(f)
                for row in reader:
                    rows.append(", ".join(row))
            return "\n".join(rows)
        except Exception as e:
            return f"Error reading CSV: {str(e)}"
