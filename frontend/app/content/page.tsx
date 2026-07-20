"use client";

import React, { useState } from "react";

export default function ContentRepurposer() {
  const [formData, setFormData] = useState({
    transcript_text: "",
    tone: "Professional",
    cta: "",
  });

  const [loading, setLoading] = useState(false);
  const [repurposed, setRepurposed] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("linkedin");

  const runRepurposer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.transcript_text) return;

    setLoading(true);
    setRepurposed(null);

    try {
      const response = await fetch("http://localhost:8000/content/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setRepurposed(data);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Mock Repurpose
      setTimeout(() => {
        setRepurposed({
          linkedin_post: `🚀 [Hook in style of ${formData.tone}]: Most founders spend 90% of their time building, and only 10% selling.\n\nThis is a recipe for startup bankruptcy.\n\nHere is what we learned from bootstrapping Zerodha:\n\n1. Stop building in a vacuum. Talk to 10 customers on Day 1.\n2. Customer support is your marketing. A happy user is worth $1000 in ads.\n3. Keep your burn low. Profitability gives you leverage.\n\nAgree or disagree?\n\n👇 Let me know in the comments.`,
          linkedin_carousel: [
            { slide_number: 1, title: "The Bootstrapping Blueprint", content: "How we built a $2B company without raising a single dollar of venture capital. 🧵" },
            { slide_number: 2, title: "1. Customer-Led Growth", content: "Don't build features you think are cool. Build what clients are actively complaining about." },
            { slide_number: 3, title: "2. Organic Distribution", content: "Ad spend is a drug. When you stop paying, growth stops. Focus on organic referral engines instead." }
          ],
          twitter_thread: [
            `We bootstrapped a startup to a $2 Billion valuation. No VC. No paid marketing.\n\nHere are 3 rules we followed that go against everything you learn in business school: 👇 (Style: ${formData.tone})`,
            "1/ Customer support is the best marketing channel.\n\nIn the first 3 years, we didn't spend on ads. We just spent hours resolving tickets and talking to traders.",
            "2/ Avoid raising VC too early.\n\nRaising money forces you to focus on vanity metrics. Bootstrapping forces you to focus on unit economics. Leverage is built on profits."
          ],
          instagram_caption: `💡 Scale your startup the right way. Stop burning cash and start focusing on what matters: the customer. 🚀 Here are our top 3 bootstrapping secrets. Save this post for later! 💾 #startups #business #finance #bootstrapping`,
          newsletter: "Subject: Why bootstrap when you can raise?\n\nHey Podcaster,\n\nWe hear a lot about multi-million dollar Series A funding rounds. But what we don't hear is the loss of control, the pressure for unsustainable growth, and the eventual crash.\n\nIn this episode, we sat down with a self-made entrepreneur who co-founded a $2B financial powerhouse without taking a dime of venture money.\n\nHere's the core takeaway: Profitability is the ultimate freedom.\n\nBest,\nPodcastOS Team",
          blog_post: "### The Bootstrapping Paradigm: Scaling Without External Capital\n\nIn the modern tech landscape, raising venture capital has become synonymous with startup success. However, a growing number of founders are realizing that bootstrapping offers a level of control and financial durability that VC backing cannot match. \n\nTo build a bootstrapped company successfully, you must prioritize cash flows and unit economics from day one. You do not have the luxury of burning millions on user acquisition. Instead, you must build high-retention products that naturally drive organic recommendations. In this article, we outline the exact processes used to bootstrap financial systems to millions of active clients."
        });
      }, 1200);
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
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Content Repurposer</h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Repurpose long-form podcast transcripts into high-impact social posts, threads, newsletters, and blog posts.
        </p>
      </div>

      {/* Input panel */}
      <div className="glass-card rounded-xl p-6">
        <form onSubmit={runRepurposer} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 font-medium">Podcast Transcript snippet</label>
            <textarea
              rows={5}
              required
              placeholder="Paste podcast transcript segment here..."
              value={formData.transcript_text}
              onChange={(e) => setFormData((prev) => ({ ...prev, transcript_text: e.target.value }))}
              className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 font-medium">Repurposing Style / Tone</label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData((prev) => ({ ...prev, tone: e.target.value }))}
                className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                {["Raj Shamani", "Alex Hormozi", "Naval", "Justin Welsh", "Professional", "Funny", "Storytelling", "Educational", "Minimal"].map((style) => (
                  <option key={style} value={style} className="bg-slate-950 text-white">
                    {style}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 font-medium">Call to Action (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Subscribe to our channel"
                value={formData.cta}
                onChange={(e) => setFormData((prev) => ({ ...prev, cta: e.target.value }))}
                className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:bg-indigo-700/60"
              >
                {loading ? "Rewriting content..." : "Repurpose Content"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="glass-card rounded-xl p-6 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-800 rounded w-1/4"></div>
          <div className="h-32 bg-slate-800 rounded w-full"></div>
        </div>
      )}

      {/* Output Panel */}
      {repurposed && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            {/* Tabs */}
            <div className="flex space-x-1 border border-white/[0.06] bg-slate-950/40 rounded-lg p-1">
              {[
                { id: "linkedin", name: "LinkedIn Post" },
                { id: "carousel", name: "Carousel Content" },
                { id: "twitter", name: "Twitter Thread" },
                { id: "newsletter", name: "Newsletter" },
                { id: "blog", name: "Blog Post" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                    activeTab === tab.id ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                if (activeTab === "linkedin") copyText(repurposed.linkedin_post);
                if (activeTab === "carousel") copyText(JSON.stringify(repurposed.linkedin_carousel, null, 2));
                if (activeTab === "twitter") copyText(repurposed.twitter_thread.join("\n\n"));
                if (activeTab === "newsletter") copyText(repurposed.newsletter);
                if (activeTab === "blog") copyText(repurposed.blog_post);
              }}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Copy Active Tab Text
            </button>
          </div>

          <div className="glass-card rounded-xl p-6 bg-slate-950/10">
            {activeTab === "linkedin" && (
              <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                {repurposed.linkedin_post}
              </pre>
            )}

            {activeTab === "carousel" && (
              <div className="grid gap-4 md:grid-cols-3">
                {repurposed.linkedin_carousel?.map((slide: any) => (
                  <div key={slide.slide_number} className="border border-white/[0.06] bg-white/[0.01] p-4 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-indigo-400 font-mono">Slide {slide.slide_number}</span>
                    <h4 className="text-xs font-bold text-white leading-snug">{slide.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{slide.content}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "twitter" && (
              <div className="space-y-4">
                {repurposed.twitter_thread?.map((tweet: string, idx: number) => (
                  <div key={idx} className="border-l-2 border-slate-700 pl-4 py-1 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    <div className="text-[10px] text-slate-500 font-mono mb-1">Tweet {idx + 1}</div>
                    {tweet}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "newsletter" && (
              <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                {repurposed.newsletter}
              </pre>
            )}

            {activeTab === "blog" && (
              <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                {repurposed.blog_post}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
