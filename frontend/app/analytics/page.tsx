"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Analytics() {
  const [data, setData] = useState({
    total_research: 0,
    total_questions: 0,
    total_documents: 0,
    total_indexed_podcasts: 0,
    token_usage: 0,
    estimated_api_cost: 0,
    avg_latency_ms: 0,
    most_searched_guests: [] as any[],
    top_queries: [] as any[],
  });

  useEffect(() => {
    fetch("http://localhost:8000/analytics")
      .then((res) => res.json())
      .then((resData) => {
        if (resData) setData(resData);
      })
      .catch((err) => console.log("Using live telemetry:", err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-amber-400 bg-amber-950/30 px-3 py-1 rounded-full border border-amber-500/25 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
          <span className="tracking-widest uppercase font-semibold text-[10px]">PRODUCTION TELEMETRY & SYSTEM HEALTH</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FAF7F2]">
          Studio Analytics & Operational Telemetry
        </h1>
        <p className="text-xs sm:text-sm text-[#A8988B] mt-1 font-light">
          Monitor operating system usage parameters, token throughput, vector indexing metrics, and research query logs.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Token Consumption", value: data.token_usage.toLocaleString(), unit: "tokens processed", icon: "⚡", isVector: false },
          { label: "Estimated API Cost", value: `$${data.estimated_api_cost.toFixed(2)}`, unit: "USD (Gemini / Chroma)", icon: "💰", isVector: false },
          { label: "Average Latency", value: `${data.avg_latency_ms} ms`, unit: "pipeline latency", icon: "⏱", isVector: true },
          { label: "Indexed Master Transcripts", value: `${data.total_indexed_podcasts} Episodes`, unit: "ChromaDB Vector Store", icon: "🎙️", isVector: true },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className={`studio-card p-5 space-y-1.5 transition-all ${
              stat.isVector ? "hover:border-[#7DD3FC]/30" : "hover:border-amber-400/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E8074] font-semibold">{stat.label}</span>
              <span className="text-sm opacity-80">{stat.icon}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#FAF7F2] tracking-tight tabular-nums">{stat.value}</div>
            <p className={`text-[10px] font-mono ${stat.isVector ? "text-ice flex items-center gap-1.5" : "text-[#7E6F63]"}`}>
              {stat.isVector && <span className="h-1 w-1 rounded-full ice-dot"></span>}
              {stat.unit}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Two-Column Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Searched Guests */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="studio-card p-6 sm:p-7 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="font-heading text-base font-bold text-[#FAF7F2]">Most Researched Studio Guests</h3>
            <span className="text-xs font-mono text-amber-400">Top Frequency</span>
          </div>

          {(!data.most_searched_guests || data.most_searched_guests.length === 0) ? (
            <div className="py-8 text-center space-y-2">
              <span className="text-2xl">📊</span>
              <p className="text-xs text-[#FAF7F2] font-semibold">No Research Telemetry Logged Yet</p>
              <p className="text-[11px] text-[#A8988B] font-light">Guest popularity curves will populate as you execute dossiers.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.most_searched_guests.map((g, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#FAF7F2]">{i + 1}. {g.name}</span>
                    <span className="text-[11px] font-mono text-amber-400 font-bold tabular-nums">{g.count} Dossiers</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#1F1714] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (g.count / 15) * 100)}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Top Semantic Queries */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="studio-card p-6 sm:p-7 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="font-heading text-base font-bold text-[#FAF7F2]">Top Vector Retrieval Topics</h3>
            <span className="text-[10px] font-mono text-ice bg-[#0E2A3C]/80 px-2 py-0.5 rounded border border-[#7DD3FC]/25 flex items-center gap-1 font-medium">
              <span className="h-1 w-1 rounded-full ice-dot"></span>
              PodcastGPT Logs
            </span>
          </div>

          {(!data.top_queries || data.top_queries.length === 0) ? (
            <div className="py-8 text-center space-y-2">
              <span className="text-2xl">🔍</span>
              <p className="text-xs text-[#FAF7F2] font-semibold">No Vector Queries Recorded Yet</p>
              <p className="text-[11px] text-[#A8988B] font-light">Natural language query throughput will appear as you chat with PodcastGPT.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {data.top_queries.map((q, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#140F0D] border border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-[#FAF7F2] truncate max-w-[280px]">"{q.query}"</span>
                  <span className="font-mono text-[10px] text-ice bg-[#0E2A3C]/80 px-2 py-0.5 rounded border border-[#7DD3FC]/25 whitespace-nowrap">
                    {q.count} queries
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
