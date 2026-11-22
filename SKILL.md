---
name: podcast-os
description: The Production-Quality AI Operating System for Modern Podcast Teams and Studios (engineered for high-scale creators, production studios, and network hosts). Automates 50-question guest dossiers, semantic transcript search, viral clip detection, and sponsor outreach.
version: 2.0.0
author: Siddharth (@SiddSynth)
homepage: https://github.com/SiddSynth/Podcast-OS
marketplace: https://www.agensi.io/sell
tags:
  - podcast
  - media-production
  - guest-research
  - transcripts
  - viral-shorts
  - sponsor-sales
  - voice-models
---

# PodcastOS 🎙️ — Agensi AI Agent Skill

### The Operating System for World-Class Podcast Studios & Media Teams

PodcastOS turns any AI agent (Claude Code, Cursor, Codex CLI, OpenClaw) into an elite Executive Podcast Producer. It automates every phase of the media production lifecycle:
1. **Guest Research & 50-Question Dossier:** Compiles biographies, career milestones, controversies, and 50 categorized interview questions.
2. **PodcastGPT Semantic Vector Intelligence:** Searches indexed transcripts with exact citations, timestamps, and confidence scores over ChromaDB.
3. **Viral Shorts Finder:** Analyzes transcripts to identify 3-second opening curiosity hooks, predicted viral scores (1-100), and vertical subtitles.
4. **Multi-Format Content Repurposer:** Converts raw transcripts into LinkedIn story posts, 5-slide PDF carousels, 5-tweet threads, newsletters, and SEO blog articles matching top creator personas (Raj Shamani, Naval Ravikant, Alex Hormozi, Justin Welsh).
5. **Sponsor Monetization & Pitch Engine:** Writes personalized cold pitch emails to brand CMOs, LinkedIn InMail messages, tiered partnership rate cards, and mathematical ROAS/CPM payback analysis.
6. **Agensi Voice Synthesis Integration:** Directly triggers ElevenLabs and MiniMax voice clones for audio trailer narration and episode teasers without requiring separate client API keys.

---

## 🛠️ Quickstart CLI & Agent Tools

### 1. Research a Guest & Generate 50 Questions
```bash
python -m backend.app.cli research --name "Nikhil Kamath" --company "Zerodha"
```
**Output:** Full Markdown Dossier with Executive Summary, Fast Facts, Career Timeline, and 50 categorized questions across 10 tactical dimensions.

### 2. Query Transcripts via Vector Search
```bash
python -m backend.app.cli query --q "Why does Nikhil Kamath rent instead of buying a house?"
```
**Output:** Exact quote, episode name, verified timestamp (`00:24:10`), and confidence score.

### 3. Extract 9:16 Viral Shorts
```bash
python -m backend.app.cli shorts --file "sample_data/sample_transcript_1.txt"
```
**Output:** 3 viral video moments with calculated retention score, vertical captions with emoji emphasis, thumbnail text, and hashtags.

### 4. Repurpose Episode into Multi-Platform Assets
```bash
python -m backend.app.cli repurpose --file "sample_data/sample_transcript_1.txt" --tone "Raj Shamani"
```

### 5. Generate Sponsor Outreach Pitch Deck
```bash
python -m backend.app.cli sponsor --brand "CRED" --guest "Kunal Shah" --goal "Premium User Acquisition"
```

---

## 🌐 Full-Stack Application Endpoints

When running in full-stack mode:
- **Frontend Dashboard:** `http://localhost:3000` (Next.js App Router, Tailwind CSS, Framer Motion, Studio Dark Warm Palette)
- **FastAPI Core Server:** `http://localhost:8000`
- **Swagger Documentation:** `http://localhost:8000/docs`

| Route | Method | Description |
|---|---|---|
| `/guests/research` | POST | Generates complete 50-question dossier |
| `/podcastgpt/chat` | POST | ChromaDB vector semantic Q&A |
| `/shorts/find` | POST | Viral clip extractor with 9:16 captions |
| `/content/repurpose` | POST | Multi-tone content transformation |
| `/sponsors/outreach` | POST | Brand pitch deck & ROAS calculator |
| `/analytics` | GET | Token parameters & studio telemetry |

---

## 🎙️ Agensi Marketplace Listing Specifications

- **Skill Name:** `podcast-os`
- **Listing Tier:** Pro Studio / Developer ($19/mo or Free Community)
- **Tool Key Consumption:** Compatible with Agensi's 4,500+ unified tools, including ElevenLabs audio narration, MiniMax, and HeyGen synthetic avatars.
- **Offline Reliability:** Seamless fallback to local ChromaDB vector embeddings and curated knowledge bases when outside network access is restricted.
