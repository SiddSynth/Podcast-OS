import os
import google.generativeai as genai
from backend.app.config import settings

class BaseAgent:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
        self.is_mock = not bool(self.api_key)
        
        if not self.is_mock:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-1.5-flash') # stable default
            except Exception as e:
                print(f"Failed to configure Gemini: {e}. Defaulting to Mock mode.")
                self.is_mock = True

    def call_llm(self, prompt: str, system_instruction: str = None) -> str:
        if self.is_mock:
            raise NotImplementedError("This method should be overridden to return simulated mock data when in mock mode.")
        
        try:
            model_to_use = self.model
            if system_instruction:
                model_to_use = genai.GenerativeModel(
                    'gemini-1.5-flash',
                    system_instruction=system_instruction
                )
            response = model_to_use.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini API Error: {e}. Falling back to mock generator.")
            raise e
