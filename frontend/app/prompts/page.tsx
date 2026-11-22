"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = ["All", "Research", "Podcast", "Marketing", "Sponsor Outreach"];

  const defaultPrompts = [
    {
      id: 1,
      title: "Expert Bio & Tactical Dossier",
      prompt_text: "Extract a comprehensive 3-paragraph executive summary of the guest's career timeline, highlight their critical pivot points, major controversies, and 3 contrarian stances they hold against industry consensus.",
      category: "Research",
      tags: "Research,Bio,Summary,Preparation",
      is_favorite: true
    },
    {
      id: 2,
      title: "50 Categorized Interview Questions",
      prompt_text: "Generate 50 categorized, deep, probing interview questions across Ice Breakers, Career, Business, Leadership, Tech/AI, Future Trends, Rapid Fire, Deep Philosophy, and Contrarian Takes.",
      category: "Podcast",
      tags: "Podcast,Questions,Interview,50Questions",
      is_favorite: true
    },
    {
      id: 3,
      title: "High-Retention 3-Second Hooks",
      prompt_text: "Identify the top 3 most contrarian, shocking, or value-dense statements in the transcript and write 3-second opening video hooks with bold text overlays.",
      category: "Marketing",
      tags: "Social Media,Shorts,TikTok,Reels,Hooks",
      is_favorite: true
    },
    {
      id: 4,
      title: "LinkedIn Thought-Leadership Story",
      prompt_text: "Transform a raw transcript segment into a 250-word masterclass post formatted with punchy one-sentence lines, whitespace gaps, actionable bullet points, and an engagement CTA.",
      category: "Marketing",
      tags: "LinkedIn,Viral,ThoughtLeadership,Repurposing",
      is_favorite: false
    },
    {
      id: 5,
      title: "Brand Sponsor Value Deck & Cold Email",
      prompt_text: "Write a high-converting cold email addressed to the brand's CMO citing verified episode reach (1.2M+), demographic overlap, custom host-read script concepts, and guaranteed CPM metrics.",
      category: "Sponsor Outreach",
      tags: "Sales,Outreach,Sponsors,Revenue",
      is_favorite: true
    },
    {
      id: 6,
      title: "Executive Newsletter Edition",
      prompt_text: "Summarize the core philosophical thesis of the podcast episode into a 400-word VIP newsletter edition with a curiosity-driven subject line, 3 tactical takeaways, and quote of the week.",
      category: "Marketing",
      tags: "Newsletter,Substack,Editorial,Email",
      is_favorite: false
    },
    {
      id: 7,
      title: "Audio Master Track Cleanup Checklist",
      prompt_text: "Generate an automated audio engineering pre-flight checklist for multi-mic Shure SM7B setups, verifying gain staging (-12dB to -6dB peak), room tone de-bleed, compressor threshold, and LUFS target (-14 LUFS for Spotify/YouTube).",
      category: "Podcast",
      tags: "Audio,Production,Engineering,LUFS,Quality",
      is_favorite: true
    },
    {
      id: 8,
      title: "Rapid-Fire Contrarian Probe",
      prompt_text: "Create 10 quick-fire questions that force the guest to choose between two uncomfortable truths, revealing their authentic decision-making heuristics under pressure.",
      category: "Podcast",
      tags: "Interview,RapidFire,Psychology,Contrarian",
      is_favorite: false
    }
  ];

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:8000/prompts";
      const params: string[] = [];
      if (selectedCategory !== "All") params.push(`category=${selectedCategory}`);
      if (favoritesOnly) params.push(`favorite_only=true`);
      if (params.length > 0) url += `?${params.join("&")}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPrompts(data.length > 0 ? data : defaultPrompts);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Local fallback
      let filtered = [...defaultPrompts];
      if (selectedCategory !== "All") {
        filtered = filtered.filter((p) => p.category === selectedCategory);
      }
      if (favoritesOnly) {
        filtered = filtered.filter((p) => p.is_favorite);
      }
      setPrompts(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [selectedCategory, favoritesOnly]);

  const copyPrompt = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/prompts/${id}/favorite`, { method: "PUT" });
    } catch {}
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_favorite: !p.is_favorite } : p))
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-amber-400 bg-amber-950/30 px-3 py-1 rounded-full border border-amber-500/25 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
          <span className="tracking-widest uppercase font-semibold text-[10px]">CURATED PRODUCTION PROMPT TEMPLATES</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FAF7F2]">
          AI Prompt Studio Library
        </h1>
        <p className="text-xs sm:text-sm text-[#A8988B] mt-1 font-light">
          Production-tested prompt architectures for guest research, interview questioning, retention shorts, and sponsor proposals.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl studio-card">
        <div className="flex items-center space-x-2 overflow-x-auto text-xs">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === c
                  ? "bg-amber-500/20 border border-amber-400/40 text-amber-200 font-semibold shadow-sm"
                  : "bg-[#140F0D] border border-white/[0.06] text-[#A8988B] hover:border-amber-500/30 hover:text-[#FAF7F2]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border flex items-center space-x-1.5 transition-all ${
            favoritesOnly
              ? "bg-amber-500/20 border-amber-400/40 text-amber-200 font-semibold"
              : "bg-[#140F0D] border-white/[0.06] text-[#A8988B] hover:border-amber-500/30"
          }`}
        >
          <span>★</span>
          <span>{favoritesOnly ? "Showing Favorites Only" : "Filter Favorites"}</span>
        </button>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {prompts.map((prompt, i) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
            whileHover={{ y: -2 }}
            className="studio-card p-6 flex flex-col justify-between space-y-4 group hover:border-amber-400/30 transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                  prompt.category === "Research" 
                    ? "ice-badge" 
                    : "text-amber-400 bg-amber-950/60 border border-amber-500/20"
                }`}>
                  {prompt.category}
                </span>
                <button
                  onClick={() => toggleFavorite(prompt.id)}
                  className={`text-sm transition-transform active:scale-125 ${prompt.is_favorite ? "text-amber-400" : "text-[#544941] hover:text-amber-400"}`}
                >
                  ★
                </button>
              </div>

              <h3 className="font-heading text-base font-bold text-[#FAF7F2]">{prompt.title}</h3>
              <p className="text-xs text-[#C7B9AC] leading-relaxed line-clamp-3 bg-[#140F0D] p-3 rounded-xl border border-white/[0.06] font-mono font-light">
                "{prompt.prompt_text}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
              <span className="text-[10px] font-mono text-[#7E6F63] truncate max-w-[180px]">
                {prompt.tags}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyPrompt(prompt.id, prompt.prompt_text)}
                  className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  {copiedId === prompt.id ? "✓ Copied" : "Copy Prompt"}
                </button>
                <Link
                  href={prompt.category === "Research" ? "/research" : prompt.category === "Sponsor Outreach" ? "/sponsors" : "/content"}
                  className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  Run Agent →
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
