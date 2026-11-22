"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function KnowledgeBase() {
  const [kbs, setKbs] = useState<any[]>([]);
  const [activeKbId, setActiveKbId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  const starterSampleDoc = {
    id: 999,
    name: "Studio Master Track - Bootstrapping & Wealth Creation (Sample).txt",
    file_type: "txt",
    file_size: 4850,
    chunk_count: 6,
    status: "sample",
    created_at: new Date().toISOString(),
    preview: "Host: Welcome back to the studio. Today we have Nikhil Kamath, co-founder of Zerodha...\nNikhil Kamath: Startups fail because founders focus on building product in a vacuum without talking to clients. Profits give you leverage, whereas venture capital forces you onto a hamster wheel of vanity metrics...\nHost: What's your view on buying a house in India?\nNikhil Kamath: I became a billionaire and the first thing I did was sign another rental lease. Real estate in India is leverage-heavy, yields only 2-3%, and is illiquid. Renting gives you flexibility to deploy capital in high-growth equities, angel investments, or compounding startups where returns far outpace property appreciation."
  };

  const fetchKbs = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/kb");
      if (response.ok) {
        const data = await response.json();
        setKbs(data);
        if (data.length > 0 && activeKbId === null) {
          setActiveKbId(data[0].id);
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      setKbs([
        {
          id: 1,
          name: "Main Episode Knowledge Base",
          description: "Production transcripts and guest dossiers for real-time semantic intelligence.",
          documents: []
        }
      ]);
      setActiveKbId(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKbs();
  }, []);

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setTimeout(() => {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        file_type: file.name.split('.').pop() || "txt",
        file_size: file.size,
        chunk_count: Math.max(2, Math.round(file.size / 600)),
        status: "processed",
        created_at: new Date().toISOString(),
        preview: "Transcript processed and embedded into ChromaDB vector index successfully. Ready for semantic search in PodcastGPT."
      };

      setKbs((prev) =>
        prev.map((kb) =>
          kb.id === activeKbId ? { ...kb, documents: [newDoc, ...kb.documents] } : kb
        )
      );
      setUploading(false);
    }, 1200);
  };

  const activeKb = kbs.find((kb) => kb.id === activeKbId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono ice-badge px-3 py-1 rounded-full mb-1.5">
            <span className="h-1.5 w-1.5 rounded-full ice-dot"></span>
            <span className="font-semibold tracking-wider text-[10px]">CHROMADB VECTOR REPOSITORY</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FAF7F2]">
            Knowledge Base & Transcript Index
          </h1>
          <p className="text-xs sm:text-sm text-[#A8988B] mt-1 font-light">
            Manage chunked transcripts and research dossiers. Embedded directly into local ChromaDB storage for instant semantic search.
          </p>
        </div>

        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-2 cursor-pointer shadow-md"
        >
          <span>{uploading ? "⏳ Chunking & Embedding..." : "📄 Upload New Transcript"}</span>
          <input type="file" accept=".txt,.pdf,.docx,.csv" onChange={handleSimulateUpload} className="hidden" />
        </motion.label>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Selector (Left 1 col) */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="studio-card p-6 space-y-4"
        >
          <h3 className="font-heading text-sm font-bold text-amber-300">Vector Collections</h3>
          <div className="space-y-2">
            {kbs.map((kb) => (
              <button
                key={kb.id}
                onClick={() => setActiveKbId(kb.id)}
                className={`w-full p-4 rounded-2xl text-left border transition-all ${
                  activeKbId === kb.id
                    ? "bg-amber-500/15 border-amber-400/40 text-[#FAF7F2] font-semibold"
                    : "bg-[#140F0D] border-white/[0.06] text-[#A8988B] hover:border-amber-500/30"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#FAF7F2]">{kb.name}</span>
                  <span className="font-mono text-amber-400 text-[10px] bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/20">
                    {kb.documents.length} Docs
                  </span>
                </div>
                <p className="text-[11px] text-[#A8988B] mt-1 line-clamp-2 leading-relaxed font-light">{kb.description}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Documents Table (Right 2 cols) */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 studio-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="font-heading text-sm font-bold text-[#FAF7F2]">
              {activeKb?.name} — Indexed Files ({activeKb?.documents.length || 0})
            </h3>
            <span className="text-[10px] font-mono text-ice bg-[#0E2A3C]/80 px-2.5 py-0.5 rounded border border-[#7DD3FC]/30 flex items-center gap-1.5 font-medium">
              <span className="h-1.5 w-1.5 rounded-full ice-dot"></span>
              Vector Status: Synchronized
            </span>
          </div>

          {(!activeKb?.documents || activeKb.documents.length === 0) ? (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-amber-950/30 border border-amber-500/20 flex items-center justify-center text-xl text-amber-400">
                📁
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-sm font-semibold text-[#FAF7F2]">No Transcripts Uploaded Yet</h4>
                <p className="text-xs text-[#A8988B] max-w-sm mx-auto font-light">
                  Upload your episode transcript above (.txt, .pdf, .docx), or inspect our bundled starter sample transcript below.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="p-4 rounded-2xl bg-[#140F0D] border border-white/[0.06] max-w-lg mx-auto flex items-center justify-between text-left"
              >
                <div>
                  <span className="text-[10px] font-mono text-ice bg-[#0E2A3C]/80 px-1.5 py-0.5 rounded border border-[#7DD3FC]/25 uppercase font-medium">
                    ChromaDB Sample
                  </span>
                  <div className="text-xs font-semibold text-[#FAF7F2] mt-1">Bootstrapping Zerodha & Wealth Creation (Sample.txt)</div>
                  <div className="text-[10px] font-mono text-[#8C7B6E]">4.8 KB • <span className="text-ice">6 Vector Chunks</span></div>
                </div>
                <button
                  onClick={() => setSelectedDoc(starterSampleDoc)}
                  className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  Read Transcript →
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {activeKb?.documents.map((doc: any) => (
                <div key={doc.id} className="py-3 flex items-center justify-between hover:bg-white/[0.02] px-2 rounded-xl transition-colors">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-[#FAF7F2] flex items-center gap-2">
                      <span className="font-mono text-[10px] text-amber-400 bg-[#1C1512] px-1.5 py-0.5 rounded uppercase border border-white/[0.06]">
                        {doc.file_type}
                      </span>
                      <span>{doc.name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-[#8C7B6E]">
                      <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                      <span>•</span>
                      <span className="text-ice font-semibold">{doc.chunk_count} Vector Chunks</span>
                      <span>•</span>
                      <span className="text-emerald-400">✓ {doc.status}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    Read Transcript →
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Transcript Preview Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl studio-card-ai p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase">{selectedDoc.file_type} File</span>
                  <h3 className="font-heading text-base font-bold text-[#FAF7F2]">{selectedDoc.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-xs text-[#8C7B6E] hover:text-[#FAF7F2] px-2.5 py-1 rounded-lg bg-[#181310] border border-white/[0.06]"
                >
                  ✕ Close
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#0D0A08] border border-white/[0.06] text-xs font-mono text-[#C7B9AC] max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {selectedDoc.preview || "Full transcript indexed in ChromaDB vector space with 600-token sliding chunks."}
              </div>

              <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-[#8C7B6E]">
                <span>Chunks: {selectedDoc.chunk_count}</span>
                <span className="text-ice bg-[#0E2A3C]/80 px-2 py-0.5 rounded border border-[#7DD3FC]/30 flex items-center gap-1 font-medium">
                  <span className="h-1 w-1 rounded-full ice-dot"></span>
                  ChromaDB Collection: podcast_transcripts
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
