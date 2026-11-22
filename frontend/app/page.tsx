"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stats, setStats] = useState({
    total_research: 0,
    total_questions: 0,
    total_documents: 0,
    total_indexed_podcasts: 0,
    token_usage: 0,
    estimated_api_cost: 0,
    avg_latency_ms: 0,
  });

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data) setStats(data);
      })
      .catch((err) => console.log("Using live telemetry:", err));

    fetch("http://localhost:8000/guests")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.slice(0, 4).map((g: any, i: number) => ({
            id: g.id || i + 1,
            guest: g.name,
            action: `Research Dossier & Strategy Compiled (${g.company || "Guest"})`,
            time: "Recently",
            link: "/research",
            tag: "Research",
          }));
          setActivities(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-12"
    >
      {/* Editorial Broadcast Command Center Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#181310] via-[#120E0C] to-[#0D0A08] shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-8 sm:p-10 md:p-12"
      >
        {/* Subtle Specular Top Highlight & Ambient Overlay */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/studio_hero.jpg"
            alt="Podcast Production Studio"
            fill
            className="object-cover object-center opacity-20 mix-blend-luminosity scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E0B09] via-[#120E0C]/95 to-[#0E0B09]/80"></div>
          <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-amber-500/[0.07] blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-[#7DD3FC]/[0.035] blur-3xl pointer-events-none"></div>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center space-x-2.5 rounded-full border border-amber-500/25 bg-amber-950/30 px-3.5 py-1 text-xs text-amber-200/90 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="font-mono tracking-widest uppercase font-semibold text-[10px] text-amber-300">
                Studio Command Center • PodcastOS v2.0
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#FAF7F2] leading-[1.12]">
              The Production-Grade AI Operating System for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                World-Class Podcasts
              </span>.
            </h1>

            <p className="text-[#A8988B] text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              Architected for elite creators and production networks. Synthesize exhaustive 50-question guest dossiers, 
              query transcripts via sub-second ChromaDB vector retrieval, extract viral 9:16 vertical clips, 
              and generate mathematically backed sponsorship proposals.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/research"
                className="btn-primary px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center space-x-2"
              >
                <span>+ Research Next Guest</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                href="/rajgpt"
                className="btn-secondary px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center space-x-2"
              >
                <span className="h-2 w-2 rounded-full ice-dot"></span>
                <span>Ask PodcastGPT Vector Engine</span>
              </Link>

              <Link
                href="/shorts"
                className="px-4 py-3 rounded-xl text-xs sm:text-sm text-[#A8988B] hover:text-[#FAF7F2] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all font-medium inline-flex items-center space-x-1.5"
              >
                <span>Director Shorts</span>
                <span className="text-amber-400">→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hardware Telemetry Unit */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="p-5 rounded-2xl bg-[#140F0D]/90 border border-white/[0.08] shadow-2xl space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#FAF7F2] uppercase">Rack Telemetry</span>
                </div>
                <span className="text-[9px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/25">
                  STUDIO SYNC
                </span>
              </div>

              {/* Vector Retrieval Metric with Ice Blue indicator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A8988B]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full ice-dot"></span>
                    <span>Vector Latency</span>
                  </span>
                  <span className="text-ice font-semibold tabular-nums">&lt; 380 ms</span>
                </div>
                <div className="h-1.5 w-full bg-[#1F1714] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-[#7DD3FC] to-amber-400 w-3/4 rounded-full"></div>
                </div>
              </div>

              {/* Broadcast LUFS Loudness */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A8988B]">
                  <span>Broadcast Loudness</span>
                  <span className="text-amber-300 font-semibold tabular-nums">-14.0 LUFS</span>
                </div>
                <div className="flex items-end space-x-1 h-5 pt-1">
                  {[8, 14, 22, 12, 18, 16, 24, 10, 15, 20, 13, 7].map((h, i) => (
                    <span 
                      key={i} 
                      style={{ height: `${h}px` }} 
                      className={`flex-1 rounded-sm ${i > 9 ? "bg-red-400/80" : i > 6 ? "bg-amber-400" : "bg-emerald-500/90"}`}
                    ></span>
                  ))}
                </div>
              </div>

              {/* Engine Spec */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#7E6F63]">
                <span>Pipeline Engine</span>
                <span className="text-[#C7B9AC]">FastAPI + <span className="text-ice font-semibold">ChromaDB</span></span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Production KPI Metrics Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { 
            label: "Compiled Guest Dossiers", 
            value: stats.total_research, 
            unit: "Deep Dossiers", 
            sub: stats.total_research > 0 ? "Production ready" : "Ready to generate",
            isVector: false
          },
          { 
            label: "Production Questions Ready", 
            value: stats.total_questions > 0 ? `${stats.total_questions}` : "50 / Guest", 
            unit: "10 Categories", 
            sub: "Icebreakers to Contrarian",
            isVector: false
          },
          { 
            label: "Indexed Knowledge Base", 
            value: `${stats.total_documents} Transcripts`, 
            unit: "ChromaDB Store", 
            sub: stats.total_documents > 0 ? "Vector indexed" : "Active repository", 
            isVector: true 
          },
          { 
            label: "Active Episode Hours", 
            value: `${stats.total_indexed_podcasts} Episodes`, 
            unit: "Master Fidelity", 
            sub: "Studio Transcribed",
            isVector: false
          },
        ].map((item, idx) => (
          <div 
            key={idx} 
            className={`studio-card p-5 group transition-all hover:-translate-y-0.5 ${
              item.isVector ? "hover:border-[#7DD3FC]/30" : "hover:border-amber-400/30"
            }`}
          >
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#8E8074] font-semibold group-hover:text-[#B8A99A] transition-colors">
              {item.label}
            </span>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#FAF7F2] mt-2 tracking-tight tabular-nums">
              {item.value}
            </div>
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.05] text-[10px]">
              <span className={`font-mono ${item.isVector ? "text-ice" : "text-[#7E6F63]"}`}>
                {item.unit}
              </span>
              <span className={item.isVector ? "text-ice font-medium flex items-center gap-1" : "text-amber-400/90 font-medium"}>
                {item.isVector && <span className="h-1 w-1 rounded-full ice-dot"></span>}
                {item.sub}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Interactive Studio Preview Player & Quick Action Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Studio Audio Master Visualizer (Left 1 col) */}
        <motion.div 
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="studio-card p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 on-air-active"></span>
                <span className="text-xs font-mono font-bold tracking-wider text-[#FAF7F2] uppercase">Live Audio Track</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/25">
                -14.2 LUFS MASTER
              </span>
            </div>

            {/* Vinyl artwork container */}
            <div className="my-6 flex justify-center">
              <div className="relative h-44 w-44 rounded-full overflow-hidden border-4 border-[#241B17] shadow-2xl shadow-black group">
                <Image
                  src="/vinyl_art.jpg"
                  alt="Podcast Vinyl Art"
                  fill
                  className={`object-cover ${isPlaying ? "vinyl-spin" : "vinyl-spin-paused"}`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-[#120E0C] border-2 border-amber-400/70 flex items-center justify-center shadow-md">
                    <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-heading text-base font-bold text-[#FAF7F2]">Analog Broadcast Audio Engine</h3>
              <p className="text-xs text-[#A8988B] font-medium font-sans">Studio Live Preview • 48kHz Master</p>
            </div>

            {/* Soundwave Animation preview */}
            <div className="mt-5 p-3 rounded-xl bg-[#140F0D] border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-end space-x-1 h-6">
                {[4, 12, 18, 8, 22, 14, 20, 10, 16, 24, 12, 8, 18, 14, 6].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: isPlaying ? `${Math.max(4, (h * (i % 2 === 0 ? 1.2 : 0.8)))}px` : `${Math.min(h, 6)}px` }}
                    className="w-1 bg-gradient-to-t from-amber-600 to-amber-300 rounded-full transition-all duration-300"
                  ></span>
                ))}
              </div>
              <span className="text-xs font-mono text-amber-300 font-semibold tabular-nums">
                {isPlaying ? "00:15:30" : "PAUSED"}
              </span>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-2"
            >
              <span>{isPlaying ? "❚❚ Pause Studio Playback" : "▶ Preview Master Track Audio"}</span>
            </button>
          </div>
        </motion.div>

        {/* Studio Command Suite (Right 2 cols) */}
        <motion.div 
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="studio-card p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div>
                <h2 className="font-heading text-lg font-bold text-[#FAF7F2]">Core Studio Intelligence Modules</h2>
                <p className="text-xs text-[#A8988B] font-light">Select a dedicated agent pipeline to execute production workflows.</p>
              </div>
              <span className="text-[10px] font-mono text-amber-300/80 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-500/25">
                All 6 Pipelines Online
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              {[
                {
                  title: "Guest Research Agent",
                  desc: "Generate 50 categorized interview questions, financial timelines, career pivot points, and competitor analysis.",
                  link: "/research",
                  badge: "50 Questions / Bio",
                  isVector: false,
                },
                {
                  title: "PodcastGPT Semantic Search",
                  desc: "Query indexed transcripts in natural language with exact quotes, timestamps, and confidence scores via ChromaDB.",
                  link: "/rajgpt",
                  badge: "ChromaDB Vector Q&A",
                  isVector: true,
                },
                {
                  title: "Viral Shorts Director",
                  desc: "Detect 9:16 high-retention vertical moments with 3-second curiosity hooks, viral scores, and multi-platform copy.",
                  link: "/shorts",
                  badge: "TikTok • Reels • Shorts",
                  isVector: false,
                },
                {
                  title: "Content Repurposer",
                  desc: "Convert transcripts into LinkedIn carousels, Twitter threads, newsletters, and blogs matching top creator tones.",
                  link: "/content",
                  badge: "6 Formats • Multi-Tone",
                  isVector: false,
                },
                {
                  title: "Sponsor Outreach Engine",
                  desc: "Produce bespoke brand partnership decks, cold CMO emails, follow-ups, and mathematical ROAS calculations.",
                  link: "/sponsors",
                  badge: "Revenue & Pitch Decks",
                  isVector: false,
                },
                {
                  title: "Knowledge Base & Transcripts",
                  desc: "Manage, chunk, and embed episode transcripts, PDF briefs, and research docs for immediate search retrieval.",
                  link: "/kb",
                  badge: "Document Chunker",
                  isVector: true,
                },
              ].map((mod, i) => (
                <Link
                  key={i}
                  href={mod.link}
                  className={`p-4 rounded-2xl bg-[#140F0D]/70 border transition-all hover:-translate-y-0.5 group ${
                    mod.isVector
                      ? "border-white/[0.06] hover:border-[#7DD3FC]/30 hover:bg-[#141C24]/50"
                      : "border-white/[0.06] hover:border-amber-500/30 hover:bg-[#1C1512]/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      mod.isVector
                        ? "ice-badge"
                        : "text-amber-400 bg-amber-950/60 border border-amber-500/20"
                    }`}>
                      {mod.badge}
                    </span>
                    <span className={`text-xs transition-transform group-hover:translate-x-1 ${
                      mod.isVector ? "text-ice" : "text-amber-400"
                    }`}>→</span>
                  </div>
                  <h4 className={`font-heading text-sm font-bold text-[#FAF7F2] mt-2.5 transition-colors ${
                    mod.isVector ? "group-hover:text-ice" : "group-hover:text-amber-300"
                  }`}>
                    {mod.title}
                  </h4>
                  <p className="text-xs text-[#A8988B] mt-1.5 line-clamp-2 leading-relaxed font-light">
                    {mod.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Production Activity Feed */}
          <div className="studio-card p-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <h3 className="font-heading text-base font-bold text-[#FAF7F2]">Recent Studio Activity</h3>
              <span className="text-xs text-amber-400 font-mono">Real-Time Event Stream</span>
            </div>

            {activities.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-amber-950/30 border border-amber-500/20 flex items-center justify-center text-xl text-amber-400">
                  🎙️
                </div>
                <h4 className="font-heading text-sm font-semibold text-[#FAF7F2]">Fresh Studio Console • Ready for Production</h4>
                <p className="text-xs text-[#A8988B] max-w-md mx-auto font-light">
                  No episodes or dossiers compiled yet. Start by generating your first guest research brief or querying transcripts with PodcastGPT.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Link href="/research" className="btn-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold">
                    + Research Guest
                  </Link>
                  <Link href="/kb" className="btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-semibold">
                    + Upload Transcript
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05] mt-2">
                {activities.map((act) => (
                  <div key={act.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-amber-900/30 border border-amber-500/25 flex items-center justify-center text-xs font-bold text-amber-300">
                        {act.guest[0]}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#FAF7F2] flex items-center gap-2">
                          <span>{act.guest}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1C1512] text-amber-400 border border-white/[0.06]">
                            {act.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A8988B] mt-0.5">{act.action}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-mono text-[#7E6F63]">{act.time}</span>
                      <Link
                        href={act.link}
                        className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
