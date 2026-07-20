"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_research: 24,
    total_questions: 18,
    total_documents: 32,
    total_indexed_podcasts: 12,
    token_usage: 485000,
    estimated_api_cost: 1.24,
    avg_latency_ms: 1250,
  });

  const [activities, setActivities] = useState([
    { id: 1, guest: "Nikhil Kamath", action: "Research Dossier Generated", time: "2 hours ago", link: "/research" },
    { id: 2, guest: "Kunal Shah", action: "100 Interview Questions Prepared", time: "5 hours ago", link: "/research" },
    { id: 3, guest: "Bhavish Aggarwal", action: "Semantic transcript indexing", time: "1 day ago", link: "/kb" },
    { id: 4, guest: "Sponsor Pitch: CRED", action: "Outreach Proposal Generated", time: "2 days ago", link: "/sponsors" },
  ]);

  useEffect(() => {
    // Fetch stats from FastAPI backend if available
    fetch("http://localhost:8000/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data) setStats(data);
      })
      .catch((err) => console.log("Backend offline or unreachable, using pre-seeded stats:", err));
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner/Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/40 p-8 md:p-12">
        <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pulse-glow"></div>
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
            <span>✨ Phase 1 MVP Active</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">
            Everything your podcast team needs. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Powered by AI.
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            PodcastOS automates guest research, generates production-quality questions, 
            unlocks semantic transcript search, and identifies viral shorts moments instantly.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/research"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Research Guest
            </Link>
            <Link
              href="/rajgpt"
              className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
            >
              Ask PodcastGPT
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Research Reports", value: stats.total_research, detail: "Guests compiled" },
          { label: "Questions Generated", value: stats.total_questions, detail: "Interview questions" },
          { label: "Knowledge Base Docs", value: stats.total_documents, detail: "Indexed references" },
          { label: "Active Podcasts", value: stats.total_indexed_podcasts, detail: "Vector store indexed" },
        ].map((item, i) => (
          <div key={i} className="glass-card rounded-xl p-5 space-y-2">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{item.label}</span>
            <div className="text-3xl font-bold text-white tracking-tight">{item.value}</div>
            <p className="text-xs text-slate-500">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Main Panel grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Recent activity */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white tracking-tight">Recent Activity</h2>
          <div className="rounded-xl border border-white/[0.06] bg-slate-950/20 divide-y divide-white/[0.04] overflow-hidden">
            {activities.map((act) => (
              <div key={act.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-white">{act.guest}</div>
                  <div className="text-xs text-slate-400">{act.action}</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-[10px] text-slate-500">{act.time}</div>
                  <Link href={act.link} className="text-xs text-indigo-400 hover:underline">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Quick Action & Shortcuts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white tracking-tight">Keyboard Shortcuts</h2>
          <div className="glass-card rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-white/[0.06] pb-2">
              <span className="text-slate-400">Search Command Palette</span>
              <kbd className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 font-mono text-slate-300">Ctrl + K</kbd>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-white/[0.06] pb-2">
              <span className="text-slate-400">Jump to Research</span>
              <kbd className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 font-mono text-slate-300">G then R</kbd>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-white/[0.06] pb-2">
              <span className="text-slate-400">Ask PodcastGPT</span>
              <kbd className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 font-mono text-slate-300">G then P</kbd>
            </div>
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="text-slate-400">Settings & Keys</span>
              <kbd className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 font-mono text-slate-300">G then S</kbd>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-5 bg-gradient-to-br from-indigo-950/20 to-purple-950/20 space-y-3">
            <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Episode Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload a podcast transcript and automatically generate summary, chapters, social drafts, and viral clips inside the Knowledge Base.
            </p>
            <Link href="/kb" className="inline-block text-xs font-medium text-white underline hover:text-indigo-300">
              Upload transcript →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
