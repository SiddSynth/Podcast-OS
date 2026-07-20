import requests
from bs4 import BeautifulSoup
from backend.app.tools.base import BaseScrapeTool

class WebScrapeTool(BaseScrapeTool):
    def scrape(self, url: str) -> str:
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
            }
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Remove script and style elements
                for script in soup(["script", "style", "meta", "noscript", "header", "footer"]):
                    script.extract()
                
                # Get text
                text = soup.get_text(separator=' ')
                
                # Break into lines and remove leading and trailing space on each
                lines = (line.strip() for line in text.splitlines())
                # Break multi-headlines into a line each
                chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                # Drop blank lines
                cleaned_text = '\n'.join(chunk for chunk in chunks if chunk)
                
                return cleaned_text[:15000]  # Limit context length
            else:
                return f"Failed to retrieve web page. Status code: {response.status_code}"
        except Exception as e:
            return f"Error scraping URL: {str(e)}"
