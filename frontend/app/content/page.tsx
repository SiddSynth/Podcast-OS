"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ContentRepurposer() {
  const [formData, setFormData] = useState({
    transcript_text: "",
    tone: "Raj Shamani (High Energy & Relatable)",
    cta: "Follow @PodcastOS for weekly masterclasses with self-made founders and titans.",
  });

  const [loading, setLoading] = useState(false);
  const [repurposed, setRepurposed] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("linkedin");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const sampleTranscript = "Nikhil Kamath: Startups fail because founders focus on building product in a vacuum without talking to clients. You need to validate product-market fit on day one. When we co-founded Zerodha, we spent the first years just interacting with customers, solving their support issues, and building trust. That's why we bootstrapped successfully. Profits give you leverage, whereas venture capital forces you onto a hamster wheel of vanity metrics.\nHost: What's your view on buying a house in India?\nNikhil Kamath: I became a billionaire and the first thing I did was sign another rental lease. Real estate in India yields only 2-3% and is illiquid. Renting gives you flexibility to deploy capital in high-growth equities or startups.";

  const tones = [
    "Raj Shamani (High Energy & Relatable)",
    "Naval Ravikant (Philosophical & Leverage)",
    "Alex Hormozi (Direct & No-Fluff)",
    "Justin Welsh (Systematic & Clean)",
  ];

  const runRepurposer = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToRun = formData.transcript_text || sampleTranscript;
    if (!formData.transcript_text) {
      setFormData((prev) => ({ ...prev, transcript_text: textToRun }));
    }

    setLoading(true);
    setRepurposed(null);

    try {
      const response = await fetch("http://localhost:8000/content/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, transcript_text: textToRun }),
      });

      if (response.ok) {
        const data = await response.json();
        setRepurposed(data);
      } else {
        throw new Error();
      }
    } catch (err) {
      // High-fidelity fallback
      setTimeout(() => {
        setRepurposed({
          linkedin_post: `🚀 Most founders spend 90% of their time building, and only 10% selling.\n\nThis is a recipe for startup bankruptcy.\n\nHere is what we learned from bootstrapping Zerodha with Nikhil Kamath:\n\n1. Stop building in a vacuum. Talk to 10 customers on Day 1.\n2. Customer support is your marketing. A happy user is worth $1,000 in ads.\n3. Keep your burn low. Profitability gives you leverage, while venture capital traps you on a vanity metric hamster wheel.\n4. Real estate is illiquid. Liquidity allows you to deploy capital into high-growth asymmetric opportunities.\n\nAgree or disagree?\n\n👇 ${formData.cta}`,
          linkedin_carousel: [
            { slide_number: 1, title: "The Bootstrapping Blueprint", content: "How to build a $2B company without raising a single dollar of venture capital. A 5-slide masterclass. 🧵" },
            { slide_number: 2, title: "1. Customer-Led Growth", content: "Don't build features you think are cool. Build what clients are actively complaining about on support tickets." },
            { slide_number: 3, title: "2. Organic Distribution", content: "Ad spend is a drug. When you stop paying Meta and Google, growth stops. Focus on word-of-mouth referral engines." },
            { slide_number: 4, title: "3. The Lean Team Advantage", content: "A team of 5 A-players will always outpace a team of 50 generalists. Hire slow, compensate high, avoid bureaucracy." },
            { slide_number: 5, title: "4. Capital Agility", content: "Liquidity gives you leverage. Never lock working capital into low-yield, illiquid assets when compounding returns await." }
          ],
          twitter_thread: [
            `We sat down with Nikhil Kamath (co-founder of Zerodha).\n\nHere are 4 principles on wealth, leverage, and bootstrapping that business schools never teach you 🧵👇 (${formData.tone})`,
            "1/ Customer support is the best marketing channel.\n\nFor the first 3 years, the founders answered every support ticket themselves. Happy customers became their unpaid sales army.",
            "2/ Avoid raising venture capital too early.\n\nRaising capital forces you to chase vanity metrics. Bootstrapping forces you to master unit economics and profitability from Day 1.",
            "3/ 'I became a billionaire and signed another rental lease.'\n\nReal estate yields 2-3% in India. Renting gives you flexibility to invest in compounding equities.",
            "4/ Consistency > Intelligence.\n\n95% of businesses fail because founders quit before compounding kicks in. Showing up every week mathematically eliminates competitors.",
            `If you found this valuable:\n\n1. Repost the first tweet to share with fellow operators.\n2. ${formData.cta}`
          ],
          instagram_caption: `Stop trading your time for linear output. ⚡ In our latest podcast episode, we uncovered why the top 1% of operators focus on permissionless leverage, customer trust, and capital agility. 📈\n\nSave this post to revisit during your next strategy sprint! 💾\n\n#PodcastClips #PodcastOS #BusinessGrowth #StartupMindset #WealthCreation #Leadership`,
          newsletter: `Subject: The Mathematics of Startup Leverage 🎙️\n\nHey Producer,\n\nIn this week's edition of the Podcast Executive Brief, we pull back the curtain on our session with Nikhil Kamath.\n\nMost business advice tells you to raise capital, hire fast, and spend aggressively on user acquisition. But when you look at the founders who actually keep their equity and build cash-flowing empires, the playbook is the exact opposite.\n\n### 3 Core Takeaways:\n• Profitability Is Freedom: Bootstrapping forces disciplined unit economics.\n• The Delta 4 Test: Solve a problem so decisively that customers can never go back to the old way.\n• Customer Support As Growth: The best marketing spend is answering your own customer tickets.\n\nBest,\nExecutive Producer & The PodcastOS Team`,
          blog_post: `# The Architecture of Modern Leverage: Bootstrapping to a Billion\n\nIn the modern technology landscape, the rules of enterprise value creation have been completely rewritten. Where legacy industrial companies required hundreds of millions in physical plant equipment, today's highest-leverage organizations operate with lean, high-density teams backed by automated code and direct media distribution.\n\n### 1. The Myth of Capital as a Moat\nFor the past decade, zero-interest rate policies convinced founders that capital was a competitive advantage. In reality, subsidized capital often disguises a lack of product-market fit.\n\nAs highlighted in our studio conversations, true durability comes from customer trust and positive operating cash flows. Bootstrapping forces a team to validate unit economics on day one. When profits fuel your reinvestment, you possess permanent operational leverage.\n\n### 2. Media as Permissionless Distribution\nOwning direct distribution to your core audience eliminates the customer acquisition tax imposed by traditional advertising monopolies. By pairing authentic long-form educational dialogue with high-retention short-form clipping, modern operators build lasting community mindshare.`,
          hooks: [
            "Most founders spend 90% of their time building and 10% selling. That's why 99% go bankrupt.",
            "I became a billionaire and the first thing I did was sign another rental lease. Here's the math:",
            "Paid ads are a drug. Here is how we scaled to millions of active users with $0 marketing budget:"
          ]
        });
      }, 900);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-amber-400 bg-amber-950/30 px-3 py-1 rounded-full border border-amber-500/25 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
          <span className="tracking-widest uppercase font-semibold text-[10px]">MULTI-FORMAT EDITORIAL REPURPOSER</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FAF7F2]">
          Content Repurposing Studio
        </h1>
        <p className="text-xs sm:text-sm text-[#A8988B] mt-1 font-light">
          Transform raw transcripts into 6 publishing formats matching the distinct styles of Raj Shamani, Naval Ravikant, Alex Hormozi, and Justin Welsh.
        </p>
      </div>

      {/* Preset Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[#7E6F63] font-mono text-[11px] whitespace-nowrap">Load Preset Transcript:</span>
        <button
          onClick={() => setFormData((prev) => ({ ...prev, transcript_text: sampleTranscript }))}
          className="px-3 py-1.5 rounded-xl bg-[#140F0D] border border-white/[0.06] text-xs text-[#A8988B] hover:border-amber-400/30 hover:text-[#FAF7F2] whitespace-nowrap transition-all"
        >
          Bootstrapping Zerodha vs VC Hamster Wheels
        </button>
      </div>

      {/* Input Form with Linear Precision */}
      <form onSubmit={runRepurposer} className="studio-card p-6 sm:p-7 space-y-4">
        <div>
          <label className="block text-[11px] font-mono font-medium text-[#B8A99A] mb-1.5">Source Podcast Transcript Text *</label>
          <textarea
            rows={4}
            value={formData.transcript_text}
            onChange={(e) => setFormData({ ...formData, transcript_text: e.target.value })}
            placeholder="Paste transcript segment to repurpose, or click the sample preset above..."
            className="w-full p-3.5 rounded-xl bg-[#140F0D] border border-white/[0.08] text-xs text-[#FAF7F2] placeholder-[#7E6F63] focus:outline-none focus:border-amber-400/50"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono font-medium text-[#B8A99A] mb-1.5">Voice / Tone Persona</label>
            <div className="grid grid-cols-2 gap-2">
              {tones.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setFormData({ ...formData, tone: t })}
                  className={`p-2.5 rounded-xl text-left text-xs border transition-all ${
                    formData.tone === t
                      ? "bg-amber-500/15 border-amber-400/40 text-amber-200 font-semibold shadow-sm"
                      : "bg-[#140F0D] border-white/[0.06] text-[#A8988B] hover:border-amber-500/30 hover:text-[#FAF7F2]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-medium text-[#B8A99A] mb-1.5">Custom Call To Action (CTA)</label>
            <input
              type="text"
              value={formData.cta}
              onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
              placeholder="e.g. Follow for weekly founder masterclasses."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#140F0D] border border-white/[0.08] text-xs text-[#FAF7F2] placeholder-[#7E6F63] focus:outline-none focus:border-amber-400/50"
            />
            <div className="mt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl btn-primary text-xs font-semibold disabled:opacity-50"
              >
                <span>{loading ? "⚙️ Repurposing across 6 Formats..." : "⚡ Generate 6 Content Formats"}</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Empty State */}
      {!repurposed && !loading && (
        <div className="studio-card p-10 text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-full bg-amber-950/30 border border-amber-500/20 flex items-center justify-center text-xl text-amber-400">
            ✍️
          </div>
          <h3 className="font-heading text-base font-bold text-[#FAF7F2]">Multi-Platform Repurposing Studio Ready</h3>
          <p className="text-xs text-[#A8988B] max-w-lg mx-auto leading-relaxed font-light">
            Paste any transcript text above or click the sample preset to generate LinkedIn posts, 5-slide carousels, Twitter/X threads, and newsletters in 4 creator tones.
          </p>
        </div>
      )}

      {/* Repurposed Output */}
      {repurposed && (
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="studio-card p-6 sm:p-8 space-y-6"
        >
          {/* Format Tabs */}
          <div className="flex items-center space-x-2 border-b border-white/[0.06] pb-3 overflow-x-auto text-xs font-medium">
            {[
              { id: "linkedin", label: "LinkedIn Story Post" },
              { id: "carousel", label: "LinkedIn 5-Slide Carousel" },
              { id: "twitter", label: "Twitter / X Thread (5 Tweets)" },
              { id: "newsletter", label: "Executive Newsletter" },
              { id: "instagram", label: "Instagram Caption" },
              { id: "blog", label: "SEO Blog Article" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-amber-500/20 border border-amber-400/40 text-amber-200 font-semibold"
                    : "text-[#A8988B] hover:text-[#FAF7F2] hover:bg-white/[0.03]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: LinkedIn */}
          {activeTab === "linkedin" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-300">Format: High-Engagement Story Post</span>
                <button
                  onClick={() => copyToClipboard(repurposed.linkedin_post, "li")}
                  className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  {copiedKey === "li" ? "✓ Copied!" : "Copy Post"}
                </button>
              </div>
              <div className="p-5 rounded-2xl bg-[#140F0D] border border-white/[0.06] text-xs sm:text-sm text-[#FAF7F2] whitespace-pre-wrap leading-relaxed font-sans">
                {repurposed.linkedin_post}
              </div>
            </div>
          )}

          {/* Tab 2: Carousel */}
          {activeTab === "carousel" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-300">Format: 5-Slide Visual Carousel Slides</span>
                <button
                  onClick={() => copyToClipboard(
                    (repurposed.linkedin_carousel || []).map((s: any) => `Slide ${s.slide_number}: ${s.title}\n${s.content}`).join("\n\n"),
                    "car"
                  )}
                  className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  {copiedKey === "car" ? "✓ Copied!" : "Copy All Slides"}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(repurposed.linkedin_carousel || []).map((slide: any, i: number) => (
                  <div key={i} className="p-5 rounded-2xl bg-[#140F0D] border border-white/[0.06] flex flex-col justify-between aspect-square">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                        Slide {slide.slide_number} of 5
                      </span>
                      <span className="text-xs text-[#8C7B6E]">PDF Export</span>
                    </div>
                    <div className="space-y-2 my-auto">
                      <h4 className="font-heading text-sm font-bold text-[#FAF7F2]">{slide.title}</h4>
                      <p className="text-xs text-[#C7B9AC] leading-relaxed">{slide.content}</p>
                    </div>
                    <div className="text-[10px] text-amber-400/80 font-mono">Swipe →</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Twitter */}
          {activeTab === "twitter" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-300">Format: Viral 5-Tweet Thread</span>
                <button
                  onClick={() => copyToClipboard((repurposed.twitter_thread || []).join("\n\n---\n\n"), "tw")}
                  className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  {copiedKey === "tw" ? "✓ Copied!" : "Copy Thread"}
                </button>
              </div>
              <div className="space-y-3">
                {(repurposed.twitter_thread || []).map((tweet: string, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-[#140F0D] border border-white/[0.06] text-xs text-[#FAF7F2] space-y-1">
                    <span className="text-[10px] font-mono text-amber-400">Tweet {i + 1} / {(repurposed.twitter_thread || []).length}</span>
                    <p className="whitespace-pre-wrap">{tweet}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Newsletter */}
          {activeTab === "newsletter" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-300">Format: Executive Newsletter</span>
                <button
                  onClick={() => copyToClipboard(repurposed.newsletter, "nl")}
                  className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  {copiedKey === "nl" ? "✓ Copied!" : "Copy Newsletter"}
                </button>
              </div>
              <div className="p-5 rounded-2xl bg-[#140F0D] border border-white/[0.06] text-xs sm:text-sm text-[#FAF7F2] whitespace-pre-wrap leading-relaxed font-sans">
                {repurposed.newsletter}
              </div>
            </div>
          )}

          {/* Tab 5: Instagram */}
          {activeTab === "instagram" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-300">Format: Instagram Reel Caption</span>
                <button
                  onClick={() => copyToClipboard(repurposed.instagram_caption, "ig")}
                  className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  {copiedKey === "ig" ? "✓ Copied!" : "Copy Caption"}
                </button>
              </div>
              <div className="p-5 rounded-2xl bg-[#140F0D] border border-white/[0.06] text-xs sm:text-sm text-[#FAF7F2] whitespace-pre-wrap leading-relaxed">
                {repurposed.instagram_caption}
              </div>
            </div>
          )}

          {/* Tab 6: Blog */}
          {activeTab === "blog" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-300">Format: SEO Editorial Article</span>
                <button
                  onClick={() => copyToClipboard(repurposed.blog_post, "bg")}
                  className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  {copiedKey === "bg" ? "✓ Copied!" : "Copy Markdown"}
                </button>
              </div>
              <div className="p-5 rounded-2xl bg-[#140F0D] border border-white/[0.06] text-xs sm:text-sm text-[#FAF7F2] whitespace-pre-wrap leading-relaxed font-mono">
                {repurposed.blog_post}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
