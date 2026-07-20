"use client";

import React, { useState, useEffect } from "react";

export default function Settings() {
  const [config, setConfig] = useState<any>({
    GEMINI_API_KEY: "",
    TAVILY_API_KEY: "",
    CLERK_API_KEY: "",
    is_demo_mode: true
  });
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchSettings = async () => {
    try {
      const response = await fetch("http://localhost:8000/settings");
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (err) {
      console.log("Error loading backend config, using offline defaults.");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveKey = async (key: string, value: string) => {
    setLoading(true);
    setSuccessMsg("");
    try {
      const response = await fetch("http://localhost:8000/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value })
      });
      if (response.ok) {
        setSuccessMsg(`Setting for ${key} saved successfully!`);
        fetchSettings();
      } else {
        throw new Error();
      }
    } catch (err) {
      // Mock saving locally
      setConfig((prev: any) => ({
        ...prev,
        [key]: value,
        is_demo_mode: key === "GEMINI_API_KEY" && value === "" ? true : prev.is_demo_mode
      }));
      setSuccessMsg(`Setting for ${key} mock-saved locally.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Settings & Keys</h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Manage integrations, configure live LLM access parameters, and review system configuration settings.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Status card */}
        <div className="glass-card rounded-xl p-5 flex items-center justify-between border-l-4 border-indigo-500">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Execution Mode</h3>
            <p className="text-sm font-semibold text-white">
              {config.is_demo_mode ? "Demo Mode (Mock Data Responses)" : "Live AI Mode (Gemini API Enabled)"}
            </p>
            <p className="text-[10px] text-slate-500 leading-normal">
              If GEMINI_API_KEY is not configured, the system uses detailed, high-fidelity mock generators to run zero-config local tests.
            </p>
          </div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
            config.is_demo_mode 
              ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" 
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
          }`}>
            {config.is_demo_mode ? "Demo" : "Live"}
          </span>
        </div>

        {/* Form panel */}
        <div className="glass-card rounded-xl p-6 space-y-6">
          <h3 className="text-sm font-semibold text-white tracking-tight">API Integrations</h3>
          
          {successMsg && (
            <div className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
              {successMsg}
            </div>
          )}

          <div className="space-y-6 text-xs">
            {/* Gemini API Key */}
            <div className="space-y-2 border-b border-white/[0.04] pb-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">GEMINI_API_KEY</span>
                <span className="text-[10px] text-slate-500">Required for live research agents</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Enter Gemini API key (starts with AIza...)"
                  defaultValue={config.GEMINI_API_KEY.includes("...") ? "" : config.GEMINI_API_KEY}
                  onBlur={(e) => {
                    if (e.target.value) saveKey("GEMINI_API_KEY", e.target.value);
                  }}
                  className="flex-1 rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                />
                <button 
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value) saveKey("GEMINI_API_KEY", input.value);
                  }}
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Tavily API Key */}
            <div className="space-y-2 border-b border-white/[0.04] pb-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">TAVILY_API_KEY</span>
                <span className="text-[10px] text-slate-500">Used for search tool scraping</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Enter Tavily API key (starts with tvly-...)"
                  defaultValue={config.TAVILY_API_KEY.includes("...") ? "" : config.TAVILY_API_KEY}
                  onBlur={(e) => {
                    if (e.target.value) saveKey("TAVILY_API_KEY", e.target.value);
                  }}
                  className="flex-1 rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                />
                <button 
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value) saveKey("TAVILY_API_KEY", input.value);
                  }}
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Clerk Keys */}
            <div className="space-y-2 pb-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">CLERK_API_KEY</span>
                <span className="text-[10px] text-slate-500">Used for Clerk Authentication integrations</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Enter Clerk secret key"
                  defaultValue={config.CLERK_API_KEY.includes("...") ? "" : config.CLERK_API_KEY}
                  onBlur={(e) => {
                    if (e.target.value) saveKey("CLERK_API_KEY", e.target.value);
                  }}
                  className="flex-1 rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                />
                <button 
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value) saveKey("CLERK_API_KEY", input.value);
                  }}
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
                >
                  Save
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
