import sys
import argparse
import json
from backend.app.agents.guest_researcher import GuestResearcherAgent
from backend.app.agents.podcast_gpt import PodcastGPTAgent
from backend.app.agents.shorts_finder import ShortsFinderAgent
from backend.app.agents.repurposer import ContentRepurposerAgent
from backend.app.agents.sponsor_outreach import SponsorOutreachAgent

def main():
    parser = argparse.ArgumentParser(description="PodcastOS Studio Agent CLI")
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # 1. Research
    p_research = subparsers.add_parser("research", help="Generate guest dossier & 50 questions")
    p_research.add_argument("--name", required=True, help="Guest full name")
    p_research.add_argument("--company", default=None, help="Organization or company")

    # 2. Query
    p_query = subparsers.add_parser("query", help="Query indexed transcripts via ChromaDB")
    p_query.add_argument("--q", required=True, help="Question to query")

    # 3. Shorts
    p_shorts = subparsers.add_parser("shorts", help="Extract viral shorts moments")
    p_shorts.add_argument("--file", default=None, help="Transcript text file path")
    p_shorts.add_argument("--text", default=None, help="Direct transcript text string")

    # 4. Repurpose
    p_rep = subparsers.add_parser("repurpose", help="Repurpose transcript into multi-platform formats")
    p_rep.add_argument("--file", default=None, help="Transcript file path")
    p_rep.add_argument("--tone", default="Raj Shamani", help="Tone persona")

    # 5. Sponsor
    p_spon = subparsers.add_parser("sponsor", help="Generate sponsor outreach proposal")
    p_spon.add_argument("--brand", required=True, help="Brand name")
    p_spon.add_argument("--guest", default="Nikhil Kamath", help="Target episode guest")
    p_spon.add_argument("--goal", default="Brand Awareness", help="Campaign goal")

    args = parser.parse_args()

    if args.command == "research":
        agent = GuestResearcherAgent()
        result = agent.run(name=args.name, company=args.company)
        print(f"\n# Studio Research Dossier: {args.name}\n")
        print(f"**Executive Summary:**\n{result.get('summary', '')}\n")
        print(f"**Interview Brief:**\n{result.get('podcast_brief', '')}\n")
        print(f"**Total Question Categories:** {len(result.get('questions', []))}")
        for cat in result.get('questions', []):
            print(f"\n### {cat.get('category')}")
            for i, q in enumerate(cat.get('questions', [])):
                print(f"  {i+1}. {q}")

    elif args.command == "query":
        agent = PodcastGPTAgent()
        result = agent.search_and_chat(query=args.q)
        print(f"\n# PodcastGPT Vector Result:\n")
        print(result.get("answer", ""))
        print(f"\nCitation: '{result.get('quote')}'")
        print(f"Timestamp: {result.get('timestamp')} • Episode: {result.get('episode')}")
        print(f"Confidence: {int(result.get('confidence_score', 0) * 100)}%")

    elif args.command == "shorts":
        text = args.text
        if args.file:
            with open(args.file, "r", encoding="utf-8") as f:
                text = f.read()
        if not text:
            text = "I became a billionaire and the first thing I did was sign another rental lease. Real estate yields 2% in India. Renting gives you flexibility to deploy capital in high-growth equities."
        agent = ShortsFinderAgent()
        result = agent.run(transcript_text=text)
        print(json.dumps(result, indent=2))

    elif args.command == "repurpose":
        text = ""
        if args.file:
            with open(args.file, "r", encoding="utf-8") as f:
                text = f.read()
        else:
            text = "Startups fail because founders focus on building product in a vacuum without talking to clients. Validate product-market fit on day one. Customer support is your best marketing channel."
        agent = ContentRepurposerAgent()
        result = agent.run(transcript_text=text, tone=args.tone)
        print(f"\n# LinkedIn Story Post:\n{result.get('linkedin_post')}\n")
        print(f"# Twitter Thread ({len(result.get('twitter_thread', []))} tweets):")
        for i, t in enumerate(result.get('twitter_thread', [])):
            print(f"[{i+1}] {t}\n")

    elif args.command == "sponsor":
        agent = SponsorOutreachAgent()
        result = agent.run(brand_name=args.brand, campaign_goal=args.goal, target_guest=args.guest)
        print(f"\n# Sponsorship Proposal for {args.brand}:\n")
        print(f"**Audience Fit:**\n{result.get('audience_fit')}\n")
        print(f"**Cold Email:**\n{result.get('cold_email')}\n")
        print(f"**Proposal Packages:**\n{result.get('proposal')}\n")
        print(f"**ROAS Justification:**\n{result.get('roi_pitch')}\n")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
