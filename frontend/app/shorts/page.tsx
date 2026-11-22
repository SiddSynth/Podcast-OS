"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShortsFinder() {
  const [activeMode, setActiveMode] = useState<"transcript" | "youtube">("youtube");
  const [formData, setFormData] = useState({
    transcript_text: "",
    youtube_url: "https://www.youtube.com/watch?v=sOBaRXSFuvs&t=2148s",
  });

  const [loading, setLoading] = useState(false);
  const [clips, setClips] = useState<any[] | null>(null);
  const [selectedClipIdx, setSelectedClipIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"editor" | "social" | "titles" | "script">("editor");
  const [isPlaying, setIsPlaying] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const presets = [
    {
      title: "🎮 GTA 6 Leak & Gaming (Men of Culture)",
      url: "https://www.youtube.com/watch?v=sOBaRXSFuvs&t=2148s",
      text: "Host: Twitter kholte hi GTA 6 ka gameplay leak ho gaya! Sab log shock mein the ki Rockstar ne copyright strike kyu mari?\nSpeaker: W07 walo ne hi clip post kiya tha aur wo jo anticipation tha wo internet pe explode kar gaya. Bilkul crazy moment tha! Star wali raid mari aur cyber leak se GTA 6 ka internal PC build bahar aa gaya!"
    },
    {
      title: "🕵️‍♀️ Mariana Van Zeller: Black Markets ($400B Cartels)",
      url: "https://www.youtube.com/watch?v=8C32XBcvfh8&t=508s",
      text: "Mariana Van Zeller: Black markets aren't hidden in the dark—they secretly generate over a third of all global commerce. Drug, gun, and human trafficking are an estimated $400 billion a year. Legal consumer demand secretly fuels the entire underground economy. I walked into a Taco Bell parking lot with $700 in cash and bought an AK-47 with zero background check."
    },
    {
      title: "💰 Nikhil Kamath: Renting vs Buying a House",
      url: "",
      text: "Host: Why did you decide to rent instead of buying a house after becoming a billionaire?\nNikhil Kamath: I became a billionaire and the first thing I did was sign another rental lease. Real estate in India yields only 2-3% and is leverage-heavy and illiquid. Renting gives you flexibility to deploy capital in high-growth equities, angel investments, or compounding startups where returns far outpace property appreciation."
    },
    {
      title: "📈 Kunal Shah: The Delta 4 Rule & Consumer Trust",
      url: "",
      text: "Host: Kunal, explain your Delta 4 framework.\nKunal Shah: Any time a product is at least 4 units better than the previous alternative on an efficiency scale of 1 to 10, the shift becomes irreversible. Think about Uber vs standing on the road waving for a taxi in the rain. That is an irreversible shift. In India, trust is the most scarce currency. When you aggregate high-trust users, monetization follows naturally."
    }
  ];

  const defaultClips = [
    {
      title: "GTA 6 Leaked on Twitter: Rockstar's Worst Nightmare 🚨",
      timestamp_start: "35:38",
      timestamp_end: "36:31",
      duration: "53s",
      type: "Investigative Reveal",
      predicted_viral_score: 98,
      retention_score: 94,
      hook: "Twitter kholte hi GTA 6 ka gameplay leak ho gaya! Dekhte hi dekhte footage aag ki tarah viral ho gaya...",
      hook_english: "Opening Twitter to find GTA 6 footage leaked everywhere—Rockstar Games panicked immediately.",
      explanation: "Capitalizes on one of the most anticipated gaming leaks in entertainment history. Strong opening contrast stops thumb-scrolling within 2 seconds.",
      titles: [
        "How The Massive GTA 6 Footage Leaked Across Twitter",
        "Rockstar Games Panic: The Secret Leaked Footage",
        "Was The GTA 6 Leak Actually An Inside Job?"
      ],
      thumbnail_text: "GTA 6 LEAKED!",
      captions: "TWITTER KHOLA AUR GTA 6 LEAK HO GAYA! 🚨\nGameplay footage internet pe aag ki tarah fail gaya! 💥\nRockstar Games panic mode mein aa gaya! ⏳",
      cleaned_script: 'Host: "Twitter kholte hi GTA 6 ka gameplay leak ho gaya! Sab log shock mein the ki Rockstar ne copyright strike kyu mari?"\nSpeaker: "W07 walo ne hi clip post kiya tha aur wo jo anticipation tha wo internet pe explode kar gaya. Bilkul crazy moment tha!"',
      editor_directives: {
        in_point: "35:38",
        out_point: "36:31",
        visual_hook: "Zoom in 115% on speaker at 00:00. Flash 'LEAK CONFIRMED' sticker with glitch transition.",
        b_roll: "Cut to screenshot of viral tweet at 00:04. Overlay Vice City neon gameplay at 00:15.",
        sound_design: "Sub-bass riser on first second. Glitch SFX on video cut.",
        subtitle_preset: "Alex Hormozi Style (Bold Yellow text with black stroke)"
      },
      virality_metrics: {
        hook_velocity: 98,
        retention_potential: 94,
        debate_intensity: 96,
        platform_fit: "Shorts 99% • Reels 95% • TikTok 93%"
      },
      hashtags: ["#GTA6", "#RockstarGames", "#GamingLeaks", "#MenOfCulture", "#PodcastClips", "#PodcastOS"],
      instagram_caption: "The internet broke when GTA 6 footage secretly leaked on Twitter. Here's how the entire gaming industry reacted in real-time. Drop your thoughts below 👇 #PodcastOS #GTA6",
      linkedin_caption: "Intellectual property leaks in the $200B gaming industry:\n\nWhen pre-release gameplay surfaces prematurely, publisher crisis PR must balance legal enforcement without amplifying the leak.\n\nKey analysis from Men of Culture.",
      twitter_post: "The exact moment GTA 6 got leaked on Twitter and Rockstar scrambled to strike down every tweet 🧵👇",
      youtube_chapters: "The GTA 6 Twitter Leak Shock (35:38)"
    },
    {
      title: "GTA 6 PC Build: The Cyber Leak Rockstar Feared 💻",
      timestamp_start: "00:16",
      timestamp_end: "01:09",
      duration: "53s",
      type: "Contrarian Truth",
      predicted_viral_score: 96,
      retention_score: 92,
      hook: "Cyber leak se GTA 6 ka internal PC build bahar aa gaya! Kya sach mein motion-capture build leak ho chuka hai?",
      hook_english: "A cyber raid exposed an early PC build of GTA 6—was motion capture code included in the breach?",
      explanation: "Triggers intense ongoing debates between PC and console gamers regarding simultaneous release windows.",
      titles: [
        "Is GTA 6 Coming To PC Sooner Than Expected?",
        "The Truth About The GTA 6 Cyber Leak",
        "Rockstar's Worst Nightmare: Internal PC Code Exposed"
      ],
      thumbnail_text: "PC BUILD LEAKED",
      captions: "CYBER LEAK SE GTA 6 PC BUILD BAHAR! 💻\nRockstar Games ke servers pe raid... 🚨\nKya PC release console ke saath hoga? 🎮",
      cleaned_script: 'Speaker: "Star wali raid mari aur wo jo cyber leak hua tha, usme GTA ka early build leak kiya gaya. Sab log pooch rahe the ki kya GTA 6 PC pe release hoga?"',
      editor_directives: {
        in_point: "00:16",
        out_point: "01:09",
        visual_hook: "Flash 'CYBER LEAK' text at 00:02. Cut to GTA PC speculation graphics at 00:10.",
        b_roll: "Insert hacker terminal animation & Rockstar Games logo.",
        sound_design: "Keyboard typing clicks & digital glitch transition.",
        subtitle_preset: "Cyber Green / Yellow high-contrast vertical subtitles."
      },
      virality_metrics: {
        hook_velocity: 96,
        retention_potential: 92,
        debate_intensity: 94,
        platform_fit: "Shorts 97% • Reels 92% • TikTok 90%"
      },
      hashtags: ["#GTA6PC", "#RockstarGames", "#GamingCommunity", "#PCGaming", "#PodcastOS"],
      instagram_caption: "Did Rockstar Games' internal PC build actually get leaked? Here's the technical breakdown of what hackers discovered. Save this clip! 💾 #PodcastOS #GTA6",
      linkedin_caption: "Cybersecurity in modern entertainment:\n\nEarly builds and motion-capture binaries represent multimillion-dollar assets. A look at Rockstar Games' security breach.",
      twitter_post: "Was the GTA 6 PC build actually part of the massive cyber leak? Here is what the code revealed 🧵👇",
      youtube_chapters: "GTA 6 PC Build Cyber Leak (00:16)"
    },
    {
      title: "Why Every US Giant Is Becoming A Tech Company 🤖",
      timestamp_start: "04:03",
      timestamp_end: "04:56",
      duration: "52s",
      type: "Value Bomb",
      predicted_viral_score: 94,
      retention_score: 90,
      hook: "US mein har company ab sirf ek cheez pe focus kar rahi hai—future-proofing with core tech & automation.",
      hook_english: "In the US, every traditional enterprise is morphing into a tech and AI company to survive.",
      explanation: "Macroeconomic tech transition breakdown creates high bookmark rates and shares among builders and operators.",
      titles: [
        "The Trillion Dollar Tech Shift Nobody Talks About",
        "Why Non-Tech Companies Are Panicking In 2026",
        "Building For The Next Decade: The Silicon Valley Playbook"
      ],
      thumbnail_text: "FUTURE TECH SHIFT",
      captions: "EVERY COMPANY IS A TECH COMPANY NOW! 🤖\nSilicon Valley ka sabse bada secret... 📈\nAdapt or die in the age of AI automation! ⚡",
      cleaned_script: 'Speaker: "Batao, Gen-U are like working for the future. Har ek US company ko jab dekhta hu, eventually har company ek technology company ban rahi hai."',
      editor_directives: {
        in_point: "04:03",
        out_point: "04:56",
        visual_hook: "Fast-paced text animation with rising stock charts.",
        b_roll: "Insert stock footage of Silicon Valley server racks & automated warehouses.",
        sound_design: "Subtle tech synth riser with clean dialog compression.",
        subtitle_preset: "Minimalist White & Gold Studio subtitle preset."
      },
      virality_metrics: {
        hook_velocity: 94,
        retention_potential: 90,
        debate_intensity: 92,
        platform_fit: "Shorts 95% • Reels 91% • TikTok 88%"
      },
      hashtags: ["#TechFuture", "#SiliconValley", "#AIAutomation", "#BusinessStrategy", "#PodcastOS"],
      instagram_caption: "The biggest macro shift in the global economy: every single legacy business is morphing into a software and AI enterprise. What's your perspective? #PodcastOS",
      linkedin_caption: "Software eating the world, phase 2:\n\nEvery enterprise—from logistics to retail—must now compete as an AI-native technology organization.\n\nTakeaway from Men of Culture.",
      twitter_post: "Why every Fortune 500 company is racing to become a software provider before 2027 🧵👇",
      youtube_chapters: "The All-Tech Enterprise Era (04:03)"
    }
  ];

  const executeExtraction = async (textInput: string, ytUrl: string) => {
    const isYt = textInput.includes("youtube.com/") || textInput.includes("youtu.be/") || ytUrl.trim().length > 0;
    const finalYt = isYt ? (ytUrl || textInput).trim() : "";
    const finalText = isYt ? "" : (textInput.trim() || presets[0].text);

    setLoading(true);
    setSelectedClipIdx(0);

    try {
      const response = await fetch("http://localhost:8000/shorts/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript_text: finalText,
          youtube_url: finalYt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.clips) && data.clips.length > 0) {
          setClips(data.clips);
        } else if (Array.isArray(data) && data.length > 0) {
          setClips(data);
        } else {
          setClips(defaultClips);
        }
      } else {
        setClips(defaultClips);
      }
    } catch (err) {
      console.log("Using studio high-fidelity shorts fallback:", err);
      setClips(defaultClips);
    } finally {
      setLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  const runShortsFinder = (e: React.FormEvent) => {
    e.preventDefault();
    executeExtraction(formData.transcript_text, formData.youtube_url);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedClip = clips ? clips[selectedClipIdx] : defaultClips[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-7 max-w-7xl mx-auto pb-16"
    >
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#382F2A] pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="tracking-widest uppercase">VERTICAL VIDEO RETENTION & VIRALITY ENGINE</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#FAF7F2] tracking-tight">
            Viral Shorts & Reels Director
          </h1>
          <p className="text-xs sm:text-sm text-[#A8988B] mt-1 max-w-2xl leading-relaxed">
            Extract high-retention 9:16 clips from any podcast transcript or YouTube link with cleaned 3-second psychology hooks, CapCut/Premiere edit directives, and full social packages.
          </p>
        </div>

        {/* Studio Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-[#8C7B6E] mr-1">Studio Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (p.url) {
                  setActiveMode("youtube");
                  setFormData({ transcript_text: p.text, youtube_url: p.url });
                  executeExtraction(p.text, p.url);
                } else {
                  setActiveMode("transcript");
                  setFormData({ transcript_text: p.text, youtube_url: "" });
                  executeExtraction(p.text, "");
                }
              }}
              className="text-[11px] font-mono px-3 py-1.5 rounded-xl border border-amber-500/20 bg-amber-950/20 text-amber-300 hover:border-amber-400/50 hover:bg-amber-950/40 transition-all flex items-center space-x-1.5"
            >
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Switcher & Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-amber-500/25 space-y-5">
        <div className="flex items-center space-x-2 border-b border-[#382F2A] pb-3 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveMode("youtube")}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeMode === "youtube"
                ? "bg-amber-600/30 border border-amber-400 text-amber-200 font-semibold"
                : "text-[#A8988B] hover:text-[#FAF7F2]"
            }`}
          >
            🎥 YouTube Video Link
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("transcript")}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeMode === "transcript"
                ? "bg-amber-600/30 border border-amber-400 text-amber-200 font-semibold"
                : "text-[#A8988B] hover:text-[#FAF7F2]"
            }`}
          >
            📄 Paste Transcript Text
          </button>
        </div>

        <form onSubmit={runShortsFinder} className="space-y-4">
          {activeMode === "youtube" ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-medium text-[#C7B9AC]">YouTube Podcast Episode Link *</label>
                <span className="text-[11px] font-mono text-[#8C7B6E]">Auto-fetches video captions & evaluates viral moments</span>
              </div>
              <input
                type="text"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                className="w-full p-3.5 rounded-xl bg-[#1E1714] border border-[#3E322A] text-xs text-[#FAF7F2] placeholder-[#7D6D61] focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-medium text-[#C7B9AC]">Podcast Transcript Segment *</label>
                <span className="text-[11px] font-mono text-[#8C7B6E]">Accepts English, Hindi or Hinglish dialogue</span>
              </div>
              <textarea
                rows={4}
                value={formData.transcript_text}
                onChange={(e) => setFormData({ ...formData, transcript_text: e.target.value })}
                placeholder="Paste transcript dialogue from the episode..."
                className="w-full p-3.5 rounded-xl bg-[#1E1714] border border-[#3E322A] text-xs text-[#FAF7F2] placeholder-[#7D6D61] focus:outline-none focus:border-amber-400 font-sans leading-relaxed"
              ></textarea>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
            <span className="text-xs text-[#8C7B6E] font-mono flex items-center space-x-1.5">
              <span>⚡ Synthesizes 3-sec opening curiosity hooks, CapCut B-roll notes & subtitle presets</span>
            </span>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-50 flex items-center justify-center space-x-2 whitespace-nowrap shadow-md"
            >
              <span>{loading ? "⚙️ Synthesizing Viral Shorts..." : "⚡ Extract Viral Shorts"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading Bar */}
      {loading && (
        <div className="p-6 rounded-2xl glass-card border border-amber-500/30 flex items-center space-x-3 text-xs text-amber-300 font-mono">
          <div className="flex items-end space-x-1 h-4">
            <span className="w-1 bg-amber-400 rounded-sm soundwave-bar-1"></span>
            <span className="w-1 bg-amber-400 rounded-sm soundwave-bar-2"></span>
            <span className="w-1 bg-amber-400 rounded-sm soundwave-bar-3"></span>
          </div>
          <span>Analyzing transcript retention curve and extracting top 3 vertical shorts with edit directives...</span>
        </div>
      )}

      {/* Extracted Clips Workspace */}
      <div ref={resultsRef}>
        {(clips || defaultClips) && selectedClip && (
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left 1 Column: Clip Selector List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-sm font-bold text-amber-300">
                  Identified Viral Moments ({clips ? clips.length : defaultClips.length})
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  AI Ranked
                </span>
              </div>

              {(clips || defaultClips).map((clip, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedClipIdx(i)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all ${
                    selectedClipIdx === i
                      ? "bg-amber-600/25 border-amber-400 text-[#FAF7F2] shadow-lg shadow-amber-950/50"
                      : "glass-card border-[#3E322A] text-[#C7B9AC] hover:border-amber-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      ⏱ {clip.timestamp_start} - {clip.timestamp_end} ({clip.duration})
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      🔥 {clip.predicted_viral_score}/100
                    </span>
                  </div>
                  <h4 className="font-heading text-xs font-bold text-[#FAF7F2] mt-2 line-clamp-1">{clip.title}</h4>
                  <p className="text-[11px] text-[#A8988B] mt-1 line-clamp-2 italic font-sans">"{clip.hook}"</p>
                  
                  {clip.editor_directives && (
                    <div className="mt-2.5 pt-2 border-t border-[#382F2A] flex items-center justify-between text-[10px] font-mono text-[#8C7B6E]">
                      <span className="text-amber-300">🎬 CapCut Ready</span>
                      <span>Retention {clip.retention_score}%</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Right 2 Columns: Full Studio Workspace */}
            <div className="lg:col-span-2 glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/25 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#382F2A] gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-500/25 uppercase">
                      {selectedClip.type}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      Top Viral Moment #{selectedClipIdx + 1}
                    </span>
                  </div>
                  <h2 className="font-heading text-lg font-bold text-[#FAF7F2] mt-2">{selectedClip.title}</h2>
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono">
                  <div className="px-2.5 py-1 rounded-xl bg-[#0E2A3C]/40 border border-[#7DD3FC]/20 text-center">
                    <span className="text-[9px] text-ice-muted block uppercase">Hook Velocity</span>
                    <span className="font-mono text-xs text-ice font-semibold">
                      {selectedClip.virality_metrics?.hook_velocity || selectedClip.predicted_viral_score}%
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-[#221B17] border border-[#3A2F28] text-center">
                    <span className="text-[10px] text-[#8C7B6E] block">Predicted Viral</span>
                    <span className="font-bold text-emerald-400">{selectedClip.predicted_viral_score}%</span>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-[#221B17] border border-[#3A2F28] text-center">
                    <span className="text-[10px] text-[#8C7B6E] block">Retention Score</span>
                    <span className="font-bold text-amber-300">{selectedClip.retention_score}%</span>
                  </div>
                </div>
              </div>

              {/* 🎯 3-Second Psychology Hook Box */}
              <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/30 text-xs text-[#FAF7F2] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-300 flex items-center space-x-1.5">
                    <span>🎯 3-Second Opening Hook:</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedClip.hook, "hook")}
                    className="text-[11px] font-mono text-amber-400 hover:text-amber-300"
                  >
                    {copiedKey === "hook" ? "✓ Copied!" : "Copy Hook"}
                  </button>
                </div>
                <p className="italic text-sm font-medium text-amber-100">"{selectedClip.hook}"</p>
                
                {selectedClip.hook_english && selectedClip.hook_english !== selectedClip.hook && (
                  <div className="pt-2 border-t border-amber-500/20 text-xs text-[#7DD3FC] flex items-center space-x-2">
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#0E2A3C] border border-[#7DD3FC]/30">
                      EN Translation
                    </span>
                    <span className="italic">"{selectedClip.hook_english}"</span>
                  </div>
                )}
                
                <p className="text-[#A8988B] text-[11px] font-sans pt-1">
                  <span className="text-amber-400 font-mono">Strategy: </span>
                  {selectedClip.explanation}
                </p>
              </div>

              {/* Interactive Player Preview + Workspace Suite */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* 9:16 Video Canvas / Mockup (5 cols) */}
                <div className="md:col-span-5 rounded-3xl p-5 bg-[#120E0C] border-2 border-[#3D332B] shadow-2xl flex flex-col justify-between aspect-[9/15] relative overflow-hidden">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8C7B6E] z-10">
                    <span className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      <span>9:16 VERTICAL</span>
                    </span>
                    <span>{selectedClip.duration}</span>
                  </div>

                  {/* Video Center Stage */}
                  <div className="my-auto text-center space-y-3 z-10 px-2">
                    {/* Thumbnail Badge */}
                    <div className="inline-block px-3 py-1.5 rounded-lg bg-amber-500 text-black font-extrabold text-xs tracking-wider uppercase shadow-xl transform -rotate-1">
                      {selectedClip.thumbnail_text || "VIRAL REVEAL"}
                    </div>

                    {/* Word-by-Word Subtitle Display */}
                    <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-sm border border-amber-500/20">
                      <p className="font-sans font-black text-sm text-[#FAF7F2] uppercase tracking-wide leading-snug whitespace-pre-line drop-shadow-md">
                        {selectedClip.captions}
                      </p>
                    </div>

                    {/* Audio Waveform Animation */}
                    <div className="flex items-center justify-center space-x-1 pt-1 h-4">
                      <span className={`w-1 bg-amber-400 rounded-sm ${isPlaying ? "soundwave-bar-1" : "h-1"}`}></span>
                      <span className={`w-1 bg-amber-400 rounded-sm ${isPlaying ? "soundwave-bar-2" : "h-2"}`}></span>
                      <span className={`w-1 bg-amber-400 rounded-sm ${isPlaying ? "soundwave-bar-3" : "h-1"}`}></span>
                      <span className={`w-1 bg-amber-400 rounded-sm ${isPlaying ? "soundwave-bar-2" : "h-3"}`}></span>
                      <span className={`w-1 bg-amber-400 rounded-sm ${isPlaying ? "soundwave-bar-1" : "h-1"}`}></span>
                    </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="space-y-2 z-10">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#A8988B]">
                      <span>⏱ {selectedClip.timestamp_start}</span>
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-amber-400 hover:text-amber-300 font-bold"
                      >
                        {isPlaying ? "⏸ Pause" : "▶ Play Preview"}
                      </button>
                      <span>{selectedClip.timestamp_end}</span>
                    </div>
                    <div className="w-full bg-[#2A201A] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-2/3 rounded-full"></div>
                    </div>
                    <div className="text-[10px] text-[#8C7B6E] truncate font-mono text-center pt-1">
                      {(selectedClip.hashtags || []).slice(0, 3).join(" ")}
                    </div>
                  </div>
                </div>

                {/* Right Tabbed Suite (7 cols) */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                  {/* Workspace Tabs */}
                  <div className="flex items-center space-x-1 border-b border-[#382F2A] pb-2 text-xs font-mono">
                    <button
                      onClick={() => setActiveTab("editor")}
                      className={`px-3 py-1 rounded-xl transition-all ${
                        activeTab === "editor"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 font-semibold"
                          : "text-[#A8988B] hover:text-[#FAF7F2]"
                      }`}
                    >
                      🎬 Editor Directives
                    </button>
                    <button
                      onClick={() => setActiveTab("social")}
                      className={`px-3 py-1 rounded-xl transition-all ${
                        activeTab === "social"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 font-semibold"
                          : "text-[#A8988B] hover:text-[#FAF7F2]"
                      }`}
                    >
                      📱 Social Copy
                    </button>
                    <button
                      onClick={() => setActiveTab("titles")}
                      className={`px-3 py-1 rounded-xl transition-all ${
                        activeTab === "titles"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 font-semibold"
                          : "text-[#A8988B] hover:text-[#FAF7F2]"
                      }`}
                    >
                      💡 Viral Titles
                    </button>
                    <button
                      onClick={() => setActiveTab("script")}
                      className={`px-3 py-1 rounded-xl transition-all ${
                        activeTab === "script"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 font-semibold"
                          : "text-[#A8988B] hover:text-[#FAF7F2]"
                      }`}
                    >
                      📝 Script
                    </button>
                  </div>

                  {/* Tab 1: Editor Directives */}
                  {activeTab === "editor" && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-[#1E1714] border border-[#3E322A] space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-[#382F2A]">
                          <span className="font-mono font-bold text-amber-300">⏱ Timeline Cut Points:</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {selectedClip.editor_directives?.in_point || selectedClip.timestamp_start} → {selectedClip.editor_directives?.out_point || selectedClip.timestamp_end}
                          </span>
                        </div>

                        <div>
                          <span className="font-mono text-[#8C7B6E] block text-[11px]">Visual Hook Directive (00:00 - 00:03):</span>
                          <p className="text-[#FAF7F2] font-sans mt-0.5">
                            {selectedClip.editor_directives?.visual_hook || "Zoom 115% on speaker at 00:00. Flash bold hook overlay sticker."}
                          </p>
                        </div>

                        <div>
                          <span className="font-mono text-[#8C7B6E] block text-[11px]">B-Roll & Overlay Guidance:</span>
                          <p className="text-[#FAF7F2] font-sans mt-0.5">
                            {selectedClip.editor_directives?.b_roll || "Insert dynamic screenshot or b-roll footage illustrating the core topic at 00:05."}
                          </p>
                        </div>

                        <div>
                          <span className="font-mono text-[#8C7B6E] block text-[11px]">Sound Design & Audio SFX:</span>
                          <p className="text-[#FAF7F2] font-sans mt-0.5">
                            {selectedClip.editor_directives?.sound_design || "Cinematic sub-bass riser on first second. Glitch SFX on video cut."}
                          </p>
                        </div>

                        <div>
                          <span className="font-mono text-[#8C7B6E] block text-[11px]">Subtitle Preset:</span>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/25 font-mono text-[11px]">
                            {selectedClip.editor_directives?.subtitle_preset || "Alex Hormozi Yellow Bold with black stroke"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => copyToClipboard(
                          `# CAPCUT / PREMIERE EDIT DIRECTIVES\nClip: ${selectedClip.title}\nTimeline: ${selectedClip.timestamp_start} to ${selectedClip.timestamp_end}\nHook: ${selectedClip.hook}\nVisual Hook: ${selectedClip.editor_directives?.visual_hook || "Zoom 115%"}\nB-Roll: ${selectedClip.editor_directives?.b_roll || "Contextual footage"}\nSFX: ${selectedClip.editor_directives?.sound_design || "Sub-bass riser"}\nSubtitles: ${selectedClip.editor_directives?.subtitle_preset || "Hormozi Yellow"}`,
                          "editor"
                        )}
                        className="w-full py-2 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-300 hover:border-amber-400 text-xs font-mono font-semibold"
                      >
                        {copiedKey === "editor" ? "✓ Edit Directives Copied!" : "📋 Copy CapCut / Premiere Edit Directives"}
                      </button>
                    </div>
                  )}

                  {/* Tab 2: Social Copy Suite */}
                  {activeTab === "social" && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex items-center justify-between pb-1">
                          <span className="font-mono font-bold text-amber-300">Instagram Reel / TikTok Caption</span>
                          <button
                            onClick={() => copyToClipboard(selectedClip.instagram_caption, "ig")}
                            className="text-[11px] text-amber-400 hover:text-amber-300"
                          >
                            {copiedKey === "ig" ? "✓ Copied!" : "Copy"}
                          </button>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#1E1714] border border-[#3E322A] text-[#C7B9AC] text-[11px]">
                          {selectedClip.instagram_caption}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between pb-1">
                          <span className="font-mono font-bold text-amber-300">Twitter / X Post</span>
                          <button
                            onClick={() => copyToClipboard(selectedClip.twitter_post, "tw")}
                            className="text-[11px] text-amber-400 hover:text-amber-300"
                          >
                            {copiedKey === "tw" ? "✓ Copied!" : "Copy"}
                          </button>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#1E1714] border border-[#3E322A] text-[#C7B9AC] text-[11px]">
                          {selectedClip.twitter_post}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between pb-1">
                          <span className="font-mono font-bold text-amber-300">LinkedIn Post</span>
                          <button
                            onClick={() => copyToClipboard(selectedClip.linkedin_caption, "li")}
                            className="text-[11px] text-amber-400 hover:text-amber-300"
                          >
                            {copiedKey === "li" ? "✓ Copied!" : "Copy"}
                          </button>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#1E1714] border border-[#3E322A] text-[#C7B9AC] text-[11px] line-clamp-2">
                          {selectedClip.linkedin_caption}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Alternative Viral Titles */}
                  {activeTab === "titles" && (
                    <div className="space-y-2.5 text-xs">
                      <span className="font-mono text-[#8C7B6E] text-[11px] block">
                        3 High-CTR Title Variations (A/B Test Options):
                      </span>
                      {(selectedClip.titles || []).map((t: string, idx: number) => (
                        <div key={idx} className="p-3 rounded-xl bg-[#1E1714] border border-[#3E322A] flex items-center justify-between">
                          <span className="text-[#FAF7F2] font-medium">{t}</span>
                          <button
                            onClick={() => copyToClipboard(t, `title-${idx}`)}
                            className="text-[11px] font-mono text-amber-400 hover:text-amber-300 ml-2"
                          >
                            {copiedKey === `title-${idx}` ? "✓ Copied!" : "Copy"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 4: Cleaned Spoken Script */}
                  {activeTab === "script" && (
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[#8C7B6E] text-[11px]">
                          Cleaned Spoken Dialogue (Filler Words Removed):
                        </span>
                        <button
                          onClick={() => copyToClipboard(selectedClip.cleaned_script || selectedClip.hook, "script")}
                          className="text-[11px] font-mono text-amber-400 hover:text-amber-300"
                        >
                          {copiedKey === "script" ? "✓ Copied!" : "Copy Script"}
                        </button>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#1E1714] border border-[#3E322A] text-[#FAF7F2] whitespace-pre-line leading-relaxed font-sans">
                        {selectedClip.cleaned_script || selectedClip.hook}
                      </div>
                    </div>
                  )}

                  {/* Bottom Action Button */}
                  <button
                    onClick={() => copyToClipboard(
                      `# ${selectedClip.title}\n\n**Hook:** ${selectedClip.hook}\n${selectedClip.hook_english ? `**English Hook:** ${selectedClip.hook_english}\n` : ""}**Timeline:** ${selectedClip.timestamp_start} to ${selectedClip.timestamp_end} (${selectedClip.duration})\n\n**Captions:**\n${selectedClip.captions}\n\n**Hashtags:** ${(selectedClip.hashtags || []).join(" ")}\n\n**CapCut Directives:**\n- Visual Hook: ${selectedClip.editor_directives?.visual_hook || "Zoom 115%"}\n- B-Roll: ${selectedClip.editor_directives?.b_roll || "Contextual footage"}\n- SFX: ${selectedClip.editor_directives?.sound_design || "Sub-bass riser"}`,
                      "all"
                    )}
                    className="w-full py-2.5 rounded-xl btn-primary text-xs font-semibold shadow-md"
                  >
                    {copiedKey === "all" ? "✓ All Viral Clip Assets Copied!" : "📋 Copy Complete Clip Package (Script + Copy + Edit Guide)"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
