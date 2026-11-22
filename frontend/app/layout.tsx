"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import "./globals.css";

// SVG Icons tailored for studio podcasting
const Icons = {
  dashboard: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  research: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  chat: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v7.5a3 3 0 0 1-3 3Z" />
    </svg>
  ),
  shorts: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  ),
  content: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  ),
  sponsors: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5M4.5 19.5h15M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  kb: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  prompts: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  ),
  analytics: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  ),
  settings: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
  )
};

// Studio Production Navigation (Warm Gold primary domain)
const studioNav = [
  { name: "Studio Console", href: "/", icon: Icons.dashboard, isTechnical: false },
  { name: "Guest Research", href: "/research", icon: Icons.research, isTechnical: false },
  { name: "Viral Shorts Director", href: "/shorts", icon: Icons.shorts, isTechnical: false },
  { name: "Content Repurposer", href: "/content", icon: Icons.content, isTechnical: false },
  { name: "Sponsor Sales", href: "/sponsors", icon: Icons.sponsors, isTechnical: false },
];

// Intelligence & Data Navigation (Ice Blue technical domain)
const intelligenceNav = [
  { name: "PodcastGPT Intelligence", href: "/rajgpt", icon: Icons.chat, isTechnical: true, badge: "AI" },
  { name: "Knowledge Base", href: "/kb", icon: Icons.kb, isTechnical: true, badge: "RAG" },
  { name: "AI Prompt Library", href: "/prompts", icon: Icons.prompts, isTechnical: false },
  { name: "Studio Analytics", href: "/analytics", icon: Icons.analytics, isTechnical: false },
  { name: "Settings & Telemetry", href: "/settings", icon: Icons.settings, isTechnical: true },
];

const allNavigation = [...studioNav, ...intelligenceNav];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiOnline, setApiOnline] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
      if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        if (e.key === "g") {
          const listenNext = (nextEvent: KeyboardEvent) => {
            if (nextEvent.key === "r") router.push("/research");
            if (nextEvent.key === "p") router.push("/rajgpt");
            if (nextEvent.key === "s") router.push("/shorts");
            if (nextEvent.key === "c") router.push("/content");
            if (nextEvent.key === "o") router.push("/sponsors");
            if (nextEvent.key === "k") router.push("/kb");
            if (nextEvent.key === "l") router.push("/prompts");
            if (nextEvent.key === "a") router.push("/analytics");
            window.removeEventListener("keydown", listenNext);
          };
          window.addEventListener("keydown", listenNext, { once: true });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  // Health check on backend
  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => {
        if (res.ok) setApiOnline(true);
      })
      .catch(() => setApiOnline(false));
  }, []);

  const filteredNav = allNavigation.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <html lang="en">
      <head>
        <title>PodcastOS — The Production Studio Operating System</title>
        <meta name="description" content="High-end creative studio × broadcast control room × premium AI software." />
      </head>
      <body className="flex h-screen overflow-hidden antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {/* Left Studio Operating System Sidebar */}
        <aside className="w-64 border-r border-white/[0.06] bg-[#0E0B09]/95 flex flex-col justify-between hidden md:flex z-20 backdrop-blur-md">
          <div className="flex flex-col h-full">
            {/* Studio Header Brand */}
            <div className="h-20 border-b border-white/[0.06] px-5 flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-black/80 border border-amber-400/30 group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-50" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4Zm6.5 10a.75.75 0 0 0-1.5 0 5 5 0 0 1-10 0 .75.75 0 0 0-1.5 0 6.5 6.5 0 0 0 6 6.45V20.5H9a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-2.5v-2.05A6.5 6.5 0 0 0 18.5 12Z" />
                  </svg>
                </div>
                <div>
                  <div className="font-heading tracking-wide text-base font-bold text-[#FAF7F2] flex items-center gap-1.5">
                    Podcast<span className="text-amber-400">OS</span>
                  </div>
                  <div className="text-[10px] tracking-widest uppercase text-amber-300/70 font-mono font-medium">
                    Studio Suite
                  </div>
                </div>
              </Link>
              
              {/* ON AIR Badge */}
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-950/40 border border-red-500/25">
                <span className="h-2 w-2 rounded-full bg-red-500 on-air-active"></span>
                <span className="text-[9px] font-mono font-bold tracking-wider text-red-300">ON AIR</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
              {/* Group 1: Studio Production */}
              <div className="space-y-1">
                <div className="px-3 pb-1.5 text-[10px] font-semibold tracking-widest text-[#7E6F63] uppercase font-mono">
                  Studio Production
                </div>
                {studioNav.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "text-[#FAF7F2] font-semibold bg-white/[0.04] border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                          : "text-[#9E9084] hover:text-[#FAF7F2] hover:bg-white/[0.03]"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#E5A93C] shadow-[0_0_8px_rgba(229,169,60,0.6)]" />
                      )}
                      <item.icon className={`h-4 w-4 relative z-10 transition-colors ${isActive ? "text-amber-400" : "text-[#7E6F63]"}`} />
                      <span className="truncate relative z-10">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Group 2: Intelligence & System */}
              <div className="space-y-1">
                <div className="px-3 pb-1.5 text-[10px] font-semibold tracking-widest text-[#7E6F63] uppercase font-mono flex items-center justify-between">
                  <span>Intelligence & System</span>
                  <span className="h-1 w-1 rounded-full bg-[#7DD3FC]/50"></span>
                </div>
                {intelligenceNav.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "text-[#FAF7F2] font-semibold bg-[#7DD3FC]/[0.06] border border-[#7DD3FC]/25 shadow-[inset_0_1px_0_rgba(125,211,252,0.12)]"
                          : "text-[#9E9084] hover:text-[#FAF7F2] hover:bg-white/[0.03]"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#7DD3FC] shadow-[0_0_8px_rgba(125,211,252,0.7)]" />
                      )}
                      <item.icon className={`h-4 w-4 relative z-10 transition-colors ${isActive ? "text-[#7DD3FC]" : "text-[#7E6F63]"}`} />
                      <span className="truncate relative z-10">{item.name}</span>
                      {item.badge && (
                        <span className={`ml-auto relative z-10 text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                          isActive
                            ? "border-[#7DD3FC]/40 bg-[#7DD3FC]/15 text-[#7DD3FC] font-bold"
                            : "border-[#7DD3FC]/20 bg-[#7DD3FC]/5 text-[#7DD3FC]/80 font-medium"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Status Dock */}
            <div className="p-3 border-t border-white/[0.06] bg-[#0A0807]/90 space-y-2">
              {/* Broadcast VU Meter Simulation */}
              <div className="px-2.5 py-2 rounded-xl bg-[#14100E] border border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#8C7B6E]">VU Meter (L/R)</span>
                <div className="flex items-end space-x-0.5 h-3.5">
                  <span className="w-1 bg-emerald-500 rounded-sm soundwave-bar-1"></span>
                  <span className="w-1 bg-emerald-400 rounded-sm soundwave-bar-2"></span>
                  <span className="w-1 bg-amber-400 rounded-sm soundwave-bar-3"></span>
                  <span className="w-1 bg-emerald-400 rounded-sm soundwave-bar-4"></span>
                  <span className="w-1 bg-red-400 rounded-sm soundwave-bar-5"></span>
                </div>
              </div>

              {/* Status Indicator & Search Palette Hint */}
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex items-center space-x-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${apiOnline ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`}></span>
                  <span className="text-[11px] text-[#A8988B] font-mono">{apiOnline ? "Core Live" : "Offline"}</span>
                </div>
                <button
                  onClick={() => setCommandPaletteOpen(true)}
                  className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#181310] text-[#B8A99A] hover:text-amber-300 border border-white/[0.06] transition-colors"
                >
                  <span>Ctrl+K</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-transparent">
          {/* Top Bar with Studio Ambience */}
          <header className="h-16 border-b border-white/[0.06] bg-[#0E0B09]/90 backdrop-blur-md px-6 flex items-center justify-between z-10">
            <div className="flex items-center space-x-4">
              <span className="font-heading text-sm font-bold text-[#FAF7F2] hidden sm:inline tracking-wide">
                PodcastOS Media Studio
              </span>
              <div className="h-4 w-px bg-white/[0.08] hidden sm:inline"></div>
              <span className="text-xs text-[#9E9084] hidden md:inline">
                Automated Guest Dossiers • Semantic Transcripts • Viral Hooks • Sponsor Sales
              </span>
              <div className="h-4 w-px bg-white/[0.08] hidden xl:inline"></div>
              
              {/* ChromaDB Vector Telemetry Pill */}
              <div className="hidden xl:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0E2A3C]/40 border border-[#7DD3FC]/25 text-[10px] font-mono text-ice">
                <span className="h-1.5 w-1.5 rounded-full ice-dot"></span>
                <span className="font-semibold">ChromaDB Vector: Sync</span>
                <span className="text-ice-muted font-normal">(&lt; 380ms)</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Quick Search Button */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#181310] hover:bg-[#201915] border border-white/[0.08] hover:border-amber-500/30 text-xs text-[#B8A99A] hover:text-[#FAF7F2] transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Command Menu</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#110E0C] text-amber-300/80 rounded border border-white/[0.06]">
                  ⌘K
                </kbd>
              </button>

              <Link
                href="/research"
                className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 shadow-sm"
              >
                <span>+ Research Guest</span>
              </Link>
            </div>
          </header>

          {/* Page Body with Smooth Route Transitions */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-7xl mx-auto"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Command Palette Modal */}
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-xl rounded-2xl glass-card border border-white/[0.1] overflow-hidden shadow-2xl shadow-black/90">
              <div className="p-4 border-b border-white/[0.08] flex items-center space-x-3 bg-[#14100E]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Jump to studio section, agent, or shortcut..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#FAF7F2] placeholder-[#7E6F63] focus:outline-none"
                />
                <button
                  onClick={() => setCommandPaletteOpen(false)}
                  className="text-xs text-[#8C7B6E] hover:text-[#FAF7F2] px-2 py-1 rounded-lg bg-[#1D1714] border border-white/[0.06]"
                >
                  ESC
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto p-2 space-y-1 bg-[#100D0B]">
                {filteredNav.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.href);
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs text-[#C7B9AC] hover:text-[#FAF7F2] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={`h-4 w-4 ${item.isTechnical ? "text-[#7DD3FC]" : "text-amber-400"}`} />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#7E6F63]">{item.href}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
