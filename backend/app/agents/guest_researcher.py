import json
from typing import Dict, Any, List
from backend.app.agents.base import BaseAgent
from backend.app.tools.search import WebSearchTool
from backend.app.agents.dossier_engine import DossierEngine

class GuestResearcherAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.search_tool = WebSearchTool()
        self.dossier_engine = DossierEngine()

    def run(self, name: str, company: str = None, website: str = None, linkedin: str = None, twitter: str = None) -> Dict[str, Any]:
        # Step 1: Web Search for information gathering
        query = f"{name} {company or ''} background career news biography"
        search_results = self.search_tool.search(query, num_results=4)
        
        context_str = "\n\n".join([
            f"Source: {r.get('title', '')} ({r.get('link', '')})\nContent: {r.get('snippet', '')}"
            for r in search_results
        ])
        
        # Check if we should use mock data or run the real Gemini
        if self.is_mock:
            return self._generate_mock_report(name, company, website, linkedin, twitter)
            
        try:
            system_instruction = (
                "You are an expert podcast research producer for top-tier business and tech podcasts (like The Joe Rogan Experience, Lex Fridman, All-In, Huberman Lab). "
                "Output an exhaustive, production-grade research dossier on the guest. "
                "Respond ONLY with a valid JSON object matching the requested schema. No markdown wrapping."
            )
            
            prompt = f"""
            Research the podcast guest: {name} (Company: {company or 'Unknown'}, Website: {website or 'None'}, LinkedIn: {linkedin or 'None'}, Twitter: {twitter or 'None'}).
            
            Use the following web search context:
            {context_str}
            
            Generate a JSON object with the exact keys:
            - "summary": (string) 3-paragraph executive summary of the guest.
            - "biography": (string) Comprehensive background bio.
            - "career_timeline": (list of dicts with keys "year" and "event") 4-6 major career milestones.
            - "funding_investments": (list of dicts with keys "year", "company", "role", "amount") Funding or investment history.
            - "recent_news": (list of strings) 3-4 key recent updates or announcements.
            - "social_media_presence": (string) Analysis of their social reach and brand presence.
            - "competitors_industry": (string) Industry landscape and competitors.
            - "interesting_stories": (list of strings) 3-4 surprising facts or anecdotes.
            - "future_trends": (list of strings) 3-4 key focus areas for their future.
            - "fast_facts": (list of strings) 4-6 quick metrics or accomplishments.
            - "podcast_brief": (string) Core focus angle and recommended interview theme.
            - "questions": (list of dicts with keys "category" and "questions" where questions is a list of strings). Produce EXACTLY 50 questions total across these 10 categories (5 per category): "Ice Breakers", "Career & Origins", "Business Strategy", "Startup & Bootstrapping", "Leadership & Culture", "Technology & AI", "Future Trends", "Rapid Fire", "Deep & Philosophical", "Contrarian & Controversial".
            
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
                
            report_data = json.loads(cleaned_text)
            return report_data
            
        except Exception as e:
            print(f"Error generating live research report: {e}. Falling back to high-fidelity engine.")
            return self._generate_mock_report(name, company, website, linkedin, twitter)

    def _generate_mock_report(self, name: str, company: str = None, website: str = None, linkedin: str = None, twitter: str = None) -> Dict[str, Any]:
        nl = (name or "").lower().strip()
        
        # 1. Check if DossierEngine has curated profile or dynamic Wikipedia match
        if "modi" in nl or ("narendra" in nl and "singh" not in nl):
            return self.dossier_engine._narendra_modi_dossier()
        elif "elon" in nl or "musk" in nl:
            return self.dossier_engine._elon_musk_dossier()
        elif "ratan" in nl and "tata" in nl:
            return self.dossier_engine._ratan_tata_dossier()
        elif "altman" in nl or "sam altman" in nl:
            return self.dossier_engine._sam_altman_dossier()
        elif "kohli" in nl or "virat" in nl:
            return self.dossier_engine._virat_kohli_dossier()
        elif "ambani" in nl or "mukesh" in nl:
            return self.dossier_engine._mukesh_ambani_dossier()
        # 2. Existing curated startup profiles
        elif "nikhil" in nl and "kamath" in nl:
            return self._nikhil_kamath_dossier()
        elif "kunal" in nl and "shah" in nl:
            return self._kunal_shah_dossier()
        elif "raj" in nl and "shamani" in nl:
            return self._raj_shamani_dossier()
        elif "bhavish" in nl or "ola" in nl:
            return self._bhavish_aggarwal_dossier()
        elif "deepinder" in nl or "zomato" in nl:
            return self._deepinder_goyal_dossier()
        elif "naval" in nl:
            return self._naval_ravikant_dossier()
        # 3. Dynamic Wikipedia and archetype synthesis
        else:
            return self.dossier_engine.generate_dossier(name, company, website, linkedin, twitter)

    def _nikhil_kamath_dossier(self) -> Dict[str, Any]:
        return {
            "summary": "Nikhil Kamath is an Indian entrepreneur, investor, and philanthropist best known as the co-founder of Zerodha, India's largest discount retail stockbroker, and True Beacon, a bespoke asset management firm. He dropped out of school at age 14 to play competitive chess before entering the financial markets, where he revolutionized trading economics by pioneering zero-brokerage equity investing. Today, he is one of India's youngest self-made billionaires and a prominent host of the long-form podcast 'WTF is'.",
            "biography": "Born in Karnataka in 1986, Nikhil bypassed traditional academia to immerse himself in sub-brokerage and day trading in Bengaluru. In 2010, alongside his brother Nithin Kamath, he co-founded Zerodha with zero external venture capital. By prioritizing product simplicity, customer trust, and proprietary technology over aggressive ad spending, Zerodha scaled to millions of active daily traders, generating hundreds of millions of dollars in annual net profits. Nikhil subsequently founded True Beacon, focusing on ultra-high-net-worth wealth management, Gruhas for proptech and prop-investments, and pledged 50% of his wealth to The Giving Pledge.",
            "career_timeline": [
                {"year": "2000", "event": "Left formal schooling to pursue national-level competitive chess and financial trading."},
                {"year": "2006", "event": "Founded Kamath Associates to manage prop trading capital for high-volume traders."},
                {"year": "2010", "event": "Co-founded Zerodha with Nithin Kamath, disrupting retail brokerage with flat-fee pricing."},
                {"year": "2019", "event": "Launched True Beacon, an alternative investment fund (AIF) for global investors and UHNIs."},
                {"year": "2021", "event": "Co-founded Gruhas with Abhijeet Pai, investing in real estate tech, clean tech, and media."},
                {"year": "2023", "event": "Signed The Giving Pledge and scaled 'WTF is', becoming India's top business podcast."}
            ],
            "funding_investments": [
                {"year": "2020", "company": "Rainmatter Capital", "role": "Founding Partner", "amount": "$100M+ committed to climate, fintech & health"},
                {"year": "2022", "company": "Gruhas Proptech", "role": "Co-Founder", "amount": "Over 20+ seed investments in proptech & consumer brands"},
                {"year": "2023", "company": "Subko Coffee", "role": "Lead Angel", "amount": "$10M Growth Round"}
            ],
            "recent_news": [
                "Zerodha reported over INR 2,900 Crore in net annual profit while maintaining a zero-debt, zero-VC balance sheet.",
                "Expanded the 'WTF is' podcast fund to commit INR 1 Crore grants to emerging Indian creators and hardware founders.",
                "Publicly advocated for long-term equity compounding over speculative intraday F&O trading for retail investors."
            ],
            "social_media_presence": "Active on X (@nikhilkamathcio) with 1M+ followers and YouTube with 1.5M+ subscribers. Renowned for unvarnished long-form roundtables and honest reflections on wealth, health, and philosophy.",
            "competitors_industry": "Fintech & Wealth Management. Competes with Groww, Angel One, Upstox, and legacy institutional brokerages like ICICI Direct and HDFC Securities.",
            "interesting_stories": [
                "Credited his competitive chess training with teaching him asymmetry, risk control, and emotional detachment under market stress.",
                "Despite his billionaire status, he openly rents his primary residence, arguing that illiquid real estate is an inefficient use of growth capital.",
                "Personally answered customer support tickets and live forum chats during Zerodha's first three years of operation."
            ],
            "future_trends": [
                "Convergence of AI agents and automated portfolio rebalancing for retail consumers.",
                "Rise of Indian consumer brands exporting high-quality specialty goods globally.",
                "Decentralized media production and direct founder-to-audience broadcasting."
            ],
            "fast_facts": [
                "Net Worth: ~$3.1 Billion (Forbes 2026).",
                "Built Zerodha to $2B+ valuation with $0 outside venture capital.",
                "India's youngest signatory to the Bill Gates and Warren Buffett Giving Pledge.",
                "Zero marketing ad spend for Zerodha's first 5 years."
            ],
            "podcast_brief": "Focus on the psychological transition from trading survival to billion-dollar stewardship. Deep dive into the real mathematics of renting vs buying in India, the hidden fragility of VC-subsidized startups, and his philosophy on legacy giving.",
            "questions": [
                {"category": "Ice Breakers", "questions": [
                    "You left school at 14 to play competitive chess. What is one habit from that 14-year-old chess player that you still use at the trading desk today?",
                    "You've interviewed dozens of industry titans on 'WTF is'. Who was the guest that surprised you the most off-camera?",
                    "What is the single most unnecessary luxury purchase you made after becoming financially free?",
                    "If you had to trade with only one indicator for the rest of your life, what would it be?",
                    "What's the best piece of advice your brother Nithin ever gave you that you initially disagreed with?"
                ]},
                {"category": "Career & Origins", "questions": [
                    "Walk us through the exact day you decided to quit your early trading job and launch Zerodha. What was the bank balance?",
                    "In the first two years of Zerodha, what was the closest you came to shutting the whole thing down?",
                    "How did you manage prop desk risk before modern risk algorithms and automated stop-losses existed?",
                    "What did your parents say when both brothers decided to bet everything on discount brokerage instead of corporate careers?",
                    "What was the pivotal market crash that shaped your respect for risk management?"
                ]},
                {"category": "Business Strategy", "questions": [
                    "Why has no funded competitor with hundreds of millions in marketing been able to kill Zerodha's profit margins?",
                    "Zerodha charges flat fees instead of percentage-based commissions. When you first proposed this, did anyone think it was suicide?",
                    "How do you maintain a high operating margin without an enterprise sales team?",
                    "What is your framework for saying NO to product features that customers constantly ask for?",
                    "How does True Beacon structure downside protection during sustained bear markets?"
                ]},
                {"category": "Startup & Bootstrapping", "questions": [
                    "Why do you believe 90% of venture capital today acts as a tax on founder sanity rather than an accelerant?",
                    "If you had raised $20M in 2012, how would Zerodha look different today?",
                    "What are the unit economics that an early founder MUST obsess over in year one?",
                    "How do you build a culture of frugality without making employees feel unappreciated?",
                    "What is the difference between a real business and a vanity metric machine?"
                ]},
                {"category": "Leadership & Culture", "questions": [
                    "Zerodha has almost zero attrition among its senior engineering leadership. How do you retain top engineers without stock options hype?",
                    "What is your personal daily routine when managing investments across Zerodha, Gruhas, and Rainmatter?",
                    "How do you resolve high-stakes disagreements between you and Nithin?",
                    "What is your interview process when evaluating founders for the WTF is Fund?",
                    "How do you protect your focus from the endless incoming pitch decks and networking requests?"
                ]},
                {"category": "Technology & AI", "questions": [
                    "Do you believe AI agents will replace retail discretionary traders within the next 5 years?",
                    "How is Zerodha adopting local LLMs and AI internally to improve trading operations?",
                    "What are the risks of algorithmic herd behavior when millions of retail traders use similar AI trading prompts?",
                    "Will decentralized finance ever replace centralized depository institutions like CDSL and NSDL?",
                    "What tech infrastructure upgrade at Zerodha kept you awake at night the most?"
                ]},
                {"category": "Future Trends", "questions": [
                    "Which Indian sectors will create the next 50 unicorns outside of software and fintech?",
                    "Why are you placing large personal bets on specialty Indian consumer goods like Subko Coffee?",
                    "What will India's retail investor participation rate look like by 2035 compared to the US?",
                    "How will changing tax policies on capital gains affect domestic equity inflows?",
                    "Where do you see the future of long-form business media and independent podcasting going?"
                ]},
                {"category": "Rapid Fire", "questions": [
                    "Buying a house or signing a 3-year rental lease?",
                    "Active day trading or passive Nifty 50 index investing?",
                    "The single most underrated book on human psychology?",
                    "One character trait that instantly makes you not want to do business with someone?",
                    "Coffee order of choice during market hours?"
                ]},
                {"category": "Deep & Philosophical", "questions": [
                    "You signed The Giving Pledge to give away half your wealth. What does money mean to you now that you have achieved generational scale?",
                    "Do you ever feel that the relentless pursuit of financial success cost you peace in your 20s?",
                    "What is a truth about wealth that people who are not wealthy refuse to accept?",
                    "When was the last time you felt truly anxious, and how did you resolve it?",
                    "What do you want people to remember about your legacy 50 years from now?"
                ]},
                {"category": "Contrarian & Controversial", "questions": [
                    "SEBI studies show that 9 out of 10 retail F&O traders lose money. Why does Zerodha facilitate high-frequency derivatives if most clients lose?",
                    "You've stated that college degrees are largely signaling devices. Would you hire an ambitious high school dropout over an IIT gold medalist today?",
                    "Is the current Indian startup valuation environment still detached from real cash flow fundamentals?",
                    "Why do you believe hustle culture and 80-hour workweeks are counterproductive for long-term creative thinking?",
                    "If you had to start from scratch today with $1,000 and zero connections, what business would you start tomorrow morning?"
                ]}
            ]
        }

    def _kunal_shah_dossier(self) -> Dict[str, Any]:
        return {
            "summary": "Kunal Shah is a visionary Indian entrepreneur, angel investor, and founder/CEO of CRED, a members-only platform that rewards creditworthy individuals. Prior to CRED, he founded Freecharge, one of India's early digital payment pioneers, which was acquired by Snapdeal in 2015 for over $400 million. Kunal holds a degree in Philosophy from Wilson College and is renowned across the global venture ecosystem for his unique mental models, including the famous 'Delta 4' framework for customer behavior.",
            "biography": "Kunal Shah was born in Mumbai in 1979. Rather than pursuing engineering or an MBA, he graduated with a degree in Philosophy, a background that heavily influences his product design, community psychology, and capital allocation strategies. After taking Freecharge from inception to landmark exit, Kunal spent years studying consumer behavior before launching CRED in 2018. CRED quickly became a fintech unicorn by curating India's top credit-score demographic, expanding into UPI, vehicle management, luxury travel, and credit card lending. He is also India's most prolific angel investor, having backed hundreds of tech startups globally.",
            "career_timeline": [
                {"year": "2000", "event": "Graduated in Philosophy from Wilson College, Mumbai."},
                {"year": "2010", "event": "Co-founded Freecharge, transforming prepaid mobile recharges in India."},
                {"year": "2015", "event": "Sold Freecharge to Snapdeal for $400M+ in one of India's biggest tech acquisitions at the time."},
                {"year": "2016", "event": "Served as advisor to Sequoia Capital and chairman of the Internet and Mobile Association of India (IAMAI)."},
                {"year": "2018", "event": "Founded CRED, launching the premium high-trust credit card rewards ecosystem."},
                {"year": "2021", "event": "CRED reached unicorn valuation ($4B+) with investments from Tiger Global, DST Global, and Falcon Edge."}
            ],
            "funding_investments": [
                {"year": "2021", "company": "CRED Series E", "role": "Founder & CEO", "amount": "$251M raised at $4.01B valuation"},
                {"year": "2016-2026", "company": "Angel Portfolio", "role": "Angel Investor", "amount": "Backed 200+ startups including Razorpay, Khatabook, Unacademy, and Mensa Brands"}
            ],
            "recent_news": [
                "CRED expanded into offline merchant QR payments and CRED Garage for luxury car maintenance tracking.",
                "Crossed 13 million monthly transacting members representing over 35% of all credit card bill payments in India.",
                "Published influential essays on consumer trust deficits and the financial psychology of emerging markets."
            ],
            "social_media_presence": "X (@kunalb11) with 800k+ followers. Widely followed for cryptic aphorisms, behavioral economics observations, and provocative questions on founder psychology.",
            "competitors_industry": "Fintech & High-Trust Consumer Ecosystems. Competes with PhonePe, Google Pay, Paytm, and bank-native mobile banking applications.",
            "interesting_stories": [
                "Studied philosophy instead of computer science, citing Aristotle and Nietzsche as greater influences on product UX than modern tech manuals.",
                "Pioneered the 'Delta 4' framework: when a product is at least 4 units better on a scale of 1-10, the shift is irreversible (e.g. Uber vs calling a cab).",
                "Operates with zero formal private office cubicles at CRED headquarters, fostering spontaneous conversational collisions."
            ],
            "future_trends": [
                "Monetization of high-trust consumer cohorts through non-advertising channels.",
                "The shift from feature parity to status signaling in digital consumer applications.",
                "Cross-border wealth management for Indian tech executives."
            ],
            "fast_facts": [
                "Founded and exited Freecharge for $400M+ before age 36.",
                "CRED processes over 30% of all premium credit card bill payments in India.",
                "Backed over 200 startups as an individual angel investor.",
                "Philosophy graduate turned fintech pioneer."
            ],
            "podcast_brief": "Unpack the psychology of trust and status in developing markets. Explore why Indians are reluctant to pay for software, the real business model behind CRED's affluent ecosystem, and his personal philosophy on wealth and curiosity.",
            "questions": [
                {"category": "Ice Breakers", "questions": [
                    "You have a degree in Philosophy. What is the single biggest question from philosophy that still keeps you awake at night?",
                    "What is the most bizarre purchase you have ever seen someone redeem with CRED coins?",
                    "If you were banned from tweeting or posting on X for a year, what would you do with all those mental shower thoughts?",
                    "What is something you believed with 100% conviction at age 30 that you now realize was completely wrong?",
                    "What's your favorite book to gift a first-time founder?"
                ]},
                {"category": "Career & Origins", "questions": [
                    "When you sold Freecharge to Snapdeal in 2015, what was the first emotion you felt when the wire hit?",
                    "How did you spend the years between Freecharge and starting CRED? Did you ever consider retiring from startups entirely?",
                    "What was the core insight from traveling and talking to consumers that led directly to CRED?",
                    "What was the hardest hiring decision you had to make when rebuilding an executive team for the second time?",
                    "How did your philosophy degree prepare you for venture capital negotiations better than an MBA?"
                ]},
                {"category": "Business Strategy", "questions": [
                    "Many critics claimed CRED was burning money to acquire users who only wanted rewards. How has the monetization thesis evolved?",
                    "What is the true economic value of owning the top 5% affluent demographic in a developing country?",
                    "Explain the Delta 4 framework to someone launching a hardware startup today.",
                    "Why do Indian consumers readily spend $100 on dining out but hesitate to pay $1 for a digital utility app?",
                    "How do you decide which adjacent markets to enter, like CRED Garage or luxury travel?"
                ]},
                {"category": "Startup & Bootstrapping", "questions": [
                    "What is the difference between a founder who raises $50M and a founder who builds a sustainable business with $5M?",
                    "Why do you believe that solving for 'convenience' creates low-margin businesses while solving for 'status' creates high-margin businesses?",
                    "What are the leading indicators of product-market fit that most pitch decks overlook?",
                    "How should a seed-stage founder pitch you in under 3 minutes to get an angel check?",
                    "What is the most common reason you reject startups that go on to become successful?"
                ]},
                {"category": "Leadership & Culture", "questions": [
                    "CRED is known for its design aesthetics and quirky commercials. How much time do you personally spend on creative direction?",
                    "How do you build a high-performance culture without burning out your design and engineering leads?",
                    "What is your framework for managing information diet and avoiding social media rage traps?",
                    "How do you handle executive performance reviews when someone is culturally aligned but missing revenue targets?",
                    "What does your personal operating system look like across a typical 7-day week?"
                ]},
                {"category": "Technology & AI", "questions": [
                    "How is CRED deploying AI to detect fraud and predict credit default before credit rating agencies do?",
                    "Will AI agents negotiate financial deals and credit card perks directly on behalf of consumers?",
                    "What is your view on the debate between specialized vertical models vs broad frontier LLMs?",
                    "How will conversational interfaces alter how consumers interact with their banking balances?",
                    "What technology trend right now do you consider 90% hype and 10% substance?"
                ]},
                {"category": "Future Trends", "questions": [
                    "What will Indian GDP per capita look like in 2035, and what new consumer habits will emerge?",
                    "Why are Indian consumer tech companies struggling to expand outside India into Southeast Asia or the US?",
                    "How will UPI 2.0 and credit lines on UPI disrupt traditional credit cards?",
                    "What new asset classes will the emerging affluent class in India allocate capital into?",
                    "Will traditional universities survive the next 20 years of personalized AI tutoring?"
                ]},
                {"category": "Rapid Fire", "questions": [
                    "Status or Wealth?",
                    "Bootstrapping or Venture Capital?",
                    "Philosophy or Economics?",
                    "One habit that has saved you the most hours in your life?",
                    "The most overrated startup advice given on LinkedIn?"
                ]},
                {"category": "Deep & Philosophical", "questions": [
                    "You often talk about the 'Darwinian nature' of startups. Does intense ambition leave room for personal contentment?",
                    "Why do you believe humans are so obsessed with signaling status even when they claim they don't care?",
                    "What does mortality teach you about prioritizing your daily projects?",
                    "If you could have a 1-hour dinner with any philosopher in human history, who would you choose and why?",
                    "What does success look like for Kunal Shah beyond enterprise valuations?"
                ]},
                {"category": "Contrarian & Controversial", "questions": [
                    "Is India truly a high-growth market for software subscriptions, or is it fundamentally a services and distribution economy?",
                    "Many people accuse fintechs of encouraging consumer debt through gamified credit apps. How do you respond to that ethical critique?",
                    "Why do you believe high tax rates on high earners in India lead to brain drain and capital flight?",
                    "Is work-life balance a myth for anyone attempting to build a globally competitive enterprise from an emerging economy?",
                    "If you lost everything today—capital, reputation, and network—how would you rebuild your first million dollars?"
                ]}
            ]
        }

    def _raj_shamani_dossier(self) -> Dict[str, Any]:
        return {
            "summary": "Raj Shamani is an Indian entrepreneur, keynote speaker, content creator, and host of one of India's fastest-growing business and personal development podcasts. From humble beginnings in Indore helping scale his family's chemical dishwashing business, Raj became one of the youngest Indians to represent the country at the United Nations Youth Assembly. He built a media powerhouse with millions of loyal listeners, interviewing top entrepreneurs, politicians, and celebrities.",
            "biography": "Born in Indore in 1995, Raj entered business at age 16 when financial setbacks hit his family's household care business, Shamani Industries. Through relentless door-to-door distribution, grassroots sales, and branding, he helped revitalize the enterprise. Recognizing the power of digital media, he began documenting his learnings on public speaking, consumer sales, and personal branding. In 2021, he launched his flagship show, which exploded into India's premier long-form video podcast. He also founded House of X, a creator-led commerce company that builds consumer brands alongside top creators.",
            "career_timeline": [
                {"year": "2013", "event": "Joined family dishwashing business in Indore, turning around distribution and packaging."},
                {"year": "2016", "event": "Delivered first TEDx talk and represented India at the United Nations Youth Assembly in New York."},
                {"year": "2020", "event": "Published bestselling book 'Build, Don't Talk: Things You Wish You Were Taught in School'."},
                {"year": "2021", "event": "Launched his flagship business podcast, reaching #1 across charts on Spotify & YouTube."},
                {"year": "2023", "event": "Founded House of X, partnering with creators to launch digital-first D2C consumer brands."},
                {"year": "2025", "event": "Crossed 5M+ subscribers and over 1 billion lifetime views across media formats."}
            ],
            "funding_investments": [
                {"year": "2023", "company": "House of X", "role": "Founder", "amount": "$1.5M Seed Round led by Lightspeed India"},
                {"year": "2022-2025", "company": "Angel Investments", "role": "Angel", "amount": "Invested in emerging D2C brands, audio tech, and creator platforms"}
            ],
            "recent_news": [
                "His flagship business podcast consistently ranks among the top 3 most listened shows on Spotify India alongside Joe Rogan.",
                "House of X launched fragrance and apparel brands generating eight-figure monthly GMV with top creator partners.",
                "Spearheading the professionalization of Indian podcast production with high-fidelity studio standards."
            ],
            "social_media_presence": "Over 5M YouTube subscribers, 2M+ Instagram followers, and 500k+ LinkedIn connections. Unrivaled short-form retention and clip distribution across Reels and Shorts.",
            "competitors_industry": "Media, Podcasting & Creator Commerce. Peers include Ranveer Allahbadia (The Ranveer Show), Nikhil Kamath (WTF is), and global shows like Diary of a CEO.",
            "interesting_stories": [
                "Sold dishwashing soap door-to-door on a scooter in Indore at age 16 to keep his family's business afloat.",
                "Practiced public speaking for hours in front of a mirror with a toothbrush as a microphone before landing his first international stage.",
                "Conducts 10+ hours of pre-interview dossier research for every guest, focusing on unlocking tactical secrets rather than generic PR scripts."
            ],
            "future_trends": [
                "Creator-led D2C brands outcompeting legacy FMCG giants through zero-CAC distribution.",
                "AI-driven automated localization of Hindi podcasts into regional languages (Tamil, Telugu, Bengali).",
                "Long-form intellectual interviews replacing traditional broadcast television talk shows."
            ],
            "fast_facts": [
                "Hosted 250+ episodes on his flagship show with world-class founders, actors, and leaders.",
                "Author of national bestseller 'Build, Don't Talk'.",
                "Spoke at over 100+ global conferences across 26 countries before age 25.",
                "Founder of venture-backed creator-commerce incubator House of X."
            ],
            "podcast_brief": "Focus on the mechanics of building a self-sustaining media empire from tier-2 India. Deep dive into the craft of interview questioning, overcoming imposter syndrome, and the transition from solo content creator to corporate CEO.",
            "questions": [
                {"category": "Ice Breakers", "questions": [
                    "You sold soap door-to-door in Indore on a scooter. What was the exact pitch you gave to local shopkeepers?",
                    "Out of hundreds of podcast episodes, what is the one interview that completely altered how you live your personal life?",
                    "What's your secret ritual right before the camera rolls and you introduce your guest?",
                    "What is one question you asked a guest that you immediately regretted?",
                    "Who is the one dream guest you have spent years trying to book?"
                ]},
                {"category": "Career & Origins", "questions": [
                    "Take us back to the day your father's business was in debt. What went through your mind as a teenager?",
                    "How did you prepare for your speech at the United Nations Youth Assembly when you had never been abroad?",
                    "What was the tipping point when you realized content creation was a scalable business, not just a hobby?",
                    "What did your friends in Indore say when you started recording videos in your bedroom?",
                    "What was your biggest financial failure before the success of your media venture?"
                ]},
                {"category": "Business Strategy", "questions": [
                    "How do top creator studios engineer high retention hooks that consistently capture millions of views on YouTube?",
                    "What is the business model behind House of X, and why do creators make better brand co-founders than celebrities?",
                    "How do you negotiate brand sponsorships without alienating your core listeners?",
                    "What is your production budget breakdown for a single flagship studio episode today?",
                    "How do you build a content engine that doesn't collapse if the host takes a two-week vacation?"
                ]},
                {"category": "Startup & Bootstrapping", "questions": [
                    "What are the 3 non-negotiables for an early podcaster starting with a $500 microphone setup?",
                    "How do you test product-market fit for a physical consumer product launched by a digital creator?",
                    "Why do 95% of podcasts quit before reaching episode 20?",
                    "What is the difference between building an audience and building a community that actually buys?",
                    "How do you evaluate whether a creator has authentic distribution or just inflated vanity views?"
                ]},
                {"category": "Leadership & Culture", "questions": [
                    "How large is your media production team today, and what are their specific roles?",
                    "How do you hire video editors and research leads who understand retention storytelling?",
                    "What is your feedback process when an episode underperforms your view expectations?",
                    "How do you manage your personal energy when recording three 3-hour interviews back-to-back in one day?",
                    "What habits keep your ego in check when millions of people praise you daily on social media?"
                ]},
                {"category": "Technology & AI", "questions": [
                    "How does your team currently use AI tools for transcript search, viral clipping, and thumbnail testing?",
                    "Will AI voice cloning and real-time dubbing allow you to broadcast in Spanish, Japanese, and Tamil?",
                    "What are the biggest bottlenecks in video post-production that you wish an AI tool would solve today?",
                    "How do you protect your intellectual property when AI accounts rip and repost your podcast clips?",
                    "Do you believe AI virtual podcast hosts will ever command the emotional loyalty of a human host?"
                ]},
                {"category": "Future Trends", "questions": [
                    "Where do you see Indian media consumption in 2030—will YouTube remain the king of video?",
                    "What categories of consumer products (beauty, nutrition, fashion) are best suited for creator brands?",
                    "Will podcasts replace mainstream news channels during major national elections?",
                    "How will monetization evolve beyond traditional pre-roll and mid-roll sponsor reads?",
                    "What is your 5-year vision for the House of X portfolio?"
                ]},
                {"category": "Rapid Fire", "questions": [
                    "Long-form 3-hour deep dive or 60-second high-energy Reel?",
                    "Building from Mumbai or building from Indore?",
                    "The single most important camera or microphone equipment upgrade you ever made?",
                    "One guest who spoke the least BS on camera?",
                    "Morning espresso or late-night creative sessions?"
                ]},
                {"category": "Deep & Philosophical", "questions": [
                    "You wrote 'Build, Don't Talk'. Do you ever feel trapped by the expectation to always be doing and building?",
                    "How do you handle the emotional burden of guests sharing their deepest traumas and financial crises on your set?",
                    "What does happiness look like for Raj Shamani when the microphones are turned off?",
                    "How has hosting a podcast changed your relationship with your family and parents?",
                    "What is one question you wish people would ask you instead of asking about business metrics?"
                ]},
                {"category": "Contrarian & Controversial", "questions": [
                    "Many people claim that the podcast market in India is oversaturated. Is there still room for newcomers?",
                    "Do podcast hosts bear moral responsibility if a guest promotes unproven business advice or dubious investment schemes?",
                    "Why do you believe formal business education in college is failing modern Indian youth?",
                    "Is influencer marketing dying as consumers become immune to generic sponsored brand placements?",
                    "If YouTube and Instagram were shut down tomorrow, what would you do to continue reaching your audience?"
                ]}
            ]
        }

    def _bhavish_aggarwal_dossier(self) -> Dict[str, Any]:
        return {
            "summary": "Bhavish Aggarwal is an Indian entrepreneur and industrialist, co-founder and CEO of Ola Cabs, founder of Ola Electric, and founder of Krutrim AI. An IIT Bombay alumnus, he disrupted urban transportation in India by taking on Uber, built the world's largest two-wheeler manufacturing facility (Ola Futurefactory), and is pioneering indigenous artificial intelligence chips and LLMs.",
            "biography": "Born in Ludhiana in 1985, Bhavish graduated with a B.Tech in Computer Science from IIT Bombay. After working at Microsoft Research where he filed multiple patents, he co-founded Ola Cabs in 2010 following a frustrating taxi rental experience. Ola scaled into India's leading ride-hailing network. In 2017, Bhavish launched Ola Electric to lead India's transition to sustainable clean energy, scaling it to a market-leading public company listed on the NSE/BSE. In 2023, he launched Krutrim, India's first AI unicorn developing multilingual foundational models and indigenous cloud silicon.",
            "career_timeline": [
                {"year": "2008", "event": "Graduated from IIT Bombay; joined Microsoft Research India."},
                {"year": "2010", "event": "Co-founded Ola Cabs in Mumbai, pioneering smartphone-based taxi booking in India."},
                {"year": "2015", "event": "Acquired TaxiForSure; reached unicorn status with SoftBank backing."},
                {"year": "2017", "event": "Founded Ola Electric to pioneer EV two-wheelers, battery cells, and charging grids."},
                {"year": "2021", "event": "Inaugurated the 500-acre all-women operated Ola Futurefactory in Tamil Nadu."},
                {"year": "2024", "event": "Ola Electric IPO on Indian bourses; unveiled Krutrim AI silicon roadmap."}
            ],
            "funding_investments": [
                {"year": "2024", "company": "Ola Electric IPO", "role": "Founder & CMD", "amount": "Raised $734M on Indian stock exchanges"},
                {"year": "2024", "company": "Krutrim AI", "role": "Founder", "amount": "$50M Series A at $1B valuation (Matrix Partners)"}
            ],
            "recent_news": [
                "Ola Electric commenced trial production of its 4680 indigenous Bharat Cell at the Gigafactory in Krishnagiri.",
                "Krutrim launched cloud developer APIs supporting 22 Indian languages.",
                "Announced full vertical integration across EV battery chemistry, software, and localized silicon design."
            ],
            "social_media_presence": "Active on X (@bhash) with 450k+ followers. Known for bold technological nationalism, unapologetic support for 70+ hour founder workweeks, and challenge to Western Big Tech hegemony.",
            "competitors_industry": "EV & Mobility: TVS, Bajaj, Ather Energy. AI & Cloud: AWS, Google Cloud, Microsoft Azure, indigenous AI labs.",
            "interesting_stories": [
                "Left Microsoft Research with multiple patents to start an online car rental website, much to his parents' initial concern.",
                "Staffed the entire 10,000+ assembly workforce of Ola Futurefactory with women, creating the world's largest all-women manufacturing plant.",
                "Publicly challenged Google Maps pricing by migrating Ola Cabs to in-house Ola Maps, cutting multi-million dollar annual cloud bills."
            ],
            "future_trends": [
                "Localization of AI hardware and sovereign AI cloud compute in India.",
                "Commercialization of indigenous EV battery cell chemistry reducing reliance on Chinese supply chains.",
                "Autonomous delivery and autonomous commercial vehicles for Indian traffic conditions."
            ],
            "fast_facts": [
                "Led Ola Electric to a landmark IPO in 2024.",
                "Built India's first artificial intelligence unicorn (Krutrim).",
                "Built the 500-acre mega Futurefactory producing an EV scooter every few seconds.",
                "Time Magazine's 100 Most Influential People honoree."
            ],
            "podcast_brief": "Unpack the audacity of building hard tech, gigafactories, and semiconductor chips in India. Challenge the narrative on manufacturing difficulties, his intense leadership style, and his vision for Indian technological sovereignty.",
            "questions": [
                {"category": "Ice Breakers", "questions": [
                    "You left a cushy patent-generating role at Microsoft Research to book cabs on SMS. What did your parents say that week?",
                    "What is the single biggest engineering headache you face when setting up a 500-acre gigafactory?",
                    "If you could challenge any global tech CEO to an open debate, who would it be and on what topic?",
                    "What's your personal daily caffeine and sleep schedule when running three companies simultaneously?",
                    "What's the best Indian street food you miss the most from your college days at IIT Bombay?"
                ]},
                {"category": "Career & Origins", "questions": [
                    "When Uber entered India with billions in capital, how did Ola survive the brutal price war?",
                    "What was the biggest lesson from the acquisition and integration of TaxiForSure?",
                    "Why did you choose to pivot your personal energy into manufacturing electric vehicles instead of remaining purely in software?",
                    "What was the scariest moment during the early pilot tests of the Ola S1 scooter?",
                    "How did your time at Microsoft Research shape your conviction in Krutrim AI?"
                ]},
                {"category": "Business Strategy", "questions": [
                    "Why do you insist on full vertical integration—from making your own battery cells to developing your own mapping software?",
                    "How does Ola Electric compete with legacy giants like Bajaj and TVS who have 50-year-old dealership networks?",
                    "What are the unit economics of setting up an indigenous battery gigafactory in Tamil Nadu?",
                    "How does Krutrim intend to compete with OpenAI and Anthropic when they have thousands of H100 clusters?",
                    "What is your thesis on 'Technological Nationalism' and why India must own its digital infrastructure?"
                ]},
                {"category": "Startup & Bootstrapping", "questions": [
                    "How can an Indian founder raise capital for deep-tech hardware when most VCs only want to fund quick-commerce or SaaS?",
                    "What are the hardest supply chain lessons you learned when importing machinery during global trade disruptions?",
                    "Why do you believe founders should build for the next billion users in India rather than copying Silicon Valley products?",
                    "How do you manage high capital expenditure (capex) without diluting founder control?",
                    "What is your framework for product pricing in a hyper price-sensitive market like India?"
                ]},
                {"category": "Leadership & Culture", "questions": [
                    "You have a reputation for being an intense, uncompromising leader. How do you respond to criticism regarding your management style?",
                    "Why did you make the decision to have an all-women workforce at the Ola Futurefactory?",
                    "How do you divide your hours in a week between Ola Cabs, Ola Electric, and Krutrim AI?",
                    "What is the first thing you look for when hiring a Chief Technology Officer for deep tech?",
                    "How do you retain top engineering talent when global tech giants offer US dollar compensation in Bengaluru?"
                ]},
                {"category": "Technology & AI", "questions": [
                    "How close is Ola Electric to producing a 100% indigenous solid-state battery?",
                    "What makes Krutrim's foundational LLM architecture different when processing non-English Indian languages?",
                    "When will we see the first commercial vehicle running on Ola's custom Krutrim AI silicon chip?",
                    "How do you solve computer vision and autonomous driving for the chaotic traffic dynamics of Indian roads?",
                    "Why did you migrate away from Google Maps to Ola Maps, and what were the technical hurdles?"
                ]},
                {"category": "Future Trends", "questions": [
                    "Will two-wheelers in India be 100% electric by 2030, or will hybrid and ethanol fuels play a role?",
                    "How will sovereign AI data centers reshape geopolitical power between India, China, and the US?",
                    "What does the future of urban aerial mobility or autonomous flying taxis look like for congested cities?",
                    "How will renewable energy microgrids integrate directly with EV charging infrastructure?",
                    "Where do you see Ola Electric in 10 years on the global stage?"
                ]},
                {"category": "Rapid Fire", "questions": [
                    "Software engineering or hardware manufacturing?",
                    "Work-life balance or building a global superpower?",
                    "Silicon Valley or Bengaluru?",
                    "Tesla or Ola S1 Pro?",
                    "One non-negotiable principle you live by every day?"
                ]},
                {"category": "Deep & Philosophical", "questions": [
                    "What drives your restlessness to tackle mobility, energy, and AI all at the same time?",
                    "Do you ever fear catastrophic failure, and how do you compartmentalize that fear?",
                    "What does national pride mean to you when building a global corporation?",
                    "How has becoming a public company chairman changed your relationship with risk?",
                    "What is the story you want your children to tell about your contribution to India?"
                ]},
                {"category": "Contrarian & Controversial", "questions": [
                    "You recently defended the 70-hour workweek for youth. Why do you believe hustle is mandatory for developing nations?",
                    "Critics point out service and repair delays for Ola scooters. How are you fixing consumer trust issues on the ground?",
                    "Is building sovereign AI models a waste of capital when open-source models like Llama can be fine-tuned cheaply?",
                    "Why have you publicly spoken out against Western Big Tech monopolizing Indian digital sovereignty?",
                    "If you had to sacrifice two of your companies to ensure the global dominance of one, which one would you choose?"
                ]}
            ]
        }

    def _deepinder_goyal_dossier(self) -> Dict[str, Any]:
        return {
            "summary": "Deepinder Goyal is an Indian billionaire entrepreneur, co-founder and CEO of Zomato and Blinkit. An alumnus of IIT Delhi, he started Foodiebay in 2008 from his apartment, scaling it into Zomato—India's dominant food delivery and restaurant discovery giant. He orchestrated the game-changing acquisition of Blinkit, pioneering 10-minute quick commerce, and led Zomato to a blockbuster public listing and sustained operational profitability.",
            "biography": "Born in Muktsar, Punjab in 1983, Deepinder graduated with a degree in Mathematics and Computing from IIT Delhi. While working as a management consultant at Bain & Company, he noticed colleagues queuing for restaurant menu leaflets, which inspired him to scan and upload menus online as Foodiebay. Rebranded as Zomato in 2010, the company navigated cutthroat competition against Swiggy, Uber Eats, and Foodpanda. In 2021, Zomato became one of India's first tech unicorns to go public on the NSE/BSE. Deepinder subsequently acquired quick-commerce platform Blinkit for $568M, transforming it into the engine of modern urban grocery delivery.",
            "career_timeline": [
                {"year": "2005", "event": "Graduated from IIT Delhi; joined Bain & Company as a management consultant."},
                {"year": "2008", "event": "Launched Foodiebay.com to digitize restaurant menus in Delhi-NCR."},
                {"year": "2010", "event": "Rebranded Foodiebay to Zomato; secured first institutional check from Info Edge."},
                {"year": "2020", "event": "Acquired Uber Eats India in an all-stock transaction."},
                {"year": "2021", "event": "Led Zomato to a historic $1.3B IPO on the National Stock Exchange of India."},
                {"year": "2022", "event": "Acquired Blinkit, pioneering the 10-minute dark store quick commerce revolution."}
            ],
            "funding_investments": [
                {"year": "2021", "company": "Zomato IPO", "role": "Founder & CEO", "amount": "Over $1.3B raised with 38x retail subscription"},
                {"year": "2022", "company": "Blinkit Acquisition", "role": "CEO", "amount": "$568M all-stock acquisition"}
            ],
            "recent_news": [
                "Zomato crossed $25B+ market capitalization driven by explosive dark-store expansion from Blinkit.",
                "Launched 'District', a new unified app consolidating live events, ticketing, dining out, and movie bookings.",
                "Turned Zomato consolidated operations net profitable with surging free cash flow."
            ],
            "social_media_presence": "Active on X (@deepigoyal) with 600k+ followers. Known for sharing candid operational breakdowns, delivery partner safety updates, and customer feedback experiments.",
            "competitors_industry": "Food & Quick Commerce: Swiggy, Zepto, Tata BigBasket, Amazon Now.",
            "interesting_stories": [
                "Personally dresses up as a Zomato delivery partner and rides a motorcycle to deliver orders anonymously once every quarter.",
                "Struggled with stuttering as a child, which taught him deep listening and structured thinking rather than bombastic public speaking.",
                "Pioneered the 'Pure Veg Fleet' and emergency weather support systems for hundreds of thousands of gig workers."
            ],
            "future_trends": [
                "Dark stores evolving into micro-warehouses delivering electronics, cosmetics, and apparel in under 10 minutes.",
                "Drone deliveries and automated micro-fulfillment centers in tier-1 metros.",
                "Consolidation of the offline experiential economy (events, dining, festivals) via digital super-apps."
            ],
            "fast_facts": [
                "Scaled Zomato from a menu scanning blog to a $25B+ publicly traded powerhouse.",
                "Blinkit turned quick commerce from an investor joke into India's fastest-growing retail channel.",
                "Appeared as a guest shark on Shark Tank India Season 3.",
                "IIT Delhi mathematics graduate."
            ],
            "podcast_brief": "Unpack the operational genius behind 10-minute quick commerce. Explore how he weathered a 70% stock crash post-IPO to build a cash-flowing behemoth, his customer obsession, and how he manages gig worker welfare.",
            "questions": [
                {"category": "Ice Breakers", "questions": [
                    "You still ride out on a motorcycle to deliver Zomato food orders anonymously. What is the most awkward reaction a customer gave you?",
                    "What was the most stressful order day in Zomato history—was it a New Year's Eve crash or an India vs Pakistan cricket final?",
                    "What is your go-to late-night comfort meal that you order on Zomato?",
                    "You struggled with stuttering in childhood. How did that shape your communication style as a CEO?",
                    "What's one thing you bought on Blinkit that you were amazed arrived in 7 minutes?"
                ]},
                {"category": "Career & Origins", "questions": [
                    "Take us back to Bain & Company. How did watching colleagues collect paper menus trigger a billion-dollar company?",
                    "In 2015-2016 when food delivery burn was at its peak, how close was Zomato to running out of cash?",
                    "What was the conversation like with Sanjeev Bikhchandani when he wrote that first survival check for Info Edge?",
                    "How did you mentally survive the relentless competition against Swiggy, Uber Eats, and Foodpanda simultaneously?",
                    "What was the hardest firing or executive departure you had to execute during the restructuring years?"
                ]},
                {"category": "Business Strategy", "questions": [
                    "When you bought Blinkit for $568M, the public markets punished the stock and analysts called it foolish. What did you see that they didn't?",
                    "Explain the exact unit economics of a dark store: rent, density, picker algorithms, and basket size.",
                    "Why is quick commerce in India expanding rapidly into beauty, iPhone launches, and electronics while US startups like Gopuff struggled?",
                    "What is the strategic thesis behind launching the 'District' app for live events and dining?",
                    "How do you defend Zomato Gold margins without alienating restaurant partners who complain about discounting?"
                ]},
                {"category": "Startup & Bootstrapping", "questions": [
                    "What is the single most common mistake founders make when building two-sided marketplace platforms?",
                    "How do you measure product-market fit when you have to artificially subsidize both supply and demand with discounts?",
                    "What advice do you have for an early founder whose stock or valuation dropped 70%?",
                    "How do you build operational rigor in a business that relies on physical logistics rather than pure software?",
                    "What are the metrics on a P&L that you review first thing every Monday morning?"
                ]},
                {"category": "Leadership & Culture", "questions": [
                    "How do you ensure that corporate executives in Gurgaon headquarters stay connected to the reality of delivery partners on the street?",
                    "What is your philosophy on hiring and letting people go when the business pivots from hypergrowth to profitability?",
                    "How do you maintain your physical fitness and mental clarity while managing a public company scrutiny?",
                    "What was your experience as a judge on Shark Tank India—what surprised you about the new generation of founders?",
                    "How do you resolve boardroom disagreements with institutional public shareholders?"
                ]},
                {"category": "Technology & AI", "questions": [
                    "How does Zomato use machine learning to predict kitchen preparation times across 300,000 restaurant kitchens?",
                    "What role does AI route optimization play in shaving 90 seconds off a delivery partner's transit time?",
                    "Are autonomous delivery bots or drone delivery corridors feasible for Indian high-rise gated communities?",
                    "How does Blinkit use predictive inventory algorithms to ensure dark stores never run out of milk or bread during monsoon peaks?",
                    "What is your perspective on conversational AI replacing traditional search and filters on food apps?"
                ]},
                {"category": "Future Trends", "questions": [
                    "Will dark stores eventually replace traditional kirana stores and modern supermarkets in tier-1 Indian cities?",
                    "What will the restaurant industry look like in 10 years—will cloud kitchens dominate over dine-in establishments?",
                    "How will electrification of delivery fleets change the unit economics of last-mile logistics?",
                    "Can Indian consumer tech brands successfully expand their logistics playbooks into the Middle East or Southeast Asia?",
                    "What new industry will be completely disrupted by the expectation of 10-minute delivery?"
                ]},
                {"category": "Rapid Fire", "questions": [
                    "Blinkit or Zomato?",
                    "Public markets scrutiny or private venture capital pressure?",
                    "Dining out at a 5-star restaurant or ordering comfort street food at home?",
                    "One car in your garage that you love driving the most?",
                    "The single most important leadership trait in a crisis?"
                ]},
                {"category": "Deep & Philosophical", "questions": [
                    "After navigating a 70% stock crash and turning it into a $25B success, what is your definition of resilience?",
                    "Do you ever feel that business success is glorified while the personal sacrifices in family and peace are hidden?",
                    "How do you handle public media outrage when policy decisions like delivery fees or uniforms are debated online?",
                    "What is the relationship between vulnerability and strength in modern corporate leadership?",
                    "When it's all over, what do you want your life's legacy to represent?"
                ]},
                {"category": "Contrarian & Controversial", "questions": [
                    "Critics argue that 10-minute delivery is an unnecessary luxury that puts delivery partners at physical risk. How do you address that safety concern?",
                    "Many restaurant bodies accuse food aggregators of charging exorbitant 25-30% commissions. Is the restaurant-platform relationship fundamentally broken?",
                    "Why do you believe that public market quarterly earnings pressure makes companies stronger rather than short-sighted?",
                    "Is gig work a bridge to upward social mobility or an exploitative stopgap for underemployed youth?",
                    "If a competitor entered quick commerce tomorrow with $2 Billion in cash burn, how would Zomato defend its market share?"
                ]}
            ]
        }

    def _naval_ravikant_dossier(self) -> Dict[str, Any]:
        return {
            "summary": "Naval Ravikant is an Indian-American entrepreneur, angel investor, and philosopher, best known as the co-founder and former CEO of AngelList. Renowned for his timeless wisdom on wealth creation, happiness, and leverage, his seminal tweetstorm 'How to Get Rich (without getting lucky)' became a global cultural and intellectual phenomenon, later compiled into 'The Almanack of Naval Ravikant'.",
            "biography": "Born in Mumbai in 1974, Naval moved to New York City with his mother and brother at age 9, growing up in a working-class household where the public library was his sanctuary. He graduated from Dartmouth College with degrees in Computer Science and Economics. After early startup ventures including Epinions and Vast.com, he founded AngelList in 2010, democratizing startup fundraising and angel syndicates. Naval has personally invested early in more than 200 companies, including Twitter, Uber, Notion, Stack Overflow, and Postmates.",
            "career_timeline": [
                {"year": "1995", "event": "Graduated from Dartmouth College in Computer Science and Economics."},
                {"year": "1999", "event": "Co-founded consumer review site Epinions (which went public via Shopping.com)."},
                {"year": "2007", "event": "Launched Venture Hacks, a blog decoding VC term sheets and founder rights."},
                {"year": "2010", "event": "Founded AngelList, democratizing early-stage venture capital and syndicates."},
                {"year": "2018", "event": "Published the legendary 40-tweet thread 'How to Get Rich (without getting lucky)'."},
                {"year": "2020", "event": "Co-founded Airchat, exploring push-to-talk asynchronous voice communication."}
            ],
            "funding_investments": [
                {"year": "2009-2026", "company": "Angel Investments", "role": "Seed Investor", "amount": "Over 200+ investments including Uber, Twitter, Yammer, Wish, Notion, and Opensea"}
            ],
            "recent_news": [
                "The Almanack of Naval Ravikant crossed over 5 million free downloads and international translations.",
                "Advocating for decentralized computing, personal sovereignty, and AI-enabled solopreneurship.",
                "Published deep-dive meditations on consciousness, non-duality, and quantum mechanics."
            ],
            "social_media_presence": "Active on X (@naval) with 2.4M+ followers. Renowned for terse, poetic aphorisms on peace, wealth, leverage, and reading.",
            "competitors_industry": "Venture Capital, Philosophy, Podcasting.",
            "interesting_stories": [
                "Grew up reading hundreds of books in the Queens public library because his single mother worked multiple shifts to support the family.",
                "Sued early venture capitalists over investor expropriation at Epinions, creating the open-source movement for founder protection (Venture Hacks).",
                "Does not use calendars, alarms, or scheduled executive meetings, living entirely by personal internal motivation."
            ],
            "future_trends": [
                "Permissionless leverage: code and media enabling one-person billion-dollar enterprises.",
                "The decentralization of work and the decline of traditional corporations.",
                "Convergence of modern AI capabilities and ancient Eastern non-dual philosophy."
            ],
            "fast_facts": [
                "Early investor in Uber, Twitter, Notion, and Stack Overflow.",
                "Co-founder of AngelList, which processed billions in startup investments.",
                "Author of 'How to Get Rich (without getting lucky)'.",
                "Lives with zero scheduled meetings or daily alarm clocks."
            ],
            "podcast_brief": "A contemplative masterclass on specific knowledge, permissionless leverage, freedom, and the art of peace. Unpack how to build extreme wealth while maintaining a calm, unhurried mind.",
            "questions": [
                {"category": "Ice Breakers", "questions": [
                    "You famously do not keep a calendar and don't take scheduled meetings. How did you structure your day today?",
                    "What was the first book in the Queens public library that completely rewired your brain?",
                    "If you were stripped of all your wealth and assets, but kept all your memories, how long would it take you to become wealthy again?",
                    "What is one piece of common startup advice that you believe is completely toxic?",
                    "What does a truly free morning feel like to you?"
                ]},
                {"category": "Career & Origins", "questions": [
                    "Growing up as an immigrant in New York, what was the moment you realized that working for an hourly wage would never make you free?",
                    "What was the emotional toll of the Epinions lawsuit, and why did you decide to blow the whistle on VC malpractices?",
                    "How did AngelList start—was it just a simple email newsletter before it became a software platform?",
                    "What was your biggest angel investment mistake—the billion-dollar company you passed on because you were overthinking?",
                    "How did your perspective on ambition change between your 20s in Silicon Valley and your 40s?"
                ]},
                {"category": "Business Strategy", "questions": [
                    "Explain the concept of 'Permissionless Leverage' to someone who is currently trapped in a corporate 9-to-5 job.",
                    "Why do you state that code and media are the new forms of leverage that created the modern tech elite?",
                    "How does an individual find their 'Specific Knowledge' that cannot be taught in a school or automated by an AI?",
                    "Why is judgment more valuable than hard work in a leveraged environment?",
                    "What is your framework for choosing business partners and deciding who to trust?"
                ]},
                {"category": "Startup & Bootstrapping", "questions": [
                    "Why do you believe the traditional corporation is an unnatural byproduct of industrial-age coordination problems?",
                    "How will AI agents enable the world's first one-person unicorn business?",
                    "What is the difference between product-market fit and founder-product fit?",
                    "Why do most angel investors lose money, and what makes the top 1% of seed investors asymmetric?",
                    "How should a founder price equity versus control in the early rounds?"
                ]},
                {"category": "Leadership & Culture", "questions": [
                    "How do you lead organizations when you despise bureaucracy and status meetings?",
                    "What is your definition of an 'A-player' and why should companies have small, high-density teams?",
                    "How do you train yourself to be ruthlessly honest without being unnecessarily cruel?",
                    "What habits do you practice to maintain mental clarity when markets are collapsing around you?",
                    "How do you protect your time from the infinite distractions of the internet?"
                ]},
                {"category": "Technology & AI", "questions": [
                    "Is AI the ultimate form of leverage, and what happens to labor markets when intelligence becomes practically free?",
                    "Do you believe AGI will develop consciousness, or is computation fundamentally distinct from awareness?",
                    "Why are you an advocate for open-source AI models over closed corporate walled gardens?",
                    "How does decentralized cryptography (Bitcoin) balance the centralizing power of artificial intelligence?",
                    "What technological frontier excites you more than AI right now?"
                ]},
                {"category": "Future Trends", "questions": [
                    "Will human beings work fewer hours in the next 30 years, or will the hedonic treadmill keep us perpetually occupied?",
                    "What happens to nation-states when high-net-worth sovereign individuals can relocate anywhere with digital passports?",
                    "How will personalized AI tutors change child education and the necessity of elite universities?",
                    "What will longevity and healthspan breakthroughs do to human psychological time horizons?",
                    "Will civilization become more local or more globalized by 2050?"
                ]},
                {"category": "Rapid Fire", "questions": [
                    "Peace or Happiness?",
                    "Reading 100 books once, or reading the top 5 books 20 times?",
                    "Code or Media?",
                    "Bitcoin or Gold?",
                    "One sentence that sums up your life philosophy?"
                ]},
                {"category": "Deep & Philosophical", "questions": [
                    "You said: 'Desire is a contract you make with yourself to be unhappy until you get what you want.' How do you reconcile ambition with peace?",
                    "What is consciousness, and why do you spend so much time studying non-duality and meditation?",
                    "How do you face the reality of death without succumbing to existential dread?",
                    "What does love mean when you strip away evolutionary psychology and societal conditioning?",
                    "If you could whisper one piece of advice into the ear of every human being on earth right now, what would you say?"
                ]},
                {"category": "Contrarian & Controversial", "questions": [
                    "Why do you believe modern politics is a zero-sum status game that intelligent people should avoid?",
                    "Is modern schooling designed to create obedient factory workers rather than sovereign thinkers?",
                    "Why do you claim that 99% of effort in business is wasted, and only the 1% compound effort matters?",
                    "Do you believe that meritocracy is real, or is extreme wealth largely a function of lucky timing in an asymmetric market?",
                    "If society stripped away all digital technology tomorrow, would human happiness increase or decrease?"
                ]}
            ]
        }

    def _dynamic_guest_dossier(self, name: str, company: str = None) -> Dict[str, Any]:
        return self.dossier_engine.generate_dossier(name, company)
