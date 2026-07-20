"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./globals.css";

// SVG Icons Map for extreme stability
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  ),
  shorts: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  ),
  content: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
    </svg>
  ),
  sponsors: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5M4.5 19.5h15M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  kb: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75" />
    </svg>
  ),
  prompts: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
  ),
  analytics: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  ),
  settings: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.936 6.936 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
};

const navigation = [
  { name: "Dashboard", href: "/", icon: Icons.dashboard },
  { name: "Guest Research", href: "/research", icon: Icons.research },
  { name: "PodcastGPT Chat", href: "/rajgpt", icon: Icons.chat },
  { name: "Viral Shorts Finder", href: "/shorts", icon: Icons.shorts },
  { name: "Content Repurposer", href: "/content", icon: Icons.content },
  { name: "Sponsor Outreach", href: "/sponsors", icon: Icons.sponsors },
  { name: "Knowledge Base", href: "/kb", icon: Icons.kb },
  { name: "AI Prompt Library", href: "/prompts", icon: Icons.prompts },
  { name: "Analytics Dashboard", href: "/analytics", icon: Icons.analytics },
  { name: "Settings & Keys", href: "/settings", icon: Icons.settings },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K toggles Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      
      // Escape closes Command Palette
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }

      // Quick Nav shortcuts (G then R -> Research, etc.) when not typing in inputs
      if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        if (e.key === "g") {
          const listenNext = (nextEvent: KeyboardEvent) => {
            if (nextEvent.key === "r") router.push("/research");
            if (nextEvent.key === "p") router.push("/rajgpt");
            if (nextEvent.key === "s") router.push("/settings");
            if (nextEvent.key === "k") router.push("/kb");
            window.removeEventListener("keydown", listenNext);
          };
          window.addEventListener("keydown", listenNext);
          setTimeout(() => window.removeEventListener("keydown", listenNext), 1000);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // Focus input when command palette opens
  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [commandPaletteOpen]);

  const filteredCommands = navigation.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <html lang="en" suppressHydrationWarning className="h-full bg-[#030712] text-slate-100 antialiased selection:bg-indigo-500/30">
      <body className="h-full font-sans" suppressHydrationWarning>
        <div className="flex h-full min-h-screen">
          {/* Static Sidebar */}
          <aside className="hidden md:flex md:w-64 md:flex-col border-r border-white/[0.06] bg-slate-950/40 backdrop-blur-md p-6 space-y-6">
            <div className="flex items-center space-x-2 pb-4 border-b border-white/[0.06]">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                P
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">PodcastOS</span>
            </div>
            
            <nav className="flex-1 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? "bg-indigo-600/15 text-indigo-400 border-l-2 border-indigo-500"
                        : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-white/[0.06] text-xs text-slate-500 space-y-2">
              <div className="flex items-center justify-between">
                <span>API Status</span>
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[10px] text-slate-600 leading-normal">
                Press <kbd className="rounded border border-slate-800 bg-slate-900 px-1 py-0.2">Ctrl+K</kbd> to search everything
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            {/* Top Bar for Mobile */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] px-6 md:hidden bg-slate-950/20 backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <div className="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">P</div>
                <span className="font-semibold text-white">PodcastOS</span>
              </div>
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="rounded-lg border border-white/[0.08] bg-slate-900/40 p-2 text-slate-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </header>

            {/* Inner Dashboard Page Content */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-16">
              {children}
            </main>

            {/* Footer Disclaimer */}
            <footer className="py-6 px-8 border-t border-white/[0.04] bg-slate-950/20 text-center text-xs text-slate-500">
              <p>PodcastOS is an independent portfolio project inspired by modern podcast production workflows.</p>
              <p className="mt-1 text-[10px] text-slate-600">It is not affiliated with Figuring Out Media or Raj Shamani.</p>
            </footer>
          </div>
        </div>

        {/* Command Palette Modal */}
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setCommandPaletteOpen(false)}></div>
            
            {/* Palette Panel */}
            <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0f17] shadow-2xl flex flex-col">
              <div className="flex items-center space-x-3 px-4 border-b border-white/[0.06]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search pages, commands, settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 text-sm bg-transparent border-0 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="max-h-72 overflow-y-auto p-2">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd) => (
                    <button
                      key={cmd.name}
                      onClick={() => {
                        router.push(cmd.href);
                        setCommandPaletteOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-sm text-slate-300 hover:bg-indigo-600 hover:text-white transition-all group"
                    >
                      <cmd.icon className="h-5 w-5 text-slate-500 group-hover:text-white" />
                      <span>{cmd.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-slate-500">No results found for &quot;{searchQuery}&quot;</div>
                )}
              </div>
              <div className="bg-slate-950/60 px-4 py-2 border-t border-white/[0.04] text-[10px] text-slate-600 flex justify-between">
                <span>Use arrows to navigate, Esc to close</span>
                <span>Select with Enter</span>
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
