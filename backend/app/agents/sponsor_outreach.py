import json
from typing import Dict, Any
from backend.app.agents.base import BaseAgent
from backend.app.tools.scraper import WebScrapeTool

class SponsorOutreachAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.scraper = WebScrapeTool()

    def run(self, brand_name: str, brand_website: str = None, campaign_goal: str = None, target_guest: str = None) -> Dict[str, Any]:
        scraped_content = ""
        if brand_website:
            scraped_content = self.scraper.scrape(brand_website)
            
        if self.is_mock:
            return self._generate_mock_outreach(brand_name, campaign_goal)
            
        try:
            system_instruction = (
                "You are an expert sales representative and sponsor coordinator for top-tier business podcasts. "
                "Your goal is to write custom outreach briefs for brand partnerships. Respond ONLY with a valid JSON object matching the requested schema."
            )
            prompt = f"""
            Generate a personalized sponsorship proposal brief for the brand: "{brand_name}" (Website content snippet: "{scraped_content[:4000]}").
            Campaign Goal: "{campaign_goal or 'Brand Awareness'}"
            Target Guest/Episode Context: "{target_guest or 'Nikhil Kamath'}"
            
            Return a JSON object with this exact structure:
            - "brand_analysis": (string) Brief summary of the brand's products, target audience, and current positioning.
            - "audience_fit": (string) Explaining how the podcast's business/tech audience overlaps with the brand's customer profile.
            - "cold_email": (string) A highly-personalized cold email to the brand's VP of Marketing.
            - "linkedin_message": (string) A short, high-impact LinkedIn InMail outreach message.
            - "follow_up_email": (string) Follow-up email structure sent 4 days later.
            - "proposal": (string) Key partnership package details (e.g. pre-rolls, mid-rolls, social integrations).
            - "roi_pitch": (string) Mathematical or strategic pitch proving why sponsoring this episode guarantees positive return on ad spend (ROAS).
            - "meeting_agenda": (list of strings) Agenda items for a 15-minute alignment call.
            
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
            print(f"Error creating outreach: {e}. Falling back to mock outreach.")
            return self._generate_mock_outreach(brand_name, campaign_goal)

    def _generate_mock_outreach(self, brand_name: str, campaign_goal: str = None) -> Dict[str, Any]:
        goal = campaign_goal or "Brand Awareness & Lead Generation"
        return {
            "brand_analysis": f"{brand_name} is a high-growth consumer technology and finance platform focusing on premium demographics. They are looking to capture market share among young professionals and builders.",
            "audience_fit": f"The Podcast audience consists of 65% entrepreneurs, developers, and investors aged 18-35. Sponsoring this episode provides direct, uncluttered distribution into {brand_name}'s core target customer segment.",
            "cold_email": f"Subject: Partnering with PodcastOS: Reaching 1M+ Tech Founders\n\nHi VP of Marketing,\n\nI've been following {brand_name}'s recent push into digital assets. Your product is solving a real friction point for retail investors.\n\nWe have an upcoming episode featuring a prominent startup founder that aligns directly with {brand_name}'s target audience. We reach over 1,000,000 active builders per episode.\n\nWould you be open to exploring a custom mid-roll integration for this episode?\n\nBest,\nSponsor Partnerships, PodcastOS",
            "linkedin_message": f"Hi marketing team, love the new campaigns. We are hosting a major finance leader on PodcastOS next week. We have a custom segment that fits {brand_name}'s target audience perfectly. Worth a quick chat to discuss integration?",
            "follow_up_email": "Subject: Episode Schedule / Partnership slots locking up\n\nHi VP of Marketing,\n\nJust following up on my previous note. We are locking in the sponsorship slots for our upcoming episodes this week.\n\nLet me know if you would like to secure the mid-roll slot for this upcoming episode.\n\nBest,\nPartnerships, PodcastOS",
            "proposal": "• 1x Custom 60-second Mid-roll Read by the host\n• 1x Instagram Reel co-authored post\n• Logo branding in the YouTube thumbnail and description\n• Permanent link back in the show notes",
            "roi_pitch": f"With an average cost per mil (CPM) of $25, and a projected reach of 1,000,000 views, sponsoring this episode is estimated to drive over 10,000 direct site clicks, representing a highly efficient customer acquisition cost (CAC) compared to standard paid ad channels.",
            "meeting_agenda": [
                "1. Brief introduction to our audience demographics.",
                "2. Specific custom script angles for the host read.",
                "3. Discussion of pricing, timeline, and tracking metrics."
            ]
        }
