from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseSearchTool(ABC):
    @abstractmethod
    def search(self, query: str, num_results: int = 5) -> List[Dict[str, Any]]:
        """Perform search query and return a list of result items with keys: title, link, snippet."""
        pass

class BaseScrapeTool(ABC):
    @abstractmethod
    def scrape(self, url: str) -> str:
        """Fetch URL content and return text content."""
        pass

class BaseDocumentReaderTool(ABC):
    @abstractmethod
    def read_pdf(self, file_path: str) -> str:
        """Extract text from a PDF file."""
        pass

    @abstractmethod
    def read_docx(self, file_path: str) -> str:
        """Extract text from a DOCX file."""
        pass

    @abstractmethod
    def read_csv(self, file_path: str) -> str:
        """Extract text from a CSV file."""
        pass
