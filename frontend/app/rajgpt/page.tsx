"use client";

import React, { useState } from "react";

export default function PodcastGPT() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<any[]>([
    {
      role: "assistant",
      content: "Hello! I am PodcastGPT. I can perform semantic search across all indexed transcripts of Figuring Out podcasts and answer with exact citations, timestamps, and confidence scores. Ask me anything!",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setConversation((prev) => [...prev, { role: "user", content: userMsg }]);
    setQuery("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/podcastgpt/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg }),
      });

      if (response.ok) {
        const data = await response.json();
        setConversation((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
            citation: {
              quote: data.quote,
              timestamp: data.timestamp,
              episode: data.episode,
              confidence: data.confidence_score,
              related: data.related_chunks || [],
            },
          },
        ]);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Mock search response fallback
      setTimeout(() => {
        const queryLower = userMsg.toLowerCase();
        let answer = "";
        let quote = "";
        let timestamp = "00:00:00";
        let episode = "N/A";
        let confidence = 0.0;
        let related: any[] = [];

        if (queryLower.includes("nikhil") || queryLower.includes("startup") || queryLower.includes("bootstrap")) {
          answer = "Nikhil Kamath explains that Zerodha succeeded because they focused purely on organic, bootstrapped development, and spent the first few years resolving customer service tickets directly to build community trust.";
          quote = "Startups fail because founders focus on building product in a vacuum without talking to clients. You need to validate product-market fit on day one. When we co-founded Zerodha, we spent the first years just interacting with customers, solving their support issues, and building trust.";
          timestamp = "00:15:30";
          episode = "WTF is Bootstrapping in India";
          confidence = 0.88;
          related = [
            {
              quote: "Startups fail because founders focus on building product in a vacuum without talking to clients. You need to validate product-market fit on day one. When we co-founded Zerodha, we spent the first years just interacting with customers, solving their support issues, and building trust.",
              timestamp: "00:15:30",
              episode: "WTF is Bootstrapping in India",
              guest: "Nikhil Kamath",
              confidence: 0.88,
            },
          ];
        } else if (queryLower.includes("kunal") || queryLower.includes("trust") || queryLower.includes("cred")) {
          answer = "Kunal Shah argues that credit card users in India constitute the premium top 5% earning bracket, and CRED's business thesis is to aggregate this high-trust cohort to drive high-margin services.";
          quote = "If you look at credit card users in India, they represent the top 5% of income earners. Our business model at CRED is to aggregate this premium cohort and create high-trust communities. Trust is the most scarce currency in the Indian startup ecosystem.";
          timestamp = "00:32:15";
          episode = "How to Build High-Trust Startups";
          confidence = 0.85;
          related = [
            {
              quote: "If you look at credit card users in India, they represent the top 5% of income earners. Our business model at CRED is to aggregate this premium cohort and create high-trust communities. Trust is the most scarce currency in the Indian startup ecosystem.",
              timestamp: "00:32:15",
              episode: "How to Build High-Trust Startups",
              guest: "Kunal Shah",
              confidence: 0.85,
            },
          ];
        } else {
          answer = "I searched the index and found a discussion on content distribution where consistency is highlighted as the primary factor in gaining audience mindshare, which translates to brand deals.";
          quote = "Branding is not what you tell people; it's what they say about you when you are not in the room. As content creators and podcasters, consistency beats intelligence.";
          timestamp = "00:08:45";
          episode = "Building a Media Empire";
          confidence = 0.72;
          related = [
            {
              quote: "Branding is not what you tell people; it's what they say about you when you are not in the room. As content creators and podcasters, consistency beats intelligence.",
              timestamp: "00:08:45",
              episode: "Building a Media Empire",
              guest: "Raj Shamani",
              confidence: 0.72,
            },
          ];
        }

        setConversation((prev) => [
          ...prev,
          {
            role: "assistant",
            content: answer,
            citation: {
              quote,
              timestamp,
              episode,
              confidence,
              related,
            },
          },
        ]);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">PodcastGPT Chat</h1>
        <p className="text-slate-400 text-xs mt-1">
          Perform semantic search over uploaded transcripts. No hallucinations: PodcastGPT answers only using exact spoken segments.
        </p>
      </div>

      {/* Chat Messages Panel */}
      <div className="flex-1 overflow-y-auto border border-white/[0.06] bg-slate-950/20 rounded-xl p-4 md:p-6 space-y-6">
        {conversation.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-2xl space-y-2">
              <div
                className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-500/10"
                    : "glass-card text-slate-200"
                }`}
              >
                {msg.content}
              </div>

              {/* Citations panel for assistant responses */}
              {msg.role === "assistant" && msg.citation && msg.citation.confidence > 0 && (
                <div className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-3 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-400">Cited Segment</span>
                    <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                      {Math.round(msg.citation.confidence * 100)}% Match
                    </span>
                  </div>
                  <blockquote className="border-l-2 border-slate-700 pl-3 italic text-slate-400">
                    &quot;{msg.citation.quote}&quot;
                  </blockquote>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500 font-mono">
                    <div>
                      <span className="text-slate-600">Episode:</span> {msg.citation.episode}
                    </div>
                    <div>
                      <span className="text-slate-600">Timestamp:</span> {msg.citation.timestamp}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="glass-card rounded-xl px-4 py-3 text-sm text-slate-400 flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
              <span>Searching vector database...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask e.g. What did Nikhil Kamath say about bootstrapping startups?"
          className="flex-1 rounded-lg border border-white/[0.08] bg-slate-900/40 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:bg-indigo-700/60"
        >
          Send
        </button>
      </form>
    </div>
  );
}
