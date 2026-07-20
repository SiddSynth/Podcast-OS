"use client";

import React, { useState } from "react";

export default function ShortsFinder() {
  const [formData, setFormData] = useState({
    transcript_text: "",
    youtube_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [clips, setClips] = useState<any[] | null>(null);
  const [selectedClipIdx, setSelectedClipIdx] = useState(0);

  const runShortsFinder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.transcript_text && !formData.youtube_url) return;

    setLoading(true);
    setClips(null);

    try {
      const response = await fetch("http://localhost:8000/shorts/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.clips) {
          setClips(data.clips);
        } else {
          setClips(data);
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      // Mock fallback
      setTimeout(() => {
        setClips([
          {
            title: "The Bootstrapping Trap: Why 99% of Startups Fail",
            timestamp_start: "00:10:15",
            timestamp_end: "00:11:10",
            duration: "55s",
            type: "Value Bomb",
            predicted_viral_score: 94,
            retention_score: 88,
            hook: "If you are starting a business in India, and your focus is only on software, you're going to fail.",
            explanation: "High contrarian hook that challenges common tech narratives, forcing immediate viewer alignment or disagreement.",
            titles: [
              "Why 99% of Tech Startups Fail",
              "The Software Trap in India",
              "Stop Building Software in India!"
            ],
            captions: "IF YOU ARE STARTING A BUSINESS IN INDIA... 🇮🇳\nAND YOUR ONLY FOCUS IS SOFTWARE... 💻\nYOU'RE GOING TO FAIL! 📉\nHere's why retail distribution is king.",
            thumbnail_text: "SOFTWARE IS DEAD IN INDIA?",
            hashtags: ["#startups", "#entrepreneurship", "#businessgrowth", "#wealthcreation"],
            instagram_caption: "🚨 Why software alone won't save your startup in India. Retail distribution and physical trust networks still rule the market. Here is the blueprint. 👇 #BusinessTips #StartupsIndia #Finance",
            linkedin_caption: "Most founders think building a startup is about coding. In India, it's actually about distribution. In our latest episode, we broke down why bootstrapped companies win by building robust customer support over expensive marketing campaigns. What's your take?",
            twitter_post: "Building a startup in India? 🇮🇳\n\nIf you think coding software is enough, you're set to fail.\n\nHere is why distribution and trust networks are the real secret sauce: 🧵👇",
            youtube_chapters: "10:15 - The Software Distribution Trap"
          },
          {
            title: "Why I Rent a House as a Billionaire",
            timestamp_start: "00:18:40",
            timestamp_end: "00:19:35",
            duration: "55s",
            type: "Curiosity Hook",
            predicted_viral_score: 89,
            retention_score: 92,
            hook: "I became a billionaire and the first thing I did was sign another rental lease.",
            explanation: "Leverages the curiosity of billionaire spending habits, disputing the traditional middle-class dream of buying real estate.",
            titles: [
              "Why I Rent as a Billionaire",
              "Real Estate is a Trap!",
              "Billionaire Explains the Renting Secret"
            ],
            captions: "I BECAME A BILLIONAIRE... 💰\nAND THE FIRST THING I DID... ⚡\nWAS SIGN A RENT LEASE! 🏢\nBuying real estate is a leverage trap.",
            thumbnail_text: "I OWN NOTHING?",
            hashtags: ["#personalfinance", "#rentingvsbuying", "#wealthbuilding", "#financialfreedom"],
            instagram_caption: "🏢 Buying a home vs Renting? A self-made billionaire breaks down why capital flexibility is far superior to illiquid real estate. Watch the full debate. #RealEstate #Investing #PersonalFinance",
            linkedin_caption: "Is homeownership a bad investment? \n\nMany see real estate as the ultimate safe asset. But locking up significant capital early can kill business growth. Capital flexibility is key. Here is why renting is a strategic choice for high-growth founders.",
            twitter_post: "I'm a self-made billionaire and I still rent my house.\n\nHere is why buying real estate is a massive wealth trap for young entrepreneurs: 👇",
            youtube_chapters: "18:40 - The Rent vs Buy Debate"
          }
        ]);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Viral Shorts Finder</h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Automatically extract high-retention hooks and viral video moments from transcripts or links.
        </p>
      </div>

      {/* Input panel */}
      <div className="glass-card rounded-xl p-6">
        <form onSubmit={runShortsFinder} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Paste Podcast Transcript</label>
              <textarea
                rows={4}
                placeholder="Paste the raw text of your podcast transcript here..."
                value={formData.transcript_text}
                onChange={(e) => setFormData((prev) => ({ ...prev, transcript_text: e.target.value }))}
                className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">OR Enter YouTube URL</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.youtube_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, youtube_url: e.target.value }))}
                  className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:bg-indigo-700/60 mt-4 md:mt-0"
              >
                {loading ? "Analyzing hooks & viral moments..." : "Find Viral Clips"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Loading animation */}
      {loading && (
        <div className="glass-card rounded-xl p-6 space-y-6 animate-pulse">
          <div className="h-6 bg-slate-800 rounded w-1/4"></div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="h-24 bg-slate-800 rounded col-span-1"></div>
            <div className="h-24 bg-slate-800 rounded col-span-2"></div>
          </div>
        </div>
      )}

      {/* Main output panel */}
      {clips && clips.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left panel: list of clips */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-tight">Viral Moments Found</h3>
            <div className="space-y-3">
              {clips.map((clip, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedClipIdx(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedClipIdx === idx
                      ? "bg-indigo-600/10 border-indigo-500"
                      : "bg-slate-950/20 border-white/[0.06] hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-indigo-400 font-semibold mb-1">
                    <span>{clip.type}</span>
                    <span>{clip.duration}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-normal truncate">{clip.title}</h4>
                  <div className="flex items-center justify-between mt-3 text-[10px] text-slate-500 font-mono">
                    <span>{clip.timestamp_start} - {clip.timestamp_end}</span>
                    <span className="text-emerald-400 font-bold">{clip.predicted_viral_score} Viral Score</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right panel: details of selected clip */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-6">
              {/* Header Details */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.06] pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white leading-relaxed">{clips[selectedClipIdx].title}</h3>
                  <div className="flex space-x-4 mt-2 text-[10px] text-slate-400 font-mono">
                    <div>
                      <span className="text-slate-500">Duration:</span> {clips[selectedClipIdx].duration}
                    </div>
                    <div>
                      <span className="text-slate-500">Clip:</span> {clips[selectedClipIdx].timestamp_start} - {clips[selectedClipIdx].timestamp_end}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <div className="glass-card px-3 py-1.5 rounded-lg text-center">
                    <div className="text-xs font-semibold text-emerald-400">{clips[selectedClipIdx].predicted_viral_score}</div>
                    <div className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold">Viral %</div>
                  </div>
                  <div className="glass-card px-3 py-1.5 rounded-lg text-center">
                    <div className="text-xs font-semibold text-indigo-400">{clips[selectedClipIdx].retention_score}</div>
                    <div className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold">Retention %</div>
                  </div>
                </div>
              </div>

              {/* Hook Analysis */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">The Hook (Opening Line)</h4>
                <blockquote className="border-l-2 border-slate-700 pl-3 italic text-slate-200 text-xs">
                  &quot;{clips[selectedClipIdx].hook}&quot;
                </blockquote>
                <p className="text-[11px] text-slate-500 leading-normal">{clips[selectedClipIdx].explanation}</p>
              </div>

              {/* Titles & overlay */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Alternative Clip Titles</h4>
                  <div className="space-y-2">
                    {clips[selectedClipIdx].titles?.map((t: string, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-white/[0.01] border border-white/[0.04] p-2.5 rounded-lg text-xs">
                        <span className="text-slate-300 leading-normal">{t}</span>
                        <button onClick={() => copyText(t)} className="text-indigo-400 hover:text-indigo-300 text-[10px] ml-2">Copy</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Thumbnail text / Overlay</h4>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-yellow-500 tracking-tight">{clips[selectedClipIdx].thumbnail_text}</span>
                    <button
                      onClick={() => copyText(clips[selectedClipIdx].thumbnail_text)}
                      className="text-xs font-semibold text-indigo-400 hover:underline"
                    >
                      Copy
                    </button>
                  </div>

                  <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Hashtags</h4>
                  <div className="flex flex-wrap gap-2">
                    {clips[selectedClipIdx].hashtags?.map((tag: string, idx: number) => (
                      <span key={idx} className="rounded-full bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Repurposing posts */}
              <div className="border-t border-white/[0.06] pt-6 space-y-4">
                <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Social Copywriting Drafts</h4>
                
                <div className="space-y-4">
                  {[
                    { label: "Vertical captions (TikTok/Shorts)", text: clips[selectedClipIdx].captions },
                    { label: "Instagram Caption", text: clips[selectedClipIdx].instagram_caption },
                    { label: "LinkedIn Post", text: clips[selectedClipIdx].linkedin_caption },
                    { label: "Twitter Post", text: clips[selectedClipIdx].twitter_post },
                  ].map((social, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold text-slate-400">{social.label}</span>
                        <button onClick={() => copyText(social.text)} className="text-[10px] font-medium text-indigo-400 hover:underline">
                          Copy
                        </button>
                      </div>
                      <textarea
                        readOnly
                        rows={3}
                        value={social.text}
                        className="w-full rounded-lg border border-white/[0.04] bg-slate-950/40 p-3 font-mono text-[11px] text-slate-300 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
