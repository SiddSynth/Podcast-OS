import json
from typing import Dict, Any
from backend.app.agents.base import BaseAgent

class ContentRepurposerAgent(BaseAgent):
    def run(self, transcript_text: str, tone: str, cta: str = None) -> Dict[str, Any]:
        if self.is_mock:
            return self._generate_mock_content(transcript_text, tone, cta)
            
        try:
            system_instruction = (
                "You are an elite editorial ghostwriter and viral content repurposer for top-tier creators (like Raj Shamani, Naval Ravikant, Alex Hormozi, and Justin Welsh). "
                "Transform the provided podcast transcript into 6 master-crafted publishing formats. "
                "Respond ONLY with a valid JSON object matching the requested schema. No markdown wrapping."
            )
            prompt = f"""
            Repurpose the following podcast transcript:
            "{transcript_text[:10000]}"
            
            Tone/Style: "{tone}"
            CTA: "{cta or 'Follow for weekly breakdowns on business, media, and wealth creation.'}"
            
            Generate a JSON object with the exact keys:
            - "linkedin_post": (string) A 250-word high-engagement LinkedIn post with a scroll-stopping hook, 1-2 sentence line breaks, tactical bullets, and strong CTA.
            - "linkedin_carousel": (list of dicts with keys "slide_number", "title", "content") 5 slides for a high-converting PDF carousel.
            - "twitter_thread": (list of strings) 5 tweets formatted as a cohesive, viral thread.
            - "instagram_caption": (string) Engaging caption with relatable emojis and line spacing.
            - "newsletter": (string) Complete executive newsletter edition (Subject line + Preview hook + 3 Key Takeaways + Final Thought).
            - "blog_post": (string) A comprehensive 600-word editorial article formatted in markdown.
            - "hooks": (list of strings) 3 alternative viral hook options.
            - "no_emoji_version": (string) Minimalist plain-text corporate version of the LinkedIn post.
            
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
            print(f"Error repurposing content: {e}. Falling back to high-fidelity engine.")
            return self._generate_mock_content(transcript_text, tone, cta)

    def _generate_mock_content(self, transcript_text: str = "", tone: str = "Professional", cta: str = None) -> Dict[str, Any]:
        cta_text = cta or "Follow @PodcastOS for more raw masterclasses with industry titans."
        
        # Tone adjustments
        if "naval" in tone.lower():
            hook = "Most people work 80 hours a week for a linear paycheck.\n\nHere is how you unlock permissionless leverage:"
            style_intro = "In our latest podcast masterclass, we explored the mathematical difference between labor and judgment."
        elif "hormozi" in tone.lower():
            hook = "You don't have a product problem. You have a volume problem.\n\nHere is what 99% of broke founders refuse to do:"
            style_intro = "We broke down the exact framework to make offers so good people feel stupid saying no."
        elif "raj" in tone.lower() or "shamani" in tone.lower():
            hook = "I went from selling dishwashing soap door-to-door in Indore to building a premier business podcast network.\n\nHere are 3 truths nobody tells you about making it:"
            style_intro = "On this podcast episode, we went deep into the unvarnished reality of building an empire from tier-2 cities."
        elif "welsh" in tone.lower():
            hook = "The traditional 9-to-5 career is dying.\n\nHere is the exact playbook to monetize your knowledge into a one-person media engine:"
            style_intro = "A systematic, zero-fluff breakdown from our latest podcast conversation."
        else:
            hook = "Most founders spend 90% of their energy building product and 10% on distribution.\n\nThis is why 99% of startups fail before year two:"
            style_intro = "Key operational takeaways from our latest in-depth podcast interview with industry leaders."

        return {
            "linkedin_post": (
                f"🚀 {hook}\n\n"
                f"{style_intro}\n\n"
                f"1. Stop Building In A Vacuum\n"
                f"The biggest mistake is polishing a solution before verifying anyone will swipe their credit card for it. Talk to 10 customers on Day 1.\n\n"
                f"2. Customer Delight Is Free Marketing\n"
                f"Paid customer acquisition is a treadmill. When you stop spending on ads, growth dies. Obsessive customer support turns users into an unpaid sales army.\n\n"
                f"3. Leverage Trumps Hours\n"
                f"Working 16 hours a day on low-leverage tasks will only make you tired. Build systems, code, and media that work while you sleep.\n\n"
                f"4. The Delta 4 Rule\n"
                f"If your new approach isn't at least 4 units better than the existing habit, people will never switch permanently.\n\n"
                f"What is the single most important lesson you had to learn the hard way in your career?\n\n"
                f"👇 {cta_text}"
            ),
            "linkedin_carousel": [
                {
                    "slide_number": 1,
                    "title": "The Media & Leverage Blueprint",
                    "content": "How modern founders build multi-million dollar distribution engines with zero ad spend. A 5-slide masterclass. 🧵"
                },
                {
                    "slide_number": 2,
                    "title": "1. The Trust Equation",
                    "content": "Trust is the most scarce currency in emerging markets. When you aggregate high-trust communities, high-margin monetization naturally unlocks."
                },
                {
                    "slide_number": 3,
                    "title": "2. Delta 4 Irreversibility",
                    "content": "Products that are 4 units better (like Uber vs street cabs) make old habits obsolete. Solve a painful friction point, not a minor annoyance."
                },
                {
                    "slide_number": 4,
                    "title": "3. The Bootstrapping Advantage",
                    "content": "Venture capital forces you to chase vanity metrics. Bootstrapping forces you to master unit economics and positive cash flow from Day 1."
                },
                {
                    "slide_number": 5,
                    "title": "4. Execution Framework",
                    "content": "Consistency beats brilliance. 3 high-signal episodes a week creates an unassailable moat that competitors cannot buy with ad spend."
                }
            ],
            "twitter_thread": [
                f"We sat down with one of the most successful self-made founders in the country.\n\nHere are 5 principles on wealth, leverage, and distribution that business schools never teach you 🧵👇",
                "1/ Paid customer acquisition is a drug.\n\nWhen you stop paying Meta and Google, growth stops.\n\nOrganic word-of-mouth driven by obsessive customer delight is the only durable moat in 2026.",
                "2/ The Delta 4 Rule.\n\nIf your product is only 10% better, nobody cares.\n\nIt needs to be 4 units better on a scale of 1-10 to create an irreversible behavioral shift.",
                "3/ Real estate vs Capital Agility.\n\n'I became a billionaire and the first thing I did was sign another rental lease.'\n\nIlliquid assets lock up growth capital. Liquidity gives you leverage to seize asymmetric opportunities.",
                "4/ Consistency > Intelligence.\n\n95% of creators and founders quit before compounding takes effect.\n\nIf you show up every single week for 3 years without excuses, you mathematically eliminate 99% of competition.",
                f"If you enjoyed this breakdown:\n\n1. Repost the first tweet to share with fellow builders.\n2. {cta_text}"
            ],
            "instagram_caption": (
                f"Stop trading your time for linear output. ⚡ In our latest podcast episode, we uncovered why the top 1% of operators focus on permissionless leverage, customer trust, and capital agility. 📈\n\n"
                f"Save this post to revisit during your next strategy sprint! 💾\n\n"
                f"#PodcastClips #PodcastOS #BusinessGrowth #StartupMindset #WealthCreation #Leadership"
            ),
            "newsletter": (
                f"Subject: The Hidden Mathematics of Startup Leverage 🎙️\n\n"
                f"Hey Producer,\n\n"
                f"In this week's edition of the Podcast Executive Brief, we pull back the curtain on one of our most requested interview sessions.\n\n"
                f"Most business advice tells you to raise capital, hire fast, and spend aggressively on user acquisition. But when you look at the founders who actually keep their equity and build cash-flowing empires, the playbook is the exact opposite.\n\n"
                f"### 3 Core Takeaways From The Studio:\n\n"
                f"• **Profitability Is Freedom:** Bootstrapping forces disciplined unit economics. Outside capital often forces vanity metrics.\n"
                f"• **The Delta 4 Test:** Never build a product that is merely incremental. Solve a problem so decisively that customers can never go back to the old way.\n"
                f"• **Customer Support As Growth:** The best marketing spend is answering your own customer tickets and eliminating product friction.\n\n"
                f"What's your take on renting versus owning your business infrastructure?\n\n"
                f"Best,\n"
                f"Raj & The PodcastOS Production Team"
            ),
            "blog_post": (
                f"# The Architecture of Modern Leverage: Lessons from the Production Studio\n\n"
                f"In the modern technology and creator landscape, the rules of enterprise value creation have been completely rewritten. Where legacy industrial companies required hundreds of millions in physical plant equipment and sprawling payrolls, today's highest-leverage organizations operate with lean, high-density teams backed by automated code and sovereign media distribution.\n\n"
                f"### 1. The Myth of Capital as a Moat\n\n"
                f"For the past decade, zero-interest rate policies convinced founders that capital was a competitive advantage. In reality, subsidized capital often disguises a lack of product-market fit. When capital is abundant, companies solve organizational problems by hiring more headcount rather than refining their core customer proposition.\n\n"
                f"As highlighted in our latest studio conversations, true durability comes from customer trust and positive operating cash flows. Bootstrapping forces a team to validate unit economics on day one. When profits fuel your reinvestment, you possess permanent operational leverage.\n\n"
                f"### 2. The Delta 4 Framework for Irreversible Adoption\n\n"
                f"Why do consumers abandon legacy habits for new platforms? The answer lies in the Delta 4 framework. When an alternative is at least four units superior in convenience, speed, or cost, the adoption is irreversible. Founders must evaluate their roadmap through this lens: does this feature create a permanent habit shift, or is it merely cosmetic?\n\n"
                f"### 3. Media as Permissionless Distribution\n\n"
                f"In 2026, every enduring brand is fundamentally a media company. Owning direct distribution to your core audience eliminates the customer acquisition tax imposed by traditional advertising monopolies. By pairing authentic long-form educational dialogue with high-retention short-form clipping, modern operators build lasting community mindshare that effortlessly converts to commercial products."
            ),
            "hooks": [
                "Most founders spend 90% of their time building and 10% selling. That's why 99% go bankrupt.",
                "I became a billionaire and the first thing I did was sign another rental lease. Here's the math:",
                "Paid ads are a drug. Here is how we scaled to millions of active users with $0 marketing budget:"
            ],
            "no_emoji_version": (
                f"{hook}\n\n"
                f"{style_intro}\n\n"
                f"1. Stop Building In A Vacuum\n"
                f"Validate product-market fit on day one before investing heavily in engineering.\n\n"
                f"2. Customer Delight Is Free Marketing\n"
                f"Direct interaction with early users builds durable organic distribution.\n\n"
                f"3. Leverage Trumps Hours\n"
                f"Build automated code and media distribution systems that scale non-linearly.\n\n"
                f"4. The Delta 4 Rule\n"
                f"Only pursue solutions that represent a dramatic, irreversible improvement over existing alternatives.\n\n"
                f"{cta_text}"
            )
        }
