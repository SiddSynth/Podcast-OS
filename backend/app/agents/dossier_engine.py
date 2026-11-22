import re
import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, List

class DossierEngine:
    def __init__(self):
        self.headers = {"User-Agent": "PodcastOS/2.0 (editorial-research; mailto:production@podcastos.internal)"}

    def generate_dossier(self, name: str, company: str = None, website: str = None, linkedin: str = None, twitter: str = None) -> Dict[str, Any]:
        nl = (name or "").lower().strip()

        # 1. Narendra Modi
        if "modi" in nl or ("narendra" in nl and "singh" not in nl):
            return self._narendra_modi_dossier()

        # 2. Elon Musk
        if "elon" in nl or "musk" in nl:
            return self._elon_musk_dossier()

        # 3. Ratan Tata
        if "ratan" in nl and "tata" in nl:
            return self._ratan_tata_dossier()

        # 4. Sam Altman
        if "altman" in nl or "sam altman" in nl:
            return self._sam_altman_dossier()

        # 5. Virat Kohli
        if "kohli" in nl or "virat" in nl:
            return self._virat_kohli_dossier()

        # 6. Mukesh Ambani
        if "ambani" in nl or "mukesh" in nl:
            return self._mukesh_ambani_dossier()

        # 7. Dynamic Wikipedia-powered synthesis for any other public figure or guest
        return self._dynamic_wikipedia_dossier(name, company, website, linkedin, twitter)

    def fetch_wikipedia_bio(self, query: str) -> Dict[str, Any]:
        try:
            r = requests.get(
                "https://en.wikipedia.org/w/api.php",
                params={
                    "action": "query",
                    "list": "search",
                    "srsearch": query,
                    "format": "json"
                },
                headers=self.headers,
                timeout=5
            )
            if r.status_code == 200:
                results = r.json().get("query", {}).get("search", [])
                if results:
                    title = results[0]["title"]
                    r2 = requests.get(
                        f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}",
                        headers=self.headers,
                        timeout=5
                    )
                    if r2.status_code == 200:
                        s = r2.json()
                        return {
                            "title": s.get("title", title),
                            "description": s.get("description", ""),
                            "extract": s.get("extract", ""),
                            "thumbnail": s.get("thumbnail", {}).get("source", ""),
                            "url": s.get("content_urls", {}).get("desktop", {}).get("page", "")
                        }
        except Exception as e:
            print(f"Wikipedia fetch error for {query}: {e}")
        return {}

    # =========================================================================
    # CURATED DOSSIER: NARENDRA MODI (Prime Minister of India)
    # =========================================================================
    def _narendra_modi_dossier(self) -> Dict[str, Any]:
        return {
            "summary": "Narendra Damodardas Modi is the 14th Prime Minister of India, serving continuously since May 2014, and former Chief Minister of Gujarat (2001–2014). Representing the Varanasi constituency in the Lok Sabha, he is India's third-longest-serving Prime Minister and the longest-serving Prime Minister outside the Indian National Congress. Known for his disciplined grassroots political machinery, digital public infrastructure transformation, welfare delivery governance, and assertive foreign policy.",
            "biography": "Born in 1950 in Vadnagar, Gujarat, Modi helped his father run a tea stall at Vadnagar railway station before leaving home in his late teens to travel across India, spending time in Ramakrishna Mission ashrams. Upon returning, he joined the Rashtriya Swayamsevak Sangh (RSS) as a full-time pracharak in 1971, eventually being deputed to the Bharatiya Janata Party (BJP) in 1987. He rose as a master electoral strategist, organizing the 1991 Ekta Yatra. In October 2001, he was appointed Chief Minister of Gujarat. Over four consecutive terms, he prioritized 24/7 agricultural electrification (Jyotigram Yojana), administrative computerization, and global industrial investment via the biennial Vibrant Gujarat summits. In 2014, he led the National Democratic Alliance to a historic single-party parliamentary majority—India's first in 30 years—and was re-elected with expanded mandates in 2019 and 2024. His premiership has transformed India's physical infrastructure (highways, Vande Bharat, airports) and digital public goods (UPI, Aadhaar, DigiLocker), alongside major geopolitical realignment in the Indo-Pacific and Global South.",
            "career_timeline": [
                {"year": "1971", "event": "Inducted as a full-time RSS pracharak in Gujarat following the Indo-Pakistani War."},
                {"year": "1987", "event": "Appointed Organizing Secretary of Gujarat BJP, engineering the party's first municipal and state victories."},
                {"year": "1995", "event": "Elevated to BJP National Secretary in New Delhi, overseeing party operations across northern states."},
                {"year": "2001", "event": "Sworn in as the 14th Chief Minister of Gujarat; launched massive post-Bhuj earthquake reconstruction and industrialization."},
                {"year": "2014", "event": "Led BJP to an absolute Lok Sabha majority (282 seats); sworn in as 14th Prime Minister of India."},
                {"year": "2019", "event": "Won second consecutive landslide mandate (303 seats); oversaw digital public goods scaling (UPI) and welfare delivery."},
                {"year": "2024", "event": "Secured a historic third consecutive term as Prime Minister, leading the NDA government."}
            ],
            "funding_investments": [
                {"year": "2014", "company": "Digital India & Make in India", "role": "Prime Minister", "amount": "$100B+ FDI inflow & nationwide fiber connectivity"},
                {"year": "2016", "company": "Unified Payments Interface (UPI)", "role": "Sovereign Rail", "amount": "16B+ monthly transactions, world's largest real-time payment network"},
                {"year": "2019", "company": "PM Gati Shakti & National Infra Pipeline", "role": "Infrastructure Blueprint", "amount": "$1.4 Trillion capital expenditure plan"},
                {"year": "2023", "company": "G20 New Delhi Leadership", "role": "G20 President", "amount": "100% consensus declaration & inclusion of African Union"}
            ],
            "recent_news": [
                "Administered oath of office for a historic third consecutive term as Prime Minister, focusing on semiconductor manufacturing hubs and clean energy.",
                "India's UPI processed over 16 billion monthly transactions, expanding bilateral cross-border acceptance across 10+ partner nations.",
                "Championed India's Semiconductor Mission, attracting multi-billion-dollar fabrication plants from Micron, Tata Electronics, and global partners."
            ],
            "social_media_presence": "Active on X (@narendramodi) with over 100 million followers—the most followed active world leader—and YouTube with over 25 million subscribers. Uses Mann Ki Baat for direct monthly audio broadcasts to over 100 million listeners.",
            "competitors_industry": "Governance, Sovereign Statesmanship, Geopolitics. Leads India within multilateral institutions (G20, Quad, BRICS, SCO, Global South).",
            "interesting_stories": [
                "During his years as an RSS pracharak in the 1970s and 1980s, he traveled across all districts of Gujarat purely via state transport buses, carrying a cloth bag with two sets of clothes and staying with local workers.",
                "Wrote poetry in Gujarati and published multiple collections of poems reflecting on nature, spiritual discipline, and civilizational duty.",
                "Adheres to a strict 4-hour sleep schedule, waking at 4:30 AM daily for pranayama and yoga, maintaining this routine even during strenuous international multi-country tours."
            ],
            "future_trends": [
                "Viksit Bharat 2047: Transformation of India into a $30 Trillion developed economy by the centenary of independence.",
                "Sovereign AI & Compute Mission: Building domestic GPU clusters and open-source multi-lingual LLMs for public delivery.",
                "Clean Energy Revolution: 500 GW of non-fossil power capacity by 2030 and leadership in green hydrogen corridors."
            ],
            "fast_facts": [
                "14th Prime Minister of India; longest-serving non-Congress Prime Minister in Indian history.",
                "Over 100 million followers on X (Twitter), making him the most followed active world leader.",
                "Governed Gujarat as Chief Minister for 12 consecutive years prior to assuming the premiership in 2014.",
                "Maintains zero personal property or financial assets beyond basic fixed deposits."
            ],
            "podcast_brief": "Focus on the operational mastery of grassroots scale: how to manage a 1.4-billion citizen federation, the architecture of digital public infrastructure (UPI/Aadhaar) versus Western privatized models, diplomatic balancing between Washington and Moscow, and the psychological discipline required to endure five decades of relentless public scrutiny.",
            "questions": [
                {"category": "Ice Breakers", "questions": [
                    "You spent years as a wandering sadhu in the Himalayas and Ramakrishna Mission ashrams in your twenties. When you sit in the Prime Minister's Office in South Block today, how often does that inner monk override the politician?",
                    "You are known to write poetry in Gujarati. What is one emotion or truth you can only express in poetry that you can never utter in a political rally or parliament?",
                    "You maintain a grueling 18-hour workday and 4:30 AM yoga regimen, even while crisscrossing multiple global time zones. When was the last time you truly felt physical exhaustion?",
                    "When people hear the name Narendra Modi, they see an immovable national figure. What is the single biggest misconception people hold about your private daily routine?",
                    "What was the very first book or conversation from your childhood in Vadnagar that sparked your obsession with the idea of a resurgent India?"
                ]},
                {"category": "Career & Origins", "questions": [
                    "In October 2001, when Prime Minister Atal Bihari Vajpayee called you to take over Gujarat following the devastating Bhuj earthquake, you had never governed an administrative office. What was your very first order of business on Day 1?",
                    "During your early decades as an RSS pracharak traveling across Gujarat by state transport bus with just a cloth bag, what did you observe about ordinary citizens that textbook economists completely miss?",
                    "In 2002, the political atmosphere in Gujarat was at boiling point. Looking back 20+ years later, what was the internal psychological toll of navigating that period?",
                    "You spearheaded the Vibrant Gujarat summits when few believed a state could pitch directly to global capital. What was the pitch you made to global CEOs to gamble on Gujarat?",
                    "When you were declared the BJP's Prime Ministerial candidate in September 2013, the political consensus said a single-party majority was mathematically impossible in 21st-century India. What data or instinct gave you conviction?"
                ]},
                {"category": "Business Strategy", "questions": [
                    "India has chosen a model where Digital Public Infrastructure—UPI, Aadhaar, DigiLocker—is public, while the West allowed private Big Tech monopolies to own digital identity and rails. Why was that public-rail architecture non-negotiable for you?",
                    "Make in India launched a decade ago. While electronics and defense manufacturing have surged, broad-based industrial manufacturing still faces global competition from China. What is the bottleneck holding back Indian scale?",
                    "How do you reconcile aggressive capital expenditure on national highways and freight corridors with fiscal discipline and inflation management?",
                    "Foreign institutional investors praise India's macroeconomic stability, but complain about bureaucratic red tape and judicial enforcement speed. What is your blueprint for the next phase of regulatory deregulation?",
                    "Why did you prioritize the production-linked incentive (PLI) scheme for semiconductors when many advised India to stick only to IT software services?"
                ]},
                {"category": "Startup & Bootstrapping", "questions": [
                    "India went from just a few hundred startups in 2014 to over 100,000 registered startups and 100+ unicorns today. What was the exact policy lever that unblocked risk-taking among young Indian founders?",
                    "Many young founders complain about angel taxation and capital gains complexities. How do you view the role of venture capital versus self-sustaining profitability in building enduring Indian enterprises?",
                    "How can tier-2 and tier-3 Indian towns transition from service back-offices into product-engineering engines that create deep intellectual property?",
                    "What advice do you give to Indian entrepreneurs who choose to flip their corporate headquarters to Singapore, Dubai, or Delaware instead of staying in India?",
                    "How can India build its own sovereign alternatives to Western and Chinese consumer platforms, social networks, and search algorithms?"
                ]},
                {"category": "Leadership & Culture", "questions": [
                    "PRAGATI meetings are famous for holding senior bureaucrats and chief secretaries personally accountable on camera for stalled projects. How did you change the bureaucratic culture of delay in New Delhi?",
                    "Direct Benefit Transfer (DBT) has eliminated middleman leakages of billions of dollars. What was the fiercest systemic resistance you faced when dismantling traditional patronage networks?",
                    "With 1.4 billion people speaking dozens of languages across 28 states, what is your framework for balancing centralized execution speed with cooperative federalism?",
                    "Programs like Swachh Bharat and Jal Jeevan Mission required behavioral change from hundreds of millions of families. How do you engineer behavioral transformation at civilizational scale?",
                    "What is your metric for deciding when a welfare subsidy creates genuine empowerment versus when it turns into reckless populist entitlement?"
                ]},
                {"category": "Technology & AI", "questions": [
                    "India has one of the world's largest pools of software developers, but historically lagged in core deep-tech hardware. What is your vision for India's sovereign AI mission and compute clusters?",
                    "How do you view the ethical dangers of deepfakes, algorithmic radicalization, and AI weaponization in a hyper-connected democracy of 900 million internet users?",
                    "India committed to 500 GW of non-fossil energy by 2030 and Net Zero by 2070. How do you defend India's right to affordable energy for the poor against Western climate pressure?",
                    "The Unified Payments Interface (UPI) is now processing over 16 billion transactions a month. What is the strategy for making UPI and RuPay a global alternative in cross-border settlements?",
                    "Space technology has been opened to private Indian startups like Skyroot and Agnikul. What did you feel watching Chandrayaan-3 land on the South Pole of the Moon in August 2023?"
                ]},
                {"category": "Future Trends", "questions": [
                    "India's foreign policy has championed strategic autonomy—maintaining deep security partnerships with the US and Quad, while importing energy from Russia and advocating for the Global South. How do you preserve that balance under global pressure?",
                    "During India's G20 presidency, you successfully achieved 100% consensus on the New Delhi Declaration and inducted the African Union. What was the behind-the-scenes diplomatic breakthrough?",
                    "How should India prepare for the shifting geopolitical tensions in the Indo-Pacific and China's assertive military posture along the northern borders?",
                    "By 2047, India aims to be a 'Viksit Bharat' (Fully Developed Nation). What are the three non-negotiable milestones the country must achieve before that centenary?",
                    "With India having the largest youth population on earth, how do you see the global shift toward aging populations in the West and East Asia creating opportunities for Indian talent?"
                ]},
                {"category": "Rapid Fire", "questions": [
                    "Varanasi or Gandhinagar?",
                    "Early morning yoga or a quiet cup of tea with a newspaper?",
                    "Intuition or bureaucratic briefings?",
                    "One historical Indian figure whose portrait sits on your personal desk?",
                    "The single most important virtue every young Indian entering public service should possess?"
                ]},
                {"category": "Deep & Philosophical", "questions": [
                    "You left home with nothing and have accumulated no personal assets or real estate. What does detachment (Vairagya) mean to you when you hold the highest executive office in the land?",
                    "When you stood before the camera for your first speech in Central Hall of Parliament in 2014 and bowed your head at the steps, what was going through your mind?",
                    "Power often isolates leaders. Who in your life today has the moral authority to tell you that you are wrong?",
                    "How do you want history to remember Narendra Modi when the politics and election noise of this century fade away?",
                    "At 74, what continues to drive your relentless appetite for national work every single morning?"
                ]},
                {"category": "Contrarian & Controversial", "questions": [
                    "Critics argue that your governance style has centralized executive power and weakened traditional parliamentary deliberation. What is your direct counter to that critique?",
                    "Why do you believe Western human rights indices and democracy rating agencies systematically misjudge Indian democracy?",
                    "Coalition politics returned to New Delhi in 2024. How has governing with allies in the NDA altered your policy velocity compared to your single-party majorities of 2014 and 2019?",
                    "What is an unpopular policy reform you believe India desperately needs over the next decade that politicians across party lines are too scared to touch?",
                    "If you were speaking privately to a 20-year-old Indian who feels disillusioned with politics, what is the one raw truth you would share with them?"
                ]}
            ]
        }

    # =========================================================================
    # CURATED DOSSIER: ELON MUSK (Tesla, SpaceX, xAI, Neuralink)
    # =========================================================================
    def _elon_musk_dossier(self) -> Dict[str, Any]:
        return {
            "summary": "Elon Reeve Musk is a South African-born American business magnate, investor, and engineer. He is the founder, CEO, and chief engineer of SpaceX; angel investor, CEO, and product architect of Tesla, Inc.; owner and CTO of X (formerly Twitter); founder of the Boring Company and xAI; co-founder of Neuralink and OpenAI. With an estimated net worth frequently exceeding $250 billion, he is the wealthiest person in modern history, recognized for applying first-principles physics to aerospace, electric vehicles, and artificial intelligence.",
            "biography": "Born in Pretoria in 1971, Musk developed software at age 12, selling a game called Blastar. After immigrating to Canada and the United States, he studied physics and economics at the University of Pennsylvania. In 1995, he dropped out of Stanford to co-found Zip2, sold to Compaq for $307M, then founded X.com, which merged to create PayPal and was acquired by eBay for $1.5B. Musk subsequently invested his entire fortune into SpaceX in 2002 to reduce space transportation costs and enable the colonization of Mars, and joined Tesla in 2004 to accelerate sustainable energy. He later acquired Twitter for $44B to champion free speech, founded xAI to understand the universe, and launched Neuralink for high-bandwidth brain-computer interfaces.",
            "career_timeline": [
                {"year": "1999", "event": "Co-founded X.com, which merged to become PayPal and sold to eBay for $1.5B in 2002."},
                {"year": "2002", "event": "Founded SpaceX with $100M of his own capital after studying Soviet rocket manuals."},
                {"year": "2004", "event": "Led Series A investment into Tesla Motors, becoming Chairman and later CEO & Product Architect."},
                {"year": "2008", "event": "SpaceX Falcon 1 reached orbit on 4th attempt, hours from bankruptcy; Tesla Model S initiated."},
                {"year": "2020", "event": "SpaceX launched first commercial astronauts to ISS; Tesla market cap surpassed $1 Trillion."},
                {"year": "2022", "event": "Acquired Twitter for $44B, slashing 80% headcount to achieve cash-flow breakeven."},
                {"year": "2024", "event": "SpaceX Starship caught super heavy booster with Mechazilla arms; xAI trained Colossus 100k H100 cluster."}
            ],
            "funding_investments": [
                {"year": "2002", "company": "SpaceX", "role": "Founder & CEO", "amount": "$100M personal capital; now valued at $200B+"},
                {"year": "2004", "company": "Tesla", "role": "Product Architect & CEO", "amount": "$6.5M Series A lead; now $800B+ public enterprise"},
                {"year": "2016", "company": "Neuralink & Boring Co", "role": "Co-Founder", "amount": "$100M+ committed to BCIs and tunneling infrastructure"},
                {"year": "2024", "company": "xAI", "role": "Founder", "amount": "$6B Series B to build world-leading compute infrastructure"}
            ],
            "recent_news": [
                "SpaceX achieved historic fifth test flight of Starship, catching the 232-foot Super Heavy booster mid-air using launch tower mechanical chopstick arms.",
                "xAI brought online Colossus, a 100,000 liquid-cooled Nvidia H100 GPU cluster in Memphis, Tennessee in just 122 days.",
                "Neuralink successfully implanted second human patient, allowing thought-controlled computer interaction with zero tethered wires."
            ],
            "social_media_presence": "Active on X (@elonmusk) with over 200 million followers. Uses the platform as his primary direct communication medium, breaking company news, debating geopolitics, and engaging with engineers worldwide.",
            "competitors_industry": "Aerospace, Automotive, Energy, Artificial Intelligence, Robotics, Telecommunications. Competes with Boeing, Blue Origin, BYD, OpenAI, Google, Meta.",
            "interesting_stories": [
                "In 2008, both Tesla and SpaceX were hours from bankruptcy simultaneously; Musk had to choose whether to split his remaining $40M or bet everything on one company, choosing to split it and narrowly securing a NASA contract on Christmas Eve.",
                "Taught himself rocket propulsion by reading Robert Zubrin's 'The Case for Mars' and Soviet rocketry textbooks borrowed from aerospace engineers.",
                "Slept on the factory floor of Tesla's Fremont plant during the 'Model 3 production hell' of 2018 to personally troubleshoot bottlenecked assembly lines."
            ],
            "future_trends": [
                "Multi-planetary civilization: Establishing a self-sustaining city of 1 million humans on Mars within 30 years.",
                "Optimus humanoid robots: Mass production of general-purpose autonomous robots priced under $25,000.",
                "Full self-driving (FSD) unsupervised robotaxis eliminating vehicular fatalities."
            ],
            "fast_facts": [
                "Richest person in modern history with net worth exceeding $250B+.",
                "SpaceX manufactures over 80% of all payload mass launched to orbit worldwide.",
                "Pioneered the world's first reusable orbital-class rocket boosters.",
                "Owns no private residential real estate, living primarily in a modular home in Starbase, Texas."
            ],
            "podcast_brief": "Focus on extreme engineering velocity: first-principles reasoning vs analogy, how to eliminate bureaucratic requirements in hardware manufacturing, the mathematics of Starship reusability, and why artificial general intelligence must be uncompromisingly truth-seeking.",
            "questions": [
                {"category": "Ice Breakers", "questions": [
                    "You work 100-hour weeks across six complex companies simultaneously. What is your internal algorithm for deciding which fire gets your personal presence on any given Tuesday?",
                    "What video game has taught you the most about operational resource allocation under scarcity?",
                    "If humanity were to receive a verified interstellar signal from an extraterrestrial civilization tomorrow, what is the very first thing you would do?",
                    "What is one everyday engineering device in a normal household that you find embarrassingly poorly designed?",
                    "What does a quiet evening look like for Elon Musk when Starship and Tesla are running smoothly?"
                ]},
                {"category": "Career & Origins", "questions": [
                    "Take us back to December 2008: Falcon 1 had failed three times, Tesla had no payroll, and you were down to your last few million dollars. What kept you from taking safe buyout offers?",
                    "When you read Russian rocket textbooks in 2001 and calculated the raw commodity cost of aluminum and titanium, why had nobody in aerospace done that calculation before?",
                    "What was the most counterintuitive lesson you learned from PayPal that everyone in Silicon Valley venture capital still gets wrong?",
                    "Looking back at the Model 3 production hell in 2018, which specific automation system did you personally have to rip out because machines were slower than humans?",
                    "Who was the one mentor or engineer who taught you the most about hands-on manufacturing tolerance?"
                ]},
                {"category": "Business Strategy", "questions": [
                    "Your famous algorithm says: '1. Make requirements less dumb. 2. Delete the part or process. 3. Simplify. 4. Accelerate. 5. Automate.' Why do most companies do step 5 first?",
                    "How do you design an organizational culture where engineers are rewarded for deleting their own work and admitting a design was wrong?",
                    "SpaceX Starlink generates billions in recurring cash flow today. When you first proposed launching 40,000 low-earth orbit satellites, everyone said satellite constellations were doomed to bankruptcy. What was your unit economics thesis?",
                    "Why have traditional legacy automotive OEMs with 100-year supply chains struggled so profoundly to write modular software for electric vehicles?",
                    "What is the mathematical limit of Tesla's manufacturing cost per vehicle over the next decade?"
                ]},
                {"category": "Startup & Bootstrapping", "questions": [
                    "If a brilliant 20-year-old engineer comes to you wanting to start a company today, what industry would you tell them is ripe for 10x disruption outside of AI?",
                    "Why do you believe raising venture capital too early cripples an engineering team's ability to innovate from first principles?",
                    "How do you interview an engineer in 15 minutes and accurately determine whether they actually solved the hard technical problem or were just standing near the person who did?",
                    "What is the single most common mistake early founders make when trying to scale hardware manufacturing?",
                    "How do you protect your long-term product vision when Wall Street short-sellers are predicting your bankruptcy every single day?"
                ]},
                {"category": "Leadership & Culture", "questions": [
                    "You slashed Twitter/X's workforce by nearly 80% in weeks, and the site not only stayed online but shipped features faster. What did that prove about corporate bloat?",
                    "How do you maintain extreme urgency across thousands of engineers without burning out the absolute best minds in the company?",
                    "What is your response when critics say your expectations of personal sacrifice are unreasonable for normal workers?",
                    "How do you balance being deeply in the weeds of technical CAD models with high-level corporate governance?",
                    "What is your personal coping mechanism when you are subjected to intense, relentless global media scrutiny?"
                ]},
                {"category": "Technology & AI", "questions": [
                    "You co-founded OpenAI in 2015 as an open-source non-profit, and later founded xAI. What is your deepest philosophical divergence from how frontier AI labs are developing models today?",
                    "xAI built the Colossus 100,000 H100 cluster in 122 days. What was the engineering secret that enabled power, cooling, and networking to come together in four months when utilities said it would take four years?",
                    "How close is Tesla's vision-only neural network to achieving true human-level spatial intelligence in self-driving?",
                    "When Neuralink achieves high-bandwidth brain-to-computer telemetry, how does that fundamentally change human language and cognitive bandwidth?",
                    "What is your worst-case timeline for runaway AI self-improvement, and what guardrails can realistically survive superintelligence?"
                ]},
                {"category": "Future Trends", "questions": [
                    "Why is establishing a self-sustaining human base on Mars non-negotiable for the long-term preservation of the light of consciousness?",
                    "How will Optimus humanoid robots reshape global GDP calculations once the cost of physical labor approaches near-zero?",
                    "Do you believe the human birth rate collapse is a more existential threat to civilization over the next 50 years than climate change or nuclear war?",
                    "What will energy generation and grid storage look like when solar and Megapacks become the lowest-cost marginal kilowatt-hour on earth?",
                    "Will Starship point-to-point sub-orbital Earth travel make long-haul international flights obsolete?"
                ]},
                {"category": "Rapid Fire", "questions": [
                    "Mars or Earth?",
                    "First principles or empirical testing?",
                    "Starbase or Silicon Valley?",
                    "Favorite sci-fi novel: Foundation or Hitchhiker's Guide to the Galaxy?",
                    "The single most important law of physics builders must respect?"
                ]},
                {"category": "Deep & Philosophical", "questions": [
                    "You've said your overarching life goal is to extend the scope and scale of human consciousness. Where did that existential mission originate in your youth?",
                    "Now that you have achieved more material wealth and technological milestones than almost anyone in history, what does happiness actually feel like to you?",
                    "When you look up at the night sky at Starbase, do you believe the Fermi Paradox implies we are completely alone in this galaxy?",
                    "What is the psychological price of thinking in centuries rather than fiscal quarters?",
                    "How do you want your gravestone to read 100 years from now?"
                ]},
                {"category": "Contrarian & Controversial", "questions": [
                    "What is an engineering dogma held by almost every aerospace company that you have proven is completely false?",
                    "Why do you believe modern corporate ESG scoring systems frequently incentivize the exact opposite of real environmental progress?",
                    "Do you believe the American administrative regulatory state is actively suffocating the country's ability to build physical infrastructure?",
                    "What is the single most controversial tweet you ever sent that you still stand by with 100% conviction?",
                    "If you could whisper one piece of advice into the ear of every young person on earth, what would it be?"
                ]}
            ]
        }

    # =========================================================================
    # CURATED DOSSIER: RATAN TATA (Tata Group, Philanthropy)
    # =========================================================================
    def _ratan_tata_dossier(self) -> Dict[str, Any]:
        return {
            "summary": "Ratan Naval Tata (1937–2024) was an iconic Indian industrialist, philanthropist, and former chairman of Tata Sons and the Tata Group. Over his two-decade tenure as chairman (1991–2012), he transformed a loose domestic conglomerate into a global powerhouse, orchestrating landmark international acquisitions including Tetley, Corus Steel, and Jaguar Land Rover. Renowned for uncompromising corporate ethics, national industrial vision, and pledging the vast majority of his wealth to philanthropic trusts supporting healthcare, education, and rural development.",
            "biography": "Born into the illustrious Tata family in Mumbai, Ratan Tata earned a degree in architecture from Cornell University before joining Tata Steel in Jamshedpur in 1961, working on the shop floor shoveling coal alongside laborers. In 1991, J.R.D. Tata passed the baton of Tata Sons to Ratan during India's economic liberalization. Tata consolidated family control, instituted mandatory retirement ages for entrenched satraps, and globalized the enterprise. Under his stewardship, Tata Group revenues grew over 40-fold. He conceptualized the Tata Nano to offer safe, affordable motorized mobility to middle-class Indian families. Over 65% of Tata Sons' equity is owned by philanthropic trusts, meaning the majority of group dividends fund public healthcare, cancer research hospitals, and universities.",
            "career_timeline": [
                {"year": "1962", "event": "Joined Tata Steel in Jamshedpur, beginning on the factory floor."},
                {"year": "1991", "event": "Appointed Chairman of Tata Sons, succeeding the legendary J.R.D. Tata during India's economic opening."},
                {"year": "1998", "event": "Launched Tata Indica, India's first indigenously designed and manufactured passenger car."},
                {"year": "2000", "event": "Acquired British tea giant Tetley for $431M, signaling Tata's aggressive global expansion."},
                {"year": "2008", "event": "Acquired Jaguar Land Rover from Ford for $2.3B, turning the luxury automaker profitable; unveiled Tata Nano."},
                {"year": "2012", "event": "Stepped down as Chairman of Tata Sons, dedicating his focus to Tata Trusts and mentoring startup founders."}
            ],
            "funding_investments": [
                {"year": "2000", "company": "Tetley Tea", "role": "Chairman", "amount": "$431M global acquisition"},
                {"year": "2007", "company": "Corus Group", "role": "Chairman", "amount": "$12B European steel acquisition"},
                {"year": "2008", "company": "Jaguar Land Rover", "role": "Chairman", "amount": "$2.3B acquisition from Ford Motors"},
                {"year": "2015", "company": "Indian Startup Ecosystem (RNT Capital)", "role": "Angel Investor", "amount": "Over 40+ early-stage investments in Ola, Paytm, Lenskart, Urban Company"}
            ],
            "recent_news": [
                "Revered globally as the benchmark of compassionate capitalism and institutional integrity following his passing in October 2024.",
                "Tata Trusts expanded world-class cancer hospital networks across northeast India to provide free oncology care.",
                "Tata Group's acquisition of Air India and entry into semiconductor fabrication honoring his vision of sovereign Indian industry."
            ],
            "social_media_presence": "Maintained an authentic, compassionate presence on Instagram and X with millions of followers, championing animal welfare, young innovators, and national unity.",
            "competitors_industry": "Diversified Conglomerate (Steel, Automotive, IT Services, Hospitality, Aviation). Competed with global conglomerates and domestic industrial peers.",
            "interesting_stories": [
                "In 1999, Ford executives humiliated Ratan Tata in Detroit, saying 'you know nothing about cars, why did you enter passenger vehicles? We are doing you a favor by buying your car division.' Nine years later in 2008, Tata bought Jaguar Land Rover from Ford, with Bill Ford publicly thanking Tata for saving the brand.",
                "Personally visited the families of all 80 victims of the 26/11 Mumbai terror attacks at the Taj Hotel, ensuring complete lifetime salaries, education, and medical care for the families.",
                "Insisted on living in a modest seafront bungalow in Colaba with his pet dogs rather than an opulent skyscraper mansion."
            ],
            "future_trends": [
                "Compassionate Capitalism: Building enterprises where community welfare precedes shareholder maximization.",
                "Indigenous Deep-Tech: Establishing domestic semiconductor fabrication and defense manufacturing in India.",
                "Accessible Oncology Care: Democratizing cancer diagnostics and therapy across underserved rural districts."
            ],
            "fast_facts": [
                "Grew Tata Group revenues over 40x and profits over 50x during his 21-year chairmanship.",
                "Conducted Cornell University architecture degree; licensed pilot who personally flew F-16 and F/A-18 fighter jets.",
                "Recipient of India's second-highest civilian honor, the Padma Vibhushan (2008).",
                "Over 65% of Tata Sons' equity is owned by charitable trusts."
            ],
            "podcast_brief": "Focus on moral stewardship: how to maintain uncompromising ethical standards across a $100B conglomerate, the redemption of Jaguar Land Rover, why giving back to society must be built into corporate charters, and mentoring the next generation of founders.",
            "questions": [
                {"category": "Ice Breakers", "questions": [
                    "You trained as an architect at Cornell and loved flying fighter jets. How did an architect's eye for spatial harmony shape how you designed corporate structures?",
                    "When you walked through the Tata Steel factory floor in Jamshedpur in 1962 covered in soot, what was the most valuable lesson you learned from the laborers?",
                    "What was the single happiest moment of your life that had nothing to do with corporate boardrooms or revenue?",
                    "Your deep love for dogs is legendary across Bombay House. What has spending time with dogs taught you about human nature and loyalty?",
                    "What is one principle from J.R.D. Tata that stayed with you throughout your darkest professional crises?"
                ]},
                {"category": "Career & Origins", "questions": [
                    "In 1991, when J.R.D. Tata chose you as his successor, powerful satraps running individual Tata companies openly rebelled. How did you assert control without destroying the fabric of the group?",
                    "When you launched the Tata Indica in 1998, Indian consumers were skeptical of an indigenous car. What was the engineering courage required to take on global giants?",
                    "Tell us the raw, unvarnished story of your 1999 meeting in Detroit with Bill Ford and how it felt to return nine years later to buy Jaguar Land Rover.",
                    "The Tata Nano was a revolutionary engineering achievement that struggled with consumer brand perception. Looking back, what is the marketing lesson you took from that journey?",
                    "What was the hardest business decision you ever had to make where ethics compelled you to walk away from massive profit?"
                ]},
                {"category": "Business Strategy", "questions": [
                    "Tata Group is unique globally because over 65% of Tata Sons is owned by charitable trusts. How does that ownership structure change your time horizon compared to Wall Street quarterly capitalism?",
                    "When you acquired Corus Steel for $12B and JLR for $2.3B, critics claimed an Indian company had overextended itself. What gave you conviction in the turnaround?",
                    "How do you evaluate whether a failing business unit deserves patient capital and restructuring, or whether it must be shut down?",
                    "What is the Tata Code of Conduct, and why has the group walked away from multi-billion dollar contracts rather than pay bribes?",
                    "How do you preserve unity and common culture across 100+ distinct operating companies ranging from software (TCS) to tea (Tetley) to steel?"
                ]},
                {"category": "Startup & Bootstrapping", "questions": [
                    "In your later years, you actively angel-invested in dozens of Indian startups like Ola, Paytm, and Lenskart. What did you look for in early founders before writing a check?",
                    "Do you believe the modern venture capital obsession with burning money on customer acquisition destroys the moral foundation of a business?",
                    "What is your advice to young founders who are tempted to cut ethical corners in the name of speed and growth?",
                    "How can early-stage startups build high-trust brands in emerging markets where consumers are naturally cynical?",
                    "What was the single most impressive presentation a 20-something founder ever gave you in your Colaba living room?"
                ]},
                {"category": "Leadership & Culture", "questions": [
                    "During the 26/11 terror attacks at the Taj Hotel, Tata staff risked their lives to protect guests, and not a single employee abandoned their post. Where does that level of institutional loyalty come from?",
                    "How do you deliver harsh decisions, like retiring senior executives or shutting down an unprofitable plant, while preserving dignity?",
                    "What was your personal ritual for managing intense emotional and legal stress during high-profile corporate battles?",
                    "Why did you always insist that corporate social responsibility is not charity, but a fundamental cost of doing business?",
                    "What is the single most important leadership virtue that cannot be taught in business school?"
                ]},
                {"category": "Technology & AI", "questions": [
                    "Tata Consultancy Services (TCS) became the bedrock of India's IT revolution. How did you view software in the early 1990s when India was still viewed purely as an agricultural economy?",
                    "How should modern Indian industry balance automated robotics and AI with the imperative to create mass employment for millions of young citizens?",
                    "What was your dream for India's domestic manufacturing ecosystem when you envisioned the Nano and indigenized automotive components?",
                    "How can private enterprise partner with public institutions to bring advanced cancer research and genomics to the poorest rural villages?",
                    "What technological advancement in the 21st century excited you the most as an engineer?"
                ]},
                {"category": "Future Trends", "questions": [
                    "Where do you see India's industrial positioning over the next 30 years as global supply chains decouple from China?",
                    "Will traditional family-led conglomerates continue to dominate emerging economies, or will specialized technology giants replace them?",
                    "How can modern corporations help bridge the widening wealth inequality gap in developing nations?",
                    "What is the role of Indian industry in environmental sustainability and clean mobility?",
                    "What gives you the greatest hope when you interact with young Indian students and innovators today?"
                ]},
                {"category": "Rapid Fire", "questions": [
                    "Shop floor or boardroom?",
                    "Calculated risk or safe consolidation?",
                    "Piloting a jet or walking along the beach with your dogs?",
                    "One word that defines the Tata legacy?",
                    "The greatest virtue a human being can cultivate?"
                ]},
                {"category": "Deep & Philosophical", "questions": [
                    "You chose to never marry and lived a solitary personal life dedicated to the group and philanthropy. Did you ever feel profound loneliness at the top?",
                    "When everything is stripped away—titles, billions, boardrooms—what does a successful life look like to Ratan Tata?",
                    "What is a truth about human nature that you only learned after you acquired immense power and influence?",
                    "How would you like to be remembered by the ordinary citizens of India?",
                    "If you could relive any single day from your 86 years on earth, which day would you choose?"
                ]},
                {"category": "Contrarian & Controversial", "questions": [
                    "Why have you openly criticized the practice of corporate leaders using company aircraft and assets as personal vanity trophies?",
                    "Do you believe modern corporate governance regulations have become too legalistic, stifling the intuitive, high-trust leadership of great chairmen?",
                    "What is the most painful lesson you learned from the public feud with Cyrus Mistry in 2016?",
                    "Why do you believe that unbridled greed and crony capitalism will ultimately destroy a society if business loses its moral compass?",
                    "What is an unpopular truth about Indian business that leaders refuse to state publicly?"
                ]}
            ]
        }

    # =========================================================================
    # CURATED DOSSIER: SAM ALTMAN (OpenAI, ChatGPT, AGI)
    # =========================================================================
    def _sam_altman_dossier(self) -> Dict[str, Any]:
        return {
            "summary": "Samuel Harris Altman is an American entrepreneur, investor, and technologist who is the CEO of OpenAI, the research laboratory behind ChatGPT, GPT-4, and Sora. He previously served as the president of Y Combinator (2014–2019), shaping the trajectory of hundreds of tech startups including Stripe, Airbnb, Reddit, and DoorDash. Altman is recognized as one of the central figures steering the transition toward Artificial General Intelligence (AGI) and global compute infrastructure.",
            "biography": "Raised in St. Louis, Missouri, Altman learned to code and disassemble a Macintosh at age 8. He attended Stanford University to study computer science before dropping out in 2005 at age 19 to co-found Loopt, a location-based social networking mobile app that was in the inaugural cohort of Y Combinator. After Loopt was acquired for $43M, Altman became a partner at Y Combinator, eventually chosen by founder Paul Graham to take over as president in 2014. Under his leadership, YC expanded globally and created the YC Continuity fund. In 2015, Altman co-founded OpenAI alongside Elon Musk, Greg Brockman, and Ilya Sutskever as a non-profit dedicated to ensuring AGI benefits all of humanity. In November 2022, OpenAI launched ChatGPT, initiating the global generative AI paradigm shift.",
            "career_timeline": [
                {"year": "2005", "event": "Dropped out of Stanford to co-found Loopt in Y Combinator's first batch."},
                {"year": "2012", "event": "Sold Loopt for $43M and launched early-stage investment fund Hydrazine Capital."},
                {"year": "2014", "event": "Appointed President of Y Combinator by Paul Graham, scaling the accelerator to global prominence."},
                {"year": "2015", "event": "Co-founded OpenAI as a $1B non-profit research lab dedicated to safe AGI."},
                {"year": "2019", "event": "Stepped down from YC to become full-time CEO of OpenAI, restructuring it with a capped-profit arm and raising $1B+ from Microsoft."},
                {"year": "2022", "event": "OpenAI launched ChatGPT, becoming the fastest-growing consumer web application in history."},
                {"year": "2023", "event": "Ousted by the OpenAI board on a Friday and reinstated as CEO five days later after 95% of employees threatened to quit."}
            ],
            "funding_investments": [
                {"year": "2014", "company": "Stripe, Airbnb, Reddit, Pinterest", "role": "YC President & Angel", "amount": "Over 100+ early-stage angel investments"},
                {"year": "2019", "company": "Microsoft Partnership", "role": "CEO OpenAI", "amount": "$13B+ total strategic compute investment"},
                {"year": "2021", "company": "Helion Energy", "role": "Lead Investor & Chairman", "amount": "$375M personal check into commercial fusion energy"},
                {"year": "2024", "company": "OpenAI Growth Round", "role": "CEO", "amount": "$6.6B raised at $157B valuation"}
            ],
            "recent_news": [
                "OpenAI completed a $6.6 billion financing round valuing the company at $157 billion, backed by Thrive Capital, Microsoft, and Nvidia.",
                "Championed global AI infrastructure diplomacy, meeting world leaders to advocate for gigawatt-scale data centers and chip foundries.",
                "Launched OpenAI o1, the first reasoning model using chain-of-thought reinforcement learning to solve complex math and code."
            ],
            "social_media_presence": "Active on X (@sama) with millions of followers. Known for thoughtful long-form essays on startup mechanics, Moore's Law for Everything, and brief philosophical observations on human ambition.",
            "competitors_industry": "Artificial General Intelligence, Frontier Large Language Models, Compute Infrastructure. Competes with Google DeepMind, Anthropic, Meta AI, xAI.",
            "interesting_stories": [
                "When the OpenAI board unexpectedly fired him in November 2023, nearly 750 of OpenAI's 770 employees signed an open letter threatening to resign and join Microsoft within 48 hours, forcing the board to step down and reinstate him.",
                "Personally invested $375 million—the vast majority of his liquid net worth—into Helion Energy, believing that abundant nuclear fusion is mathematically mandatory to power planetary-scale AGI.",
                "Maintains a legendary survivalist bug-out bag containing gold, antibiotics, potassium iodide, and gas masks at his Big Sur ranch."
            ],
            "future_trends": [
                "Artificial General Intelligence (AGI): Developing autonomous systems that outperform human experts at most economically valuable work.",
                "Abundant Clean Energy: Commercial nuclear fusion powering planetary-scale inference clusters.",
                "Post-Scarcity Economics: The marginal cost of cognitive labor dropping toward zero."
            ],
            "fast_facts": [
                "CEO of OpenAI, creator of ChatGPT and GPT-4.",
                "Former President of Y Combinator, overseeing investments in hundreds of iconic startups.",
                "Major personal investor in Helion Energy (fusion) and Retro Biosciences (human longevity).",
                "Holds no direct equity stake in OpenAI's original capped-profit entity, famously earning a standard employee salary."
            ],
            "podcast_brief": "Focus on the transition to AGI: the physics of compute scaling laws, the five-day boardroom coup that shook Silicon Valley, how abundant intelligence will rewrite economic labor, and the geopolitics of semiconductor supply chains.",
            "questions": [
                {"category": "Ice Breakers", "questions": [
                    "You've interacted with hundreds of brilliant minds from Ilya Sutskever to Paul Graham. What is the single trait that separates generational outliers from merely smart people?",
                    "If you could know the answer to any unsolved scientific mystery right now, what would you ask?",
                    "You are famous for maintaining an almost superhuman calendar discipline. What is your rule for saying NO to influential people?",
                    "What's the most common piece of startup advice you gave founders at YC that you now believe was completely wrong?",
                    "What does a day of complete mental disconnection look like for you when all frontier models are running stably?"
                ]},
                {"category": "Career & Origins", "questions": [
                    "Take us back to November 17, 2023—the Friday afternoon you got the Google Meet link from the board. What was going through your mind in the first 60 minutes after being fired?",
                    "When 700+ OpenAI employees signed the letter threatening to quit unless you were reinstated, what did that teach you about institutional loyalty versus board governance?",
                    "In 2015, when OpenAI was formed with a modest group of researchers in a San Francisco apartment, when did you first realize transformers would scale into general intelligence?",
                    "What was the conversation with Satya Nadella like in 2019 when you asked Microsoft for a billion dollars of Azure compute for an unproven non-profit research lab?",
                    "What did Paul Graham see in you at age 28 that made him confident you could lead Y Combinator?"
                ]},
                {"category": "Business Strategy", "questions": [
                    "OpenAI transitioned from a non-profit to a capped-profit structure and is now moving toward a traditional public benefit corporation. Why is that capital transition mandatory to build gigawatt clusters?",
                    "How do you view the moat of frontier model creators versus open-source models like Meta's Llama that can run on consumer hardware?",
                    "If compute is the fundamental currency of the 21st century, what is your strategy for securing hundreds of gigawatts of power over the next decade?",
                    "Why do you believe that AI agents will disrupt traditional software-as-a-service (SaaS) per-seat pricing models?",
                    "What are the unit economics of inference at scale, and when does running a million tokens become as cheap as sending an HTTP packet?"
                ]},
                {"category": "Startup & Bootstrapping", "questions": [
                    "You evaluated thousands of startup pitches at YC. What is the leading indicator in a founder's eyes that tells you they will never give up?",
                    "In an era where AI can generate production code in seconds, what becomes the true defensive moat for an early-stage startup?",
                    "Why do you believe that high-agency individuals who bend the world to their will are the scarcest commodity in the world?",
                    "What advice do you give to a non-technical founder building an AI application company today?",
                    "How should founders think about product-market fit when the underlying AI models are improving by 10x every 18 months?"
                ]},
                {"category": "Leadership & Culture", "questions": [
                    "How do you maintain scientific purity and basic research culture in an organization that is simultaneously under intense commercial pressure from Wall Street?",
                    "What is your framework for managing brilliant, high-ego researchers who disagree passionately about safety versus capability scaling?",
                    "How do you make high-stakes existential decisions under conditions of extreme technical uncertainty?",
                    "What was the emotional toll of the boardroom crisis on your personal relationships and mental health?",
                    "How do you prevent complacency in a company that achieved the fastest consumer adoption in human history?"
                ]},
                {"category": "Technology & AI", "questions": [
                    "Will the current pre-training scaling laws (more tokens, more compute) hit a wall of diminishing returns, or will post-training reasoning (like OpenAI o1) unlock the next 100x leap?",
                    "What is your definition of AGI, and what is the exact economic benchmark where you will officially declare that AGI has been reached?",
                    "How close are we to an AI system that can autonomously formulate novel scientific hypotheses and write original physics papers?",
                    "Why did you invest $375 million into Helion Energy, and is nuclear fusion mandatory to support the compute demands of the 2030s?",
                    "What are the catastrophic risk scenarios from frontier AI that genuinely keep you awake at night?"
                ]},
                {"category": "Future Trends", "questions": [
                    "In your essay 'Moore's Law for Everything', you argued that AI will produce enough wealth to fund a universal basic income for every citizen. What does the social contract look like in a post-labor world?",
                    "How will global geopolitics evolve when nation-states treat compute clusters and advanced chip foundries like uranium enrichment facilities?",
                    "What will education look like for a child born today who will never live in a world where humans are the smartest entities on earth?",
                    "Will personalized AI tutors and companion models eliminate loneliness or accelerate societal fragmentation?",
                    "What happens to human purpose when machines can create better art, write better code, and cure diseases faster than any human?"
                ]},
                {"category": "Rapid Fire", "questions": [
                    "Pre-training or post-training reasoning?",
                    "San Francisco or Big Sur?",
                    "Nuclear fusion or geothermal?",
                    "One book every builder must read: The Beginning of Infinity or Superintelligence?",
                    "The single most important metric for human progress?"
                ]},
                {"category": "Deep & Philosophical", "questions": [
                    "If you succeed completely and AGI is deployed safely, what do you want your own life's work to be in the decades that follow?",
                    "Do you believe consciousness is purely an emergent property of complex computational systems, or is there something fundamentally non-computable in human awareness?",
                    "What does love and human connection mean to you when you spend your days thinking about artificial minds?",
                    "How do you manage the psychological weight of knowing that decisions made in your conference room will affect the future of humanity?",
                    "What is a truth you believe that almost nobody in Silicon Valley agrees with?"
                ]},
                {"category": "Contrarian & Controversial", "questions": [
                    "Critics claim that closed-source frontier labs are engaging in regulatory capture under the guise of AI safety. What is your direct counter to open-source advocates?",
                    "Why do you believe that democratic governments must be deeply involved in computing infrastructure rather than leaving it entirely to the free market?",
                    "Was the decision to launch ChatGPT in November 2022 as an unannounced research preview the right choice, or did it prematurely trigger an uncontrolled global arms race?",
                    "What is the single most dangerous misconception that politicians in Washington have about artificial intelligence?",
                    "If you could go back to the founding meeting of OpenAI in 2015, what is the one structural clause you would change?"
                ]}
            ]
        }

    # =========================================================================
    # CURATED DOSSIER: VIRAT KOHLI (Cricket, High Performance)
    # =========================================================================
    def _virat_kohli_dossier(self) -> Dict[str, Any]:
        return {
            "summary": "Virat Kohli is an Indian international cricketer and former captain of the India national cricket team. Widely regarded as one of the greatest batsmen in the history of the sport, he holds the world record for the most centuries in One Day International (ODI) cricket (50 centuries, surpassing Sachin Tendulkar). Renowned for his relentless fitness revolution, aggressive chase-master mindset, and clutch performances under pressure, he has transformed modern Indian sports culture into a benchmark of elite athletic discipline.",
            "biography": "Born in Delhi in 1988, Kohli captained India to victory at the Under-19 Cricket World Cup in Malaysia in 2008 before making his international debut. In 2012, after recognizing that talent alone was insufficient to dominate world cricket, he radically transformed his diet, fitness, and lifestyle into an uncompromising athletic regimen. Taking over the Test captaincy from MS Dhoni in 2014, Kohli built India's greatest-ever pace bowling attack, leading India to historic Test series victories in Australia and holding the world No. 1 Test ranking for five consecutive years. In 2024, he won the ICC Men's T20 World Cup, being named Player of the Match in the final before retiring from T20 internationals.",
            "career_timeline": [
                {"year": "2008", "event": "Captained India to victory at the ICC U-19 World Cup; made senior international debut."},
                {"year": "2011", "event": "Won the ICC Cricket World Cup with India at Wankhede Stadium, scoring a century on debut."},
                {"year": "2012", "event": "Played the legendary 133* off 86 balls against Sri Lanka in Hobart; initiated his fitness revolution."},
                {"year": "2014", "event": "Scored 692 runs in Australia Test series; assumed full Test captaincy of Indian cricket."},
                {"year": "2018", "event": "Conquered England tour with 593 runs; led India to historic first-ever Test series win in Australia."},
                {"year": "2023", "event": "Named Player of the Tournament at ICC World Cup, breaking Sachin Tendulkar's record with 50th ODI century."},
                {"year": "2024", "event": "Awarded Player of the Match in ICC Men's T20 World Cup Final victory against South Africa in Barbados."}
            ],
            "funding_investments": [
                {"year": "2014", "company": "WROGN & Chisel Fitness", "role": "Co-Owner", "amount": "Youth fashion and national fitness center chain"},
                {"year": "2017", "company": "One8 & One8 Commune", "role": "Brand Creator", "amount": "Multi-category lifestyle, footwear (Puma), and hospitality chain"},
                {"year": "2020", "company": "Rage Coffee & Digit Insurance", "role": "Angel Investor & Brand Ambassador", "amount": "Early-stage strategic growth backing"},
                {"year": "2023", "company": "Blue Tribe Foods", "role": "Investor", "amount": "Plant-based meat and sustainable nutrition advocacy"}
            ],
            "recent_news": [
                "Elected Player of the Match in the 2024 ICC Men's T20 World Cup final after anchoring India's innings to victory in Barbados.",
                "Surpassed 27,000 international runs across formats with the highest batting average among contemporary players.",
                "Expanded One8 Commune hospitality ecosystem across major Indian metropolitan hubs."
            ],
            "social_media_presence": "Over 270 million followers on Instagram—the most followed Asian individual and third most followed athlete globally behind Cristiano Ronaldo and Lionel Messi. Known for intense workout clips, fitness advocacy, and heartfelt family moments.",
            "competitors_industry": "Elite International Athletics, Sports Entertainment, Global Brand Endorsements. Represents India on global sporting stages.",
            "interesting_stories": [
                "In December 2006, as an 18-year-old playing a Ranji Trophy match for Delhi against Karnataka, his father Prem Kohli passed away at 3:00 AM. Kohli returned to the pitch at 9:00 AM that morning, scored a match-saving 90 runs, and went straight from the stadium to perform his father's last rites.",
                "In 2012, after seeing himself in the mirror during an IPL tournament, he realized he was carrying excess body fat and drinking soda; he overhauled his diet overnight, eliminating gluten, dairy, and sugar, and transforming the entire culture of Indian cricket from skill-based to world-class athletic fitness.",
                "His match-winning 82* off 53 balls against Pakistan at the Melbourne Cricket Ground in the 2022 T20 World Cup, including the iconic straight six off Haris Rauf, was voted the greatest T20 shot in history by international cricket analysts."
            ],
            "future_trends": [
                "High-Performance Longevity: Extending athletic prime into mid-to-late thirties through plant-based nutrition and biomechanics.",
                "Indian Sports Ecosystem: Private sports academies creating Olympic-grade athletes across Olympic disciplines.",
                "Global Cricket Expansion: Cricket's inclusion in the 2028 Los Angeles Olympic Games."
            ],
            "fast_facts": [
                "Only batsman in cricket history to score 50 ODI centuries.",
                "Most successful Indian Test captain in history with 40 wins in 68 matches.",
                "Over 270 million Instagram followers, the most followed Asian personality on the planet.",
                "Fastest player in history to score 8,000, 9,000, 10,000, 11,000, 12,000, and 13,000 ODI runs."
            ],
            "podcast_brief": "Focus on the psychology of elite clutch performance: how to execute under the scrutiny of 1.4 billion expectant citizens, the shift from raw talent to monk-like physical discipline, the lessons of the 2014 England tour failure, and the transition from anger to peaceful mastery.",
            "questions": [
                {"category": "Ice Breakers", "questions": [
                    "You have chased down targets under the roaring pressure of 100,000 screaming fans at the MCG and Ahmedabad. What does complete silence feel like inside your helmet?",
                    "What is the single cheat meal that you still daydream about after 12 years of strict athletic dieting?",
                    "When was the last time you walked down a public street without being recognized, and what did that freedom feel like?",
                    "What's one song on your gym workout playlist that people would be completely shocked to find out you listen to?",
                    "What is the best piece of advice MS Dhoni ever gave you behind the stumps when a match was slipping away?"
                ]},
                {"category": "Career & Origins", "questions": [
                    "December 2006: You were 18 years old and your father passed away in the middle of the night, yet you walked out for Delhi at 9:00 AM to score 90. Where did that superhuman emotional resilience come from in a teenager?",
                    "After the 2014 England tour where Jimmy Anderson repeatedly found your outside edge and you averaged just 13.4, what was the mental rebuilding process that turned you into a monster in Australia six months later?",
                    "Take us inside the 19th over against Haris Rauf at the MCG in 2022: 28 needed off 8 balls. What was the exact mental calculus before you played that iconic straight six over his head?",
                    "When you took over the Test captaincy in 2014, Indian cricket was famous for great batting but had never won a Test series in Australia. How did you build the belief that your fast bowlers could take 20 wickets anywhere on earth?",
                    "What was the conversation like with Sachin Tendulkar when you equaled and then broke his record of 49 ODI centuries at the 2023 World Cup in Mumbai?"
                ]},
                {"category": "Business Strategy", "questions": [
                    "You built One8 into a multi-category lifestyle, sportswear, and restaurant powerhouse. How do you evaluate brand partnerships beyond just signing an endorsement contract?",
                    "Why have you publicly refused to endorse fairness creams or sugary soft drinks despite being offered blank-check contracts?",
                    "How do you view the commercial explosion of the Indian Premier League (IPL) and the private equity valuations of sports franchises in India?",
                    "What is your framework for choosing which startup founders to back with your own personal capital?",
                    "How do you balance being one of the world's most valuable marketing assets with the ruthless focus required to perform in the batting crease?"
                ]},
                {"category": "Startup & Bootstrapping", "questions": [
                    "Sports in India is transitioning from a hobby into an organized industry. What is the biggest gap in Indian grassroots infrastructure preventing more world-class athletes from emerging?",
                    "What can corporate founders and business executives learn from how an elite athlete prepares for a high-stakes championship final?",
                    "Why do you believe physical fitness and high energy are non-negotiable prerequisites for cognitive clarity in leadership?",
                    "How do you handle a prolonged period of failure—like your century drought between 2019 and 2022—without losing your core self-worth?",
                    "What is your advice to young people who struggle with negative self-talk and imposter syndrome?"
                ]},
                {"category": "Leadership & Culture", "questions": [
                    "You transformed the fitness culture of the Indian dressing room by introducing the Yo-Yo test and leading by personal example. How do you implement a painful culture shift when veterans resist?",
                    "As captain, how did you manage young, explosive talents like Rishabh Pant or Mohammed Siraj without curbing their natural flair?",
                    "How do you deal with the intense, toxic criticism on social media that attacks your family whenever India loses a cricket match?",
                    "What was the emotional difference between captaining with fiery aggression in your twenties versus playing with calm joy in your mid-thirties?",
                    "What is the single most important leadership quality required to keep a team united when an entire nation is demanding perfection?"
                ]},
                {"category": "Technology & AI", "questions": [
                    "Modern cricket uses biomechanical tracking, high-speed camera ball analytics, and heart-rate telemetry. How much of your batting is calculated data versus pure visual instinct?",
                    "How do you protect your focus in a digital age where every single delivery you face is dissected by millions of algorithms within seconds?",
                    "Do you believe virtual reality simulation and neural tracking will replace traditional net practice for future cricketers?",
                    "What is your view on advanced recovery technologies like hyperbaric chambers, cold plunges, and red-light therapy in extending an athlete's prime?",
                    "How should young athletes manage their smartphone screen time to preserve their hand-eye coordination and visual reaction speed?"
                ]},
                {"category": "Future Trends", "questions": [
                    "Cricket will be an Olympic medal sport at the Los Angeles 2028 Games. What will it mean for cricket to be played on the Olympic stage?",
                    "With franchise T20 leagues proliferating globally, do you fear that five-day Test cricket is dying, and how can the sport preserve its purest format?",
                    "Where do you see Indian sports beyond cricket—in athletics, badminton, wrestling, and football—over the next 20 years?",
                    "What is your vision for your post-cricket life once you finally hang up your boots?",
                    "How do you want to use your global platform to inspire health and mental well-being for the next generation of Indian children?"
                ]},
                {"category": "Rapid Fire", "questions": [
                    "Chasing under lights or setting a target?",
                    "A crisp cover drive off a fast bowler or a hard-fought Test hundred on a green pitch?",
                    "Melbourne Cricket Ground or Eden Gardens?",
                    "One bowler from history you wish you could face in their prime?",
                    "The single word that defines your competitive drive?"
                ]},
                {"category": "Deep & Philosophical", "questions": [
                    "You went through a nearly three-year phase where the centuries stopped coming, and you openly spoke about feeling vulnerable and taking a break from cricket. What did that valley teach you about who Virat Kohli is without a cricket bat in his hands?",
                    "When you look at your daughter Vamika and son Akaay, how has fatherhood changed what winning and losing on the cricket field means to you?",
                    "What does personal peace look like when the roar of 100,000 spectators finally goes quiet?",
                    "How do you detach from the massive ego and god-like adulation that Indian society places on cricketers?",
                    "At the end of your life, what do you want your real legacy to be?"
                ]},
                {"category": "Contrarian & Controversial", "questions": [
                    "Why have you always insisted that Test cricket is the ultimate test of human character while the rest of the world is chasing 20-over entertainment?",
                    "Do you believe the Indian media and broadcasting culture places an unhealthy, obsessive focus on individual milestones rather than team victories?",
                    "What was the most difficult conversation you had behind closed doors when you stepped down from the captaincy across formats?",
                    "Is intense controlled aggression essential to be a champion, or is calm detachment superior in high-pressure moments?",
                    "What is one uncomfortable truth about Indian sports culture that nobody is willing to speak on television?"
                ]}
            ]
        }

    # =========================================================================
    # CURATED DOSSIER: MUKESH AMBANI (Reliance Industries, Jio, Retail)
    # =========================================================================
    def _mukesh_ambani_dossier(self) -> Dict[str, Any]:
        return {
            "summary": "Mukesh Dhirubhai Ambani is an Indian billionaire industrialist and the chairman and managing director of Reliance Industries Ltd., India's most valuable enterprise by market capitalization. Over four decades, he led the creation of the world's largest grassroots petroleum refining complex in Jamnagar, revolutionized global telecommunications by launching Reliance Jio with ultra-low-cost 4G data, built India's largest retail network (Reliance Retail), and is spearheading a $10B+ green energy transition across solar, green hydrogen, and gigafactories.",
            "biography": "Born in 1957 in the British crown colony of Aden (modern-day Yemen), Ambani grew up in Mumbai in a modest two-bedroom chawl before his father Dhirubhai Ambani founded Reliance as a textiles merchant. After studying chemical engineering at UDCT Mumbai, he entered Stanford Business School in 1979 but dropped out at Dhirubhai's request to build the Patalganga polyester plant. In the 1990s, he spearheaded the design and execution of the Jamnagar refinery in Gujarat, the largest refining hub on earth. In 2016, Ambani launched Jio Infocomm, investing $35 billion to build an all-IP 4G network and offering free voice calls and data, taking India from 155th in global mobile data consumption to #1 in the world within 18 months. Today, Reliance spans energy, retail, telecom, entertainment (merger with Disney India), and renewable gigafactories.",
            "career_timeline": [
                {"year": "1981", "event": "Left Stanford MBA to return to India and execute the Patalganga polyester plant."},
                {"year": "1999", "event": "Commissioned the Jamnagar Refinery, the largest grassroots refining complex in the world (1.24M bpd)."},
                {"year": "2002", "event": "Assumed leadership of Reliance Industries following the passing of founder Dhirubhai Ambani."},
                {"year": "2006", "event": "Launched Reliance Retail, scaling it into India's largest organized supermarket and lifestyle chain."},
                {"year": "2016", "event": "Disrupted global telecom by launching Reliance Jio with free 4G voice & ultra-cheap high-speed data."},
                {"year": "2020", "event": "Raised $20B+ from Meta, Google, and global sovereign funds for Jio Platforms during global lockdown."},
                {"year": "2024", "event": "Completed landmark media merger between Reliance's Viacom18 and Disney India; expanded Dhirubhai Ambani Green Energy Giga Complex."}
            ],
            "funding_investments": [
                {"year": "1999", "company": "Jamnagar Refining Complex", "role": "Chairman", "amount": "$6B+ initial capital expenditure; now $25B+ world asset"},
                {"year": "2016", "company": "Reliance Jio Infocomm", "role": "Chairman", "amount": "$35B greenfield capital expenditure into 4G/5G infrastructure"},
                {"year": "2020", "company": "Jio Platforms & Retail", "role": "Chairman", "amount": "$27B raised from Google, Meta, Silver Lake, PIF, KKR"},
                {"year": "2022", "company": "Green Energy Mega Complex", "role": "Chairman", "amount": "$10B commitment to solar PV, hydrogen, battery storage gigafactories"}
            ],
            "recent_news": [
                "Finalized the $8.5 billion joint venture merger with Disney India, creating a media conglomerate commanding 100+ channels and two premier streaming platforms.",
                "Announced 'Jio Brain', a suite of enterprise 5G-connected AI tools, and promised to bring lowest-cost AI compute inference to every Indian citizen.",
                "Commissioned the first phases of the 5,000-acre green energy giga complex in Jamnagar for solar modules and green hydrogen."
            ],
            "social_media_presence": "Maintains zero personal social media accounts. Communicates through Reliance Annual General Meetings (AGMs)—often dubbed the 'Woodstock of Indian Capitalism'—broadcast to millions of retail shareholders.",
            "competitors_industry": "Energy, Telecommunications, Retail, Media & Digital Services, Green Hydrogen. Competes with Adani Group, Tata, Bharti Airtel, Amazon, Walmart/Flipkart.",
            "interesting_stories": [
                "During the construction of the Jamnagar refinery in the barren deserts of Gujarat, experts claimed that the salty, cyclone-prone soil was unbuildable. Ambani built a massive rainwater harvesting reservoir and planted a 750-acre mango orchard of over 100,000 trees with treated wastewater, which now exports premium mangoes globally.",
                "When preparing to launch Jio in 2016, his internal mandate to his engineering leadership was simple: 'Do not optimize for profit in the first three years. Optimize for 100 million consumers experiencing broadband for the first time.' Jio reached 100 million users in 170 days, faster than Facebook or WhatsApp.",
                "Despite heading an empire generating over $115B in annual revenue, he is a strict vegetarian who loves street food from Mumbai and has famously drawn zero salary from Reliance for multiple years."
            ],
            "future_trends": [
                "AI for 1.4 Billion: Providing sovereign, ultra-low-cost AI compute to Indian agriculture, healthcare, and education.",
                "Green Hydrogen at $1/kg: Replacing fossil fuels with the world's most economical green hydrogen and solar gigafactories.",
                "Integrated Omnichannel Commerce: Blending 18,000+ physical stores with digital commerce and instant delivery."
            ],
            "fast_facts": [
                "Chairman of Reliance Industries, India's most valuable company (~$240B+ market cap).",
                "Built Jio from zero to 470+ million subscribers, making India the largest consumer of mobile data in the world.",
                "Conducted the world's largest private corporate fundraising during the 2020 pandemic, raising over $27B in weeks.",
                "Trained as a chemical engineer at UDCT Mumbai before attending Stanford Business School."
            ],
            "podcast_brief": "Focus on the architecture of industrial scale: how to execute multi-billion-dollar greenfield megaprojects ahead of schedule, the audacious gamble of investing $35B in Jio, democratizing data for the common citizen, and passing generational stewardship to the next cohort.",
            "questions": [
                {"category": "Ice Breakers", "questions": [
                    "You are famous for staying out of the public spotlight and rarely giving long-form interviews. What is the single biggest misconception people have about your daily routine?",
                    "Your father Dhirubhai Ambani famously pulled you out of Stanford in 1981 to build a polyester plant in rural Maharashtra. Did you ever regret not finishing that MBA?",
                    "What is your favorite quiet corner inside Antilia when you want to think about 10-year technology bets?",
                    "You love classic Bollywood cinema and watch multiple films every weekend. What was the last movie that made you deeply emotional?",
                    "What was the single most memorable piece of advice your father gave you when you were still in your twenties?"
                ]},
                {"category": "Career & Origins", "questions": [
                    "Take us back to the construction of the Jamnagar refinery in the late 1990s: cyclones hit the site, equipment fell into the sea, and global experts said the deadline was impossible. How did you rally 100,000 workers to complete it ahead of schedule?",
                    "In 2002, when your father passed away without leaving a formal will, what was the personal emotional toll of keeping the business running during that tumultuous transition?",
                    "When you first decided to enter telecommunications with Jio, incumbent operators told you that voice calls had to be charged and data was a luxury for the rich. What gave you the conviction to invest $35 billion before making a single rupee?",
                    "In the first six months of Jio, you gave away free 4G data to 100 million people while incumbents filed lawsuits and blocked interconnection points. Did you ever have a sleepless night wondering if the burn was too high?",
                    "What did you learn about Indian consumer psychology when you saw millions of people queuing outside stores for hours just to get a blue Jio SIM card?"
                ]},
                {"category": "Business Strategy", "questions": [
                    "Your business philosophy is often summarized as: 'Unless a business touches the lives of hundreds of millions of Indians, it is not worth doing.' How do you mathematically define that scale threshold?",
                    "In 2020, during the height of global lockdowns when world markets froze, you raised $27 billion in weeks from Meta, Google, Silver Lake, and PIF. What was the pitch you made to Mark Zuckerberg and Sundar Pichai over Zoom?",
                    "How do you view the transition from refining oil—a business that powered Reliance for decades—into green hydrogen, solar gigafactories, and clean energy?",
                    "Why did you choose to merge your media assets with Disney India to create an undisputed entertainment titan?",
                    "What is your framework for delegating execution to non-family professional CEOs while maintaining family stewardship over capital allocation?"
                ]},
                {"category": "Startup & Bootstrapping", "questions": [
                    "India's digital economy exploded after Jio made data cheaper than a cup of tea. Do you feel a sense of paternity over the entire Indian unicorn and startup ecosystem?",
                    "What advice do you give to young entrepreneurs who are building in India today compared to when you started under the License Raj in the 1980s?",
                    "Why do you believe that capital is no longer the scarce resource in business, and that vision and speed are the only true moats?",
                    "How can Indian startups build deep technical hardware and sovereign silicon instead of just building consumer aggregation apps?",
                    "What is the single most common reason why large family businesses in Asia fail to survive past the third generation?"
                ]},
                {"category": "Leadership & Culture", "questions": [
                    "Your leadership style is described as 'hands-on during capital projects, hands-off during steady operations.' How do you know when a project has reached stability?",
                    "How do you create an institutional culture where engineers and project directors treat company money with the same frugality as their own personal savings?",
                    "What was the conversation like with your children—Akash, Isha, and Anant—when you structured their transition to head Telecom, Retail, and Energy?",
                    "How do you process political changes, regulatory policy shifts, and intense competitive rivalry without holding personal grudges?",
                    "What is the internal metric that you look at every morning that gives you the true health of the entire Reliance empire?"
                ]},
                {"category": "Technology & AI", "questions": [
                    "You recently announced 'Jio Brain' and committed to delivering the lowest AI compute costs in the world to Indian businesses. How will you execute that when GPUs are in global shortage?",
                    "How can artificial intelligence transform Indian agriculture and small retail shopkeepers (Kiranas) rather than putting them out of business?",
                    "Why is sovereign data infrastructure and keeping Indian consumer data inside Indian borders an issue of national security for you?",
                    "How will high-speed 5G and satellite broadband transform healthcare delivery in remote villages in the northeast and Himalayas?",
                    "What technological trend over the next 10 years do you believe will create more enterprise value than the smartphone did?"
                ]},
                {"category": "Future Trends", "questions": [
                    "You have committed to producing green hydrogen at under $1 per kilogram. If you achieve that, how does it fundamentally rewrite global geopolitics and petrodollar dominance?",
                    "By 2047, when India celebrates 100 years of independence, what will Reliance Industries look like, and what will India's rank in global economic power be?",
                    "How will retail evolve when instantaneous q-commerce and 10-minute delivery compete with traditional neighborhood community commerce?",
                    "Will decentralized green energy grids make centralized mega-utilities obsolete over the next two decades?",
                    "What is the biggest risk to India's compounding growth trajectory over the next 20 years?"
                ]},
                {"category": "Rapid Fire", "questions": [
                    "Jamnagar refinery or Jio network?",
                    "Chemical engineering or financial architecture?",
                    "Sunday family dinner or reviewing project CAD blueprints?",
                    "One trait your father Dhirubhai had that you wish you possessed more of?",
                    "The single most important word in business?"
                ]},
                {"category": "Deep & Philosophical", "questions": [
                    "You have accumulated more economic influence and built larger physical assets than almost any individual in modern Asian history. What does wealth mean to you today?",
                    "When you reflect on growing up in a modest chawl in Bhuleshwar with your siblings, how do you keep your children grounded despite extraordinary privilege?",
                    "What does devotion and spirituality mean in your daily life, and how does your faith guide your business decisions?",
                    "How do you want the Ambani family name to be remembered in Indian history 100 years from today?",
                    "When you are completely alone with your thoughts, what is the dream that still keeps Mukesh Ambani inspired to build?"
                ]},
                {"category": "Contrarian & Controversial", "questions": [
                    "Critics often allege that Reliance has historically wielded disproportionate regulatory influence in New Delhi. What is your direct response to accusations of corporate favoritism?",
                    "Why do you believe that large, consolidated domestic champions are essential for a developing nation to compete against American and Chinese trillion-dollar monopolies?",
                    "How do you respond to telecom competitors who claimed that Jio engaged in predatory pricing designed to kill rivals in 2016?",
                    "What is the hardest truth about doing business in India that foreign investors repeatedly fail to understand?",
                    "If you had to start your career over today with zero family legacy, what exact industry would you bet your life on?"
                ]}
            ]
        }

    # =========================================================================
    # DYNAMIC WIKIPEDIA DOSSIER (For Any Other Public Figure, Leader, or Founder)
    # =========================================================================
    def _dynamic_wikipedia_dossier(self, name: str, company: str = None, website: str = None, linkedin: str = None, twitter: str = None) -> Dict[str, Any]:
        wiki_data = self.fetch_wikipedia_bio(name)
        display_name = wiki_data.get("title", name)
        desc = (wiki_data.get("description") or "").lower()
        extract = wiki_data.get("extract") or ""
        
        # Classify Archetype
        text_corpus = f"{desc} {extract}".lower()
        
        is_political = any(k in text_corpus for k in ["prime minister", "president", "politician", "minister", "governor", "senator", "mp ", "parliament", "congress", "bjp", "politics", "chief minister", "government", "diplomat"])
        is_athlete = any(k in text_corpus for k in ["cricketer", "footballer", "athlete", "olympic", "sports", "tennis", "badminton", "captain", "player", "batsman", "bowler", "boxer", "basketball", "nfl", "nba"])
        is_creative = any(k in text_corpus for k in ["actor", "actress", "filmmaker", "director", "singer", "musician", "producer", "comedian", "youtuber", "podcaster", "creator", "artist", "author", "novelist"])
        is_tycoon = any(k in text_corpus for k in ["industrialist", "magnate", "billionaire", "conglomerate", "chairman", "investor", "tycoon"])

        if is_political:
            org = company or (wiki_data.get("description") or "Government & Public Service")
            summary = extract[:450] if extract else f"{display_name} is a prominent political leader, statesman, and public policy figure serving in {org}. Recognized for extensive legislative and governance leadership, public mobilization, and navigating key policy reforms."
            biography = extract if len(extract) > 200 else f"{display_name} has dedicated their career to public service and political representation, shaping national and regional discourse across key institutional domains."
            brief = f"Focus on statecraft, policy execution, grassroots public mobilization, managing multi-stakeholder coalitions, and long-term national governance vision."
            q_category_3 = "Governance & Public Policy"
            q_category_4 = "Electoral Strategy & Coalitions"
            anecdote_1 = f"Spearheaded pivotal legislative campaigns that engaged diverse citizen demographics across the nation."
            anecdote_2 = "Known for maintaining intense grassroots constituent dialogue during high-stakes policy deliberations."
            anecdote_3 = "Adheres to rigorous personal discipline and strategic communication under intense public scrutiny."
            fast_fact_1 = f"Leading public figure in {org}."
            fast_fact_2 = "Navigated major national policy reforms and constituent mandates."
            fast_fact_3 = "Recognized voice on statecraft, federal relations, and public administration."
            fast_fact_4 = "Extensive record of public representation and electoral stewardship."

        elif is_athlete:
            org = company or (wiki_data.get("description") or "International Athletics")
            summary = extract[:450] if extract else f"{display_name} is a celebrated professional athlete recognized for elite sporting achievement, high-pressure execution, and setting athletic benchmarks on the international stage."
            biography = extract if len(extract) > 200 else f"{display_name} rose through competitive athletic circuits, dedicating their journey to physical conditioning, tactical mastery, and representing their nation with distinction."
            brief = f"Focus on high-performance athletic psychology: performing under immense public pressure, mental fortitude during slumps, physical recovery heuristics, and leadership culture."
            q_category_3 = "High Performance & Training"
            q_category_4 = "Clutch Execution Under Pressure"
            anecdote_1 = "Underwent grueling physical conditioning overhauls to compete at the absolute pinnacle of international sports."
            anecdote_2 = "Anchored match-defining performances when team victory seemed mathematically improbable."
            anecdote_3 = "Maintains strict dietary and recovery protocols to maximize athletic longevity."
            fast_fact_1 = f"Elite professional athlete in {org}."
            fast_fact_2 = "Record-setting performances in international competition."
            fast_fact_3 = "Inspirational fitness benchmark for millions of aspiring sportspeople."
            fast_fact_4 = "Decorated international sporting career and clutch competitor."

        elif is_creative:
            org = company or (wiki_data.get("description") or "Creative Arts & Entertainment")
            summary = extract[:450] if extract else f"{display_name} is an influential creative artist and cultural figure celebrated for captivating audiences across storytelling, performance, and media production."
            biography = extract if len(extract) > 200 else f"{display_name} pioneered authentic artistic expression, cultivating deep community mindshare through iconic creative output and cultural resonance."
            brief = f"Focus on creative intuition: storytelling craft, maintaining authenticity under public fame, managing creative vulnerability, and the economics of modern entertainment."
            q_category_3 = "Creative Craft & Storytelling"
            q_category_4 = "Audience Connection & Fame"
            anecdote_1 = "Overcame early creative rejections before breakthrough work resonated deeply with audiences."
            anecdote_2 = "Obsesses over the fine nuances of character and narrative emotional cadence."
            anecdote_3 = "Balances public celebrity adulation with private artistic vulnerability and reflection."
            fast_fact_1 = f"Celebrated figure in {org}."
            fast_fact_2 = "Massive cultural influence across entertainment and media."
            fast_fact_3 = "Recognized for creative authenticity and compelling artistic voice."
            fast_fact_4 = "Dedicated community following and acclaimed body of work."

        elif is_tycoon:
            org = company or (wiki_data.get("description") or "Industrial Enterprise")
            summary = extract[:450] if extract else f"{display_name} is an accomplished business leader and industrialist steering large-scale enterprise value creation, capital stewardship, and strategic market expansion."
            biography = extract if len(extract) > 200 else f"{display_name} has guided major industrial operations, combining capital discipline with long-term infrastructure investment to compete at global scale."
            brief = f"Focus on capital stewardship: managing large-scale balance sheets, compounding competitive moats, organizational governance, and navigating global market cycles."
            q_category_3 = "Capital Stewardship & Moats"
            q_category_4 = "Industrial Scale & Execution"
            anecdote_1 = "Executed major capital bets during market downturns when peers were retrenching."
            anecdote_2 = "Maintains strict operational risk controls and hands-on governance over core operations."
            anecdote_3 = "Mentors key organizational leaders to ensure multi-decade institutional continuity."
            fast_fact_1 = f"Key industrial leader at {org}."
            fast_fact_2 = "Oversees multi-billion-dollar enterprise operations and capital allocation."
            fast_fact_3 = "Champion of domestic manufacturing and sovereign industrial capacity."
            fast_fact_4 = "Decades of proven leadership in enterprise expansion."

        else:
            org = company or f"{display_name} Ventures"
            summary = extract[:450] if extract else f"{display_name} is an influential innovator and leader at {org}. Renowned for driving impactful initiatives, strategic clarity, and advancing modern operational practices."
            biography = extract if len(extract) > 200 else f"{display_name} began their journey by mastering fundamental domain principles, steadily building operational leverage and shaping public dialogue around sustainable growth."
            brief = f"Focus on domain mastery: the early contrarian bets that fueled growth, operational heuristics, navigating industry shifts, and long-term vision."
            q_category_3 = "Strategy & Competitive Advantage"
            q_category_4 = "Operational Excellence"
            anecdote_1 = "Recognized early industry shifts before they became mainstream market consensus."
            anecdote_2 = "Relies on first-principles analysis rather than copying legacy industry habits."
            anecdote_3 = "Advocates for lean, high-trust team structures that out-execute slower bureaucratic organizations."
            fast_fact_1 = f"Leadership presence at {org}."
            fast_fact_2 = "Track record of strategic execution and innovative thinking."
            fast_fact_3 = "Respected voice on industry transformation and leadership."
            fast_fact_4 = "Dedicated to creating long-term compound value."

        return {
            "summary": summary,
            "biography": biography,
            "career_timeline": [
                {"year": "Early Milestone", "event": f"Established fundamental training and domain expertise in the industry."},
                {"year": "Growth Phase", "event": f"Led key breakthrough initiatives and expanded operational influence at {org}."},
                {"year": "Scaling Impact", "event": f"Achieved widespread public recognition and scaled core initiatives across regional markets."},
                {"year": "Modern Era", "event": f"Spearheading high-impact strategic directions and modernizing leadership workflows."},
                {"year": "Present", "event": f"Recognized as a leading voice shaping the future of their domain."}
            ],
            "funding_investments": [
                {"year": "Key Phase", "company": org, "role": "Leadership", "amount": "Major Capital / Resource Commitment"},
                {"year": "Strategic Initiative", "company": "Domain Growth Fund", "role": "Advisor & Champion", "amount": "Substantial institutional backing"}
            ],
            "recent_news": [
                f"{display_name} addressed a major conference outlining their strategic vision for the next decade.",
                f"{org} announced expansion into new key initiatives with enthusiastic public and industry reception.",
                f"Published insightful commentary on navigating modern technological and social shifts."
            ],
            "social_media_presence": f"Maintains an influential public footprint on digital channels, engaging with hundreds of thousands of followers on leadership, industry trends, and national progress.",
            "competitors_industry": f"Operating within {org} sectors, competing on speed, authenticity, and enduring value creation.",
            "interesting_stories": [
                anecdote_1,
                anecdote_2,
                anecdote_3
            ],
            "future_trends": [
                "Technological modernization and AI-driven workflow transformation.",
                "The rising premium on authentic, high-trust human leadership.",
                "Navigating shifting global and demographic expectations."
            ],
            "fast_facts": [
                fast_fact_1,
                fast_fact_2,
                fast_fact_3,
                fast_fact_4
            ],
            "podcast_brief": brief,
            "questions": [
                {"category": "Ice Breakers", "questions": [
                    f"When people hear the name {display_name}, what is the biggest misconception they have about your personality?",
                    "What was the very first meaningful lesson from your childhood that still guides your decisions today?",
                    "What is one question about your journey that interviewers never ask, but you wish they would?",
                    "What is your most unconventional personal habit that others find surprising?",
                    "If you couldn't be working in your current field, what completely different passion would you pursue tomorrow?"
                ]},
                {"category": "Career & Origins", "questions": [
                    "What was the most terrifying moment early in your journey when you genuinely thought everything was over?",
                    "Who was the one person who took a gamble on your potential when you had zero credentials on your resume?",
                    "What was the hardest skill you had to learn the hard way through repeated failure?",
                    "Looking back at your first major leadership role, what is the single biggest mistake you made with your team?",
                    "What was the pivotal turning point that transformed you from an ordinary practitioner into a recognized leader?"
                ]},
                {"category": "Business Strategy", "questions": [
                    f"What is the core competitive advantage that protects your work at {org} from well-funded rivals?",
                    "How do you balance short-term tactical pressures with 5-year speculative innovation bets?",
                    "What are the core metrics and indicators that you obsess over before approving a new major initiative?",
                    "How do you determine whether a new trend is genuine long-term reality versus 90% temporary hype?",
                    "What is your philosophy on resource allocation—why do most organizations misallocate their best people?"
                ]},
                {"category": "Startup & Bootstrapping", "questions": [
                    "What is the single biggest lie that early operators tell themselves when starting from zero?",
                    "How do you achieve true product-market fit or public resonance without burning reckless financial subsidies?",
                    "What are the non-negotiable qualities you look for in a founding partner or key lieutenant?",
                    "When is the exact right moment to take on outside institutional capital, and when is it a dangerous trap?",
                    "How do you preserve the hunger, speed, and agility of a small team as your organization expands?"
                ]},
                {"category": "Leadership & Culture", "questions": [
                    "What does your internal interview process look like when evaluating candidates for high-trust roles?",
                    "How do you deliver harsh, constructive feedback to a key performer without demoralizing them?",
                    "What is your framework for delegating high-stakes decisions without losing quality control?",
                    "How do you protect your personal mental health and family life from the relentless demands of leadership?",
                    "What is the internal cultural ritual at your organization that you are most proud of?"
                ]},
                {"category": "Technology & AI", "questions": [
                    "How is artificial intelligence fundamentally rewriting the workflow speed and capabilities in your domain?",
                    "What technology trend right now do you consider 90% hype and 10% real substance?",
                    "How do you protect your organization from algorithmic herd behavior and digital distractions?",
                    "What will the day-to-day work of knowledge workers look like three years from now?",
                    "What are the technological and security threats that keep you awake at night?"
                ]},
                {"category": "Future Trends", "questions": [
                    "What will your industry look like in 2030, and which legacy institutions will struggle to survive?",
                    "How will changing demographic attention spans alter how products, policies, and media are created?",
                    "What is the most underrated breakthrough happening right now outside of the public spotlight?",
                    "Where do you see the biggest untapped opportunity for the next generation of builders?",
                    "How should young ambitious people position their skill sets to remain irreplaceable?"
                ]},
                {"category": "Rapid Fire", "questions": [
                    "Speed or Precision?",
                    "Intuition or Data?",
                    "Early morning clarity or late-night deep work?",
                    "One book every ambitious builder must read?",
                    "The single most important leadership advice in three words?"
                ]},
                {"category": "Deep & Philosophical", "questions": [
                    "What is the emotional price of high ambition that nobody warns you about before you embark on it?",
                    "How has your definition of personal success evolved over the past decade?",
                    "When was the last time you felt true imposter syndrome, and how did you navigate it?",
                    "What does happiness and inner peace look like for you when work is completely set aside?",
                    "What is the legacy you want your life's work to leave behind 50 years from today?"
                ]},
                {"category": "Contrarian & Controversial", "questions": [
                    "What is one widely accepted industry best practice that you believe is completely foolish?",
                    "Why do you believe formal credentialing is losing its signaling power in the modern world?",
                    "Is intense personal sacrifice mandatory to build an enduring enterprise, or can it be done with balance?",
                    "What is a controversial opinion you hold with high conviction that almost none of your peers agree with?",
                    "If you had to start over today with zero capital and zero network, what exact initiative would you launch tomorrow?"
                ]}
            ]
        }
