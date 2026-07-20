import json
from typing import Dict, Any
from backend.app.agents.base import BaseAgent

class ShortsFinderAgent(BaseAgent):
    def run(self, transcript_text: str = None, youtube_url: str = None) -> Dict[str, Any]:
        if not transcript_text and not youtube_url:
            return {"error": "Provide either transcript text or YouTube URL"}
            
        if self.is_mock:
            return self._generate_mock_shorts()

        try:
            # Prepare transcript snippet
            snippet = transcript_text[:12000] if transcript_text else f"Fetch from URL: {youtube_url}"
            
            system_instruction = (
                "You are a professional video editor and viral growth strategist for vertical media (TikTok, Shorts, Reels). "
                "You must analyze the podcast transcript and extract viral moments. Respond ONLY with a valid JSON object matching the requested schema."
            )
            
            prompt = f"""
            Analyze this podcast transcript/reference:
            {snippet}
            
            Identify the top 3 most viral, high-retention moments. Return a JSON object with this exact structure:
            - "clips": (list of dicts) Each clip must contain:
              - "title": (string) Catchy title of the clip.
              - "timestamp_start": (string) e.g., "00:04:12"
              - "timestamp_end": (string) e.g., "00:05:00"
              - "duration": (string) e.g., "48s"
              - "type": (string) e.g., "Curiosity Hook / Value Bomb / Emotional Story / Conflict"
              - "predicted_viral_score": (int) 1 to 100
              - "retention_score": (int) 1 to 100
              - "hook": (string) The exact starting hook sentence.
              - "explanation": (string) Why this clip will perform well.
              - "titles": (list of strings) 3 alternative clickbait titles.
              - "captions": (string) Styled captions for vertical format.
              - "thumbnail_text": (string) Short text to overlay on the thumbnail (3-5 words).
              - "hashtags": (list of strings) Relevent tags.
              - "instagram_caption": (string) Instagram format caption.
              - "linkedin_caption": (string) LinkedIn format post.
              - "twitter_post": (string) A hook-based tweet.
              - "youtube_chapters": (string) Recommended YouTube chapter name.
            
            Respond only with raw JSON.
            """
            
            response_text = self.call_llm(prompt, system_instruction=system_instruction)
            cleaned_text = response_text.strip()
            if cleaned_text.startswith("```"):
                lines = cleaned_text.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].startswith("```"):
                    lines = lines[:-1]
                cleaned_text = "\n".join(lines).strip()
                
            return json.loads(cleaned_text)
            
        except Exception as e:
            print(f"Error finding shorts: {e}. Falling back to mock results.")
            return self._generate_mock_shorts()

    def _generate_mock_shorts(self) -> Dict[str, Any]:
        return {
            "clips": [
                {
                    "title": "The Brutal Truth About Why Startups Fail in India",
                    "timestamp_start": "00:10:15",
                    "timestamp_end": "00:11:10",
                    "duration": "55s",
                    "type": "Value Bomb",
                    "predicted_viral_score": 94,
                    "retention_score": 88,
                    "hook": "If you are starting a business in India, and your focus is only on software, you're going to fail.",
                    "explanation": "High contrarian hook that challenges common tech narratives, forcing immediate viewer alignment or disagreement.",
                    "titles": [
                        "Why 99% of Tech Startups Fail",
                        "The Software Trap in India",
                        "Stop Building Software in India!"
                    ],
                    "captions": "IF YOU ARE STARTING A BUSINESS IN INDIA... 🇮🇳\nAND YOUR ONLY FOCUS IS SOFTWARE... 💻\nYOU'RE GOING TO FAIL! 📉\nHere's why retail distribution is king.",
                    "thumbnail_text": "SOFTWARE IS DEAD IN INDIA?",
                    "hashtags": ["#startups", "#entrepreneurship", "#businessgrowth", "#wealthcreation"],
                    "instagram_caption": "🚨 Why software alone won't save your startup in India. Retail distribution and physical trust networks still rule the market. Here is the blueprint. 👇 #BusinessTips #StartupsIndia #Finance",
                    "linkedin_caption": "Most founders think building a startup is about coding. In India, it's actually about distribution. In our latest episode, we broke down why bootstrapped companies win by building robust customer support over expensive marketing campaigns. What's your take?",
                    "twitter_post": "Building a startup in India? 🇮🇳\n\nIf you think coding software is enough, you're set to fail.\n\nHere is why distribution and trust networks are the real secret sauce: 🧵👇",
                    "youtube_chapters": "10:15 - The Software Distribution Trap"
                },
                {
                    "title": "Why Renting is the Best Business Decision I Ever Made",
                    "timestamp_start": "00:18:40",
                    "timestamp_end": "00:19:35",
                    "duration": "55s",
                    "type": "Curiosity Hook",
                    "predicted_viral_score": 89,
                    "retention_score": 92,
                    "hook": "I became a billionaire and the first thing I did was sign another rental lease.",
                    "explanation": "Leverages the curiosity of billionaire spending habits, disputing the traditional middle-class dream of buying real estate.",
                    "titles": [
                        "Why I Rent as a Billionaire",
                        "Real Estate is a Trap!",
                        "Billionaire Explains the Renting Secret"
                    ],
                    "captions": "I BECAME A BILLIONAIRE... 💰\nAND THE FIRST THING I DID... ⚡\nWAS SIGN A RENT LEASE! 🏢\nBuying real estate is a leverage trap.",
                    "thumbnail_text": "I OWN NOTHING?",
                    "hashtags": ["#personalfinance", "#rentingvsbuying", "#wealthbuilding", "#financialfreedom"],
                    "instagram_caption": "🏢 Buying a home vs Renting? A self-made billionaire breaks down why capital flexibility is far superior to illiquid real estate. Watch the full debate. #RealEstate #Investing #PersonalFinance",
                    "linkedin_caption": "Is homeownership a bad investment? \n\nMany see real estate as the ultimate safe asset. But locking up significant capital early can kill business growth. Capital flexibility is key. Here is why renting is a strategic choice for high-growth founders.",
                    "twitter_post": "I'm a self-made billionaire and I still rent my house.\n\nHere is why buying real estate is a massive wealth trap for young entrepreneurs: 👇",
                    "youtube_chapters": "18:40 - The Rent vs Buy Debate"
                }
            ]
        }
