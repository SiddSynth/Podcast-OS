"use client";

import React, { useState } from "react";

export default function SponsorOutreach() {
  const [formData, setFormData] = useState({
    brand_name: "",
    brand_website: "",
    campaign_goal: "",
    target_guest: "",
  });

  const [loading, setLoading] = useState(false);
  const [outreach, setOutreach] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("email");

  const runOutreach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand_name) return;

    setLoading(true);
    setOutreach(null);

    try {
      const response = await fetch("http://localhost:8000/sponsors/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setOutreach(data);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Mock outreach fallback
      setTimeout(() => {
        setOutreach({
          brand_analysis: `${formData.brand_name} is a high-growth platform focusing on developer and creator services. They are looking to capture mindshare among software builders and technical teams.`,
          audience_fit: "The PodcastOS audience consists of 65% tech builders, entrepreneurs, and developers. Sponsoring an upcoming episode provides direct, uncluttered distribution to their target segment.",
          cold_email: `Subject: Partnering with PodcastOS: Reaching 1M+ Tech Founders\n\nHi Partnerships Team,\n\nI've been following ${formData.brand_name}'s recent launches. Your product solves a real friction point for retail builders.\n\nWe have an upcoming episode featuring a prominent startup leader that aligns directly with your target audience. We reach over 1,000,000 active builders per episode.\n\nWould you be open to exploring a custom mid-roll integration?\n\nBest,\nSponsor Partnerships, PodcastOS`,
          linkedin_message: `Hi marketing team, love the new campaigns. We are hosting a major finance leader on PodcastOS next week. We have a custom segment that fits your target audience perfectly. Worth a quick chat to discuss integration?`,
          follow_up_email: "Subject: Episode Schedule / Partnership slots locking up\n\nHi Partnerships Team,\n\nJust following up on my previous note. We are locking in the sponsorship slots for our upcoming episodes this week.\n\nLet me know if you would like to secure the mid-roll slot.\n\nBest,\nPartnerships, PodcastOS",
          proposal: "• 1x Custom 60-second Mid-roll Read by the host\n• 1x Instagram Reel co-authored post\n• Logo branding in the YouTube thumbnail and description\n• Permanent link back in the show notes",
          roi_pitch: "With an average cost per mil (CPM) of $25, and a projected reach of 1,000,000 views, sponsoring this episode is estimated to drive over 10,000 direct site clicks, representing a highly efficient customer acquisition cost (CAC) compared to standard paid ad channels.",
          meeting_agenda: [
            "1. Brief introduction to our audience demographics.",
            "2. Specific custom script angles for the host read.",
            "3. Discussion of pricing, timeline, and tracking metrics."
          ]
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
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Sponsor Outreach Generator</h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Scrape sponsor brands, analyze audience overlaps, and write highly-personalized partnership sales briefs instantly.
        </p>
      </div>

      {/* Input panel */}
      <div className="glass-card rounded-xl p-6">
        <form onSubmit={runOutreach} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Brand Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. CRED"
              value={formData.brand_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, brand_name: e.target.value }))}
              className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Brand Website (Optional)</label>
            <input
              type="text"
              placeholder="e.g. https://cred.club"
              value={formData.brand_website}
              onChange={(e) => setFormData((prev) => ({ ...prev, brand_website: e.target.value }))}
              className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Campaign Goal (Optional)</label>
            <input
              type="text"
              placeholder="e.g. App downloads"
              value={formData.campaign_goal}
              onChange={(e) => setFormData((prev) => ({ ...prev, campaign_goal: e.target.value }))}
              className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 flex flex-col justify-between">
            <label className="text-xs font-semibold text-slate-400">Target Episode / Guest</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Nikhil Kamath"
                value={formData.target_guest}
                onChange={(e) => setFormData((prev) => ({ ...prev, target_guest: e.target.value }))}
                className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 shrink-0"
              >
                {loading ? "Pitching..." : "Generate"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="glass-card rounded-xl p-6 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-800 rounded w-1/4"></div>
          <div className="h-28 bg-slate-800 rounded w-full"></div>
        </div>
      )}

      {/* Output Panel */}
      {outreach && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left panel: overlap summary */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white tracking-tight">Outreach Strategy</h3>
            <div className="glass-card rounded-xl p-5 space-y-4 text-xs leading-relaxed">
              <div className="space-y-1">
                <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[10px]">Brand Analysis</span>
                <p className="text-slate-300">{outreach.brand_analysis}</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[10px]">Audience fit</span>
                <p className="text-slate-300">{outreach.audience_fit}</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[10px]">ROI Pitch</span>
                <p className="text-slate-300">{outreach.roi_pitch}</p>
              </div>
            </div>
          </div>

          {/* Right panel: content tabs */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex space-x-1 border border-white/[0.06] bg-slate-950/40 rounded-lg p-1">
                {[
                  { id: "email", name: "Cold Email" },
                  { id: "linkedin", name: "LinkedIn message" },
                  { id: "followup", name: "Follow-up" },
                  { id: "proposal", name: "Proposal Outline" },
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
                  if (activeTab === "email") copyText(outreach.cold_email);
                  if (activeTab === "linkedin") copyText(outreach.linkedin_message);
                  if (activeTab === "followup") copyText(outreach.follow_up_email);
                  if (activeTab === "proposal") copyText(outreach.proposal);
                }}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Copy Text
              </button>
            </div>

            <div className="glass-card rounded-xl p-6 bg-slate-950/10">
              {activeTab === "email" && (
                <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                  {outreach.cold_email}
                </pre>
              )}

              {activeTab === "linkedin" && (
                <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                  {outreach.linkedin_message}
                </pre>
              )}

              {activeTab === "followup" && (
                <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                  {outreach.follow_up_email}
                </pre>
              )}

              {activeTab === "proposal" && (
                <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                  {outreach.proposal}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
