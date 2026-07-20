"use client";

import React, { useState, useEffect } from "react";

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [newPrompt, setNewPrompt] = useState({
    title: "",
    prompt_text: "",
    category: "Podcast",
    tags: "",
  });

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:8000/prompts";
      const params: string[] = [];
      if (selectedCategory !== "All") params.push(`category=${selectedCategory}`);
      if (favoritesOnly) params.push(`favorite_only=true`);
      if (params.length > 0) url += `?${params.join("&")}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPrompts(data);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Mock prompts database
      const mockDb = [
        {
          id: 1,
          title: "Expert Bio Summarizer",
          prompt_text: "Extract a 3-paragraph summary of the guest's career timeline, highlight their failures, and identify 3 contrarian stances they take relative to their industry peers.",
          category: "Research",
          tags: "Research,Bio,Summary",
          is_favorite: true
        },
        {
          id: 2,
          title: "Icebreaker Generator",
          prompt_text: "Generate 5 icebreaker questions that connect the guest's chess background or childhood hobby directly to their current corporate investment philosophy.",
          category: "Podcast",
          tags: "Podcast,Icebreaker,Questions",
          is_favorite: true
        },
        {
          id: 3,
          title: "LinkedIn Thread Hook",
          prompt_text: "Write a high-retention hook for a LinkedIn post based on the guest's contrarian views on real estate vs renting, matching Justin Welsh's minimal professional style.",
          category: "Marketing",
          tags: "Social Media,LinkedIn,Justin Welsh",
          is_favorite: false
        },
        {
          id: 4,
          title: "Sponsor Pitch email",
          prompt_text: "Create a cold sales partnership proposal for brand partners showing direct ROI metrics matching a 1 million view reach on the next tech founder episode.",
          category: "Sponsor Outreach",
          tags: "Sales,Outreach,Sponsors",
          is_favorite: true
        }
      ];
      
      let filtered = mockDb;
      if (selectedCategory !== "All") {
        filtered = filtered.filter((p) => p.category === selectedCategory);
      }
      if (favoritesOnly) {
        filtered = filtered.filter((p) => p.is_favorite);
      }
      setPrompts(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [selectedCategory, favoritesOnly]);

  const toggleFavorite = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/prompts/${id}/favorite`, {
        method: "PUT"
      });
      if (response.ok) {
        fetchPrompts();
      } else {
        throw new Error();
      }
    } catch (err) {
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_favorite: !p.is_favorite } : p))
      );
    }
  };

  const createPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.title || !newPrompt.prompt_text) return;

    try {
      const response = await fetch("http://localhost:8000/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrompt),
      });
      if (response.ok) {
        setNewPrompt({ title: "", prompt_text: "", category: "Podcast", tags: "" });
        fetchPrompts();
      } else {
        throw new Error();
      }
    } catch (err) {
      const mockNew = {
        id: Date.now(),
        ...newPrompt,
        is_favorite: false
      };
      setPrompts((prev) => [mockNew, ...prev]);
      setNewPrompt({ title: "", prompt_text: "", category: "Podcast", tags: "" });
    }
  };

  const deletePrompt = async (id: number) => {
    if (!confirm("Delete this prompt?")) return;
    try {
      const response = await fetch(`http://localhost:8000/prompts/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        fetchPrompts();
      } else {
        throw new Error();
      }
    } catch (err) {
      setPrompts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const copyPromptText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Prompt text copied!");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">AI Prompt Library</h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Catalog and save high-performing prompt templates for podcast research, copywriting, sales, and marketing.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Create Prompt form */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-white tracking-tight">Save New Template</h3>
          <div className="glass-card rounded-xl p-5">
            <form onSubmit={createPrompt} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Prompt Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. YouTube Hook Optimizer"
                  value={newPrompt.title}
                  onChange={(e) => setNewPrompt((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Category</label>
                <select
                  value={newPrompt.category}
                  onChange={(e) => setNewPrompt((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-white focus:outline-none"
                >
                  {["Podcast", "Research", "Marketing", "Sales", "Content", "Sponsor Outreach"].map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-950 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. youtube,hook,seo"
                  value={newPrompt.tags}
                  onChange={(e) => setNewPrompt((prev) => ({ ...prev, tags: e.target.value }))}
                  className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Prompt Instructions *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Type the instructions for the AI..."
                  value={newPrompt.prompt_text}
                  onChange={(e) => setNewPrompt((prev) => ({ ...prev, prompt_text: e.target.value }))}
                  className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white transition hover:bg-indigo-500"
              >
                Save Prompt Template
              </button>
            </form>
          </div>
        </div>

        {/* List of prompts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
            {/* Filter tags */}
            <div className="flex flex-wrap gap-2">
              {["All", "Podcast", "Research", "Marketing", "Sponsor Outreach"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Favorite toggle */}
            <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={favoritesOnly}
                onChange={(e) => setFavoritesOnly(e.target.checked)}
                className="rounded border-white/[0.08] bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Favorites Only</span>
            </label>
          </div>

          {/* Prompt card grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {loading ? (
              <div className="p-8 text-center text-sm text-slate-500 col-span-2">Loading templates...</div>
            ) : prompts.length > 0 ? (
              prompts.map((p) => (
                <div key={p.id} className="glass-card rounded-xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-indigo-400">
                      <span>{p.category}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleFavorite(p.id)}
                          className={`hover:scale-110 transition ${p.is_favorite ? "text-yellow-500" : "text-slate-600"}`}
                        >
                          ★
                        </button>
                        <button onClick={() => deletePrompt(p.id)} className="text-red-400/60 hover:text-red-400">
                          Delete
                        </button>
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-white tracking-tight leading-normal">{p.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-4 font-mono bg-slate-950/40 p-2.5 rounded-lg border border-white/[0.04]">
                      {p.prompt_text}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                    <div className="flex gap-1">
                      {p.tags?.split(",").map((tag: string, i: number) => (
                        <span key={i} className="text-[9px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => copyPromptText(p.prompt_text)}
                      className="text-[10px] font-semibold text-indigo-400 hover:underline"
                    >
                      Copy instructions
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-slate-500 col-span-2">No prompt templates found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
