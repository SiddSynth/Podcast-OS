import json
from typing import Dict, Any
from backend.app.agents.base import BaseAgent

class ContentRepurposerAgent(BaseAgent):
    def run(self, transcript_text: str, tone: str, cta: str = None) -> Dict[str, Any]:
        if self.is_mock:
            return self._generate_mock_content(tone)
            
        try:
            system_instruction = (
                "You are an expert social media manager and content repurposer. "
                "Your job is to read transcript snippets and rewrite them into high-performing social posts. "
                "Respond ONLY with a valid JSON object matching the requested schema."
            )
            prompt = f"""
            Repurpose the following podcast transcript:
            "{transcript_text[:10000]}"
            
            Tone/Style Selection: "{tone}"
            CTA: "{cta or 'Follow for more business insights'}"
            
            Generate a JSON object with the exact keys:
            - "linkedin_post": (string) A detailed, structured LinkedIn post with hooks, space gaps, and CTA.
            - "linkedin_carousel": (list of dicts with keys "slide_number", "title", "content") Slides for a PDF carousel.
            - "twitter_thread": (list of strings) 3-5 tweets in a thread format.
            - "instagram_caption": (string) Styled caption with emojis.
            - "newsletter": (string) Short-form email newsletter (subject line + body).
            - "blog_post": (string) A 500-word educational blog post.
            - "hooks": (list of strings) 3 high-converting hook options.
            - "no_emoji_version": (string) Plain text version of the LinkedIn post without emojis.
            
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
            print(f"Error repurposing content: {e}. Falling back to mock data.")
            return self._generate_mock_content(tone)

    def _generate_mock_content(self, tone: str) -> Dict[str, Any]:
        return {
            "linkedin_post": f"🚀 [Hook in style of {tone}]: Most founders spend 90% of their time building, and only 10% selling.\n\nThis is a recipe for startup bankruptcy.\n\nHere is what we learned from bootstrapping Zerodha:\n\n1. Stop building in a vacuum. Talk to 10 customers on Day 1.\n2. Customer support is your marketing. A happy user is worth $1000 in ads.\n3. Keep your burn low. Profitability gives you leverage.\n\nAgree or disagree?\n\n👇 Let me know in the comments.",
            "linkedin_carousel": [
                {"slide_number": 1, "title": "The Bootstrapping Blueprint", "content": "How we built a $2B company without raising a single dollar of venture capital. 🧵"},
                {"slide_number": 2, "title": "1. Customer-Led Growth", "content": "Don't build features you think are cool. Build what clients are actively complaining about."},
                {"slide_number": 3, "title": "2. Organic Distribution", "content": "Ad spend is a drug. When you stop paying, growth stops. Focus on organic referral engines instead."},
                {"slide_number": 4, "title": "3. The Lean Team Advantage", "content": "A team of 5 A-players will always outpace a team of 50 generalists. Hire slow, compensate high."}
            ],
            "twitter_thread": [
                f"We bootstrapped a startup to a $2 Billion valuation. No VC. No paid marketing.\n\nHere are 3 rules we followed that go against everything you learn in business school: 👇 (Style: {tone})",
                "1/ Customer support is the best marketing channel.\n\nIn the first 3 years, we didn't spend on ads. We just spent hours resolving tickets and talking to traders.\n\nWord-of-mouth is a compounding loop.",
                "2/ Avoid raising VC too early.\n\nRaising money forces you to focus on vanity metrics. Bootstrapping forces you to focus on unit economics and cash flow. Leverage is built on profits.",
                "3/ Keep the team micro-sized.\n\nCommunication overhead increases exponentially with team size. We kept our core engineering team under 30 people. Smaller groups build faster."
            ],
            "instagram_caption": f"💡 Scale your startup the right way. Stop burning cash and start focusing on what matters: the customer. 🚀 Here are our top 3 bootstrapping secrets. Save this post for later! 💾 #startups #business #finance #bootstrapping",
            "newsletter": "Subject: Why bootstrap when you can raise?\n\nHey Podcaster,\n\nWe hear a lot about multi-million dollar Series A funding rounds. But what we don't hear is the loss of control, the pressure for unsustainable growth, and the eventual crash.\n\nIn this episode, we sat down with a self-made entrepreneur who co-founded a $2B financial powerhouse without taking a dime of venture money.\n\nHere's the core takeaway: Profitability is the ultimate freedom.\n\nBest,\nPodcastOS Team",
            "blog_post": "### The Bootstrapping Paradigm: Scaling Without External Capital\n\nIn the modern tech landscape, raising venture capital has become synonymous with startup success. However, a growing number of founders are realizing that bootstrapping offers a level of control and financial durability that VC backing cannot match. \n\nTo build a bootstrapped company successfully, you must prioritize cash flows and unit economics from day one. You do not have the luxury of burning millions on user acquisition. Instead, you must build high-retention products that naturally drive organic recommendations. In this article, we outline the exact processes used to bootstrap financial systems to millions of active clients.",
            "hooks": [
                "Raising money is a trap. Here's why.",
                "How to build a $2B company with a team of 30.",
                "The biggest business school lies debunked."
            ],
            "no_emoji_version": f"Hook in style of {tone}: Most founders spend 90 percent of their time building, and only 10 percent selling.\n\nThis is a recipe for startup bankruptcy.\n\nHere is what we learned from bootstrapping Zerodha:\n\n1. Stop building in a vacuum. Talk to 10 customers on Day 1.\n2. Customer support is your marketing. A happy user is worth 1000 dollars in ads.\n3. Keep your burn low. Profitability gives you leverage.\n\nWhat is your perspective on this?"
        }
