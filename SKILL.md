---
name: podcast-os
title: PodcastOS — Studio AI Operating System
description: The AI Operating System for Modern Podcast Studios & Creator Networks.
version: 2.0.0
author: Siddharth Sharma (@SiddSynth)
homepage: https://github.com/SiddSynth/Podcast-OS
tags:
  - podcast
  - media-production
  - guest-research
  - transcripts
  - viral-shorts
  - sponsor-sales
---

# PodcastOS 🎙️ — Agensi AI Agent Skill

### The Production Operating System for World-Class Podcast Studios & Media Teams

PodcastOS turns any AI agent (Claude Code, Cursor, Codex CLI, Antigravity) into an elite **Executive Podcast Producer**. It automates every phase of the media production lifecycle:

1. **Guest Research & 50-Question Dossier:** Compiles executive summaries, career milestones, controversies, fast facts, and 50 categorized interview questions across 10 tactical dimensions.
2. **PodcastGPT Semantic Vector Retrieval:** Real-time semantic search over indexed podcast transcripts with exact citations, timestamps, and confidence scores powered by ChromaDB.
3. **Viral Shorts & Reels Director:** Evaluates transcripts for 3-second opening psychological curiosity hooks, predicted virality scores (1–100), and vertical subtitles with CapCut/Premiere directives.
4. **Multi-Format Content Repurposer:** Converts raw episode transcripts into LinkedIn story posts, 5-slide PDF carousels, 5-tweet threads, newsletters, and SEO blog articles matching top creator personas.
5. **Sponsor Monetization & Pitch Engine:** Crafts hyper-targeted brand pitch decks, tiered rate cards ($8.5k, $4.5k, $2.2k), and mathematical ROAS/CPM payback analysis.

---

## 🛠️ CLI Quickstart & Agent Commands

Run any of the built-in commands directly via CLI:

### 1. Research a Guest & Generate 50 Questions
```bash
python -m backend.app.cli research --name "Jensen Huang" --company "NVIDIA"
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
**Output:** High-retention video moments with 3-second psychology hooks, vertical subtitles, and platform copy.

### 4. Repurpose Episode into Multi-Platform Assets
```bash
python -m backend.app.cli repurpose --file "sample_data/sample_transcript_1.txt" --tone "Thought Leadership"
```

### 5. Generate Sponsor Pitch & Rate Card
```bash
python -m backend.app.cli sponsor --brand "CRED" --guest "Kunal Shah" --goal "Premium User Acquisition"
```

---

## 🌐 Full-Stack Application Endpoints

When running in full-stack studio mode:
- **Frontend Dashboard:** `http://localhost:3000` (Next.js App Router, Tailwind CSS, Luxury Studio Palette)
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

- **Skill Name:** `PodcastOS — Studio AI Operating System`
- **Category:** Media Production / AI Content Automation
- **Compatibility:** Agensi, Claude Code, Cursor, Codex, OpenClaw
- **Offline Reliability:** Instant local fallback for guest research, vector lookup, and clip scoring when network access is restricted.
