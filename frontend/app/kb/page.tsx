"use client";

import React, { useState, useEffect } from "react";

export default function KnowledgeBase() {
  const [kbs, setKbs] = useState<any[]>([]);
  const [activeKbId, setActiveKbId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

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
      // Offline mock data
      setKbs([
        {
          id: 1,
          name: "General Transcripts",
          description: "Collection of mock transcripts and research docs for immediate semantic testing.",
          documents: [
            {
              id: 101,
              name: "Sample Transcript - Startup Scaling.txt",
              file_type: "txt",
              file_size: 2450,
              chunk_count: 3,
              status: "processed",
              created_at: "2026-07-20T08:00:00Z"
            },
            {
              id: 102,
              name: "WTF is Option Trading Brief.pdf",
              file_type: "pdf",
              file_size: 14520,
              chunk_count: 14,
              status: "processed",
              created_at: "2026-07-19T14:30:00Z"
            }
          ]
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeKbId) return;

    setUploading(true);
    setUploadProgress("Uploading file to server...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Upload to endpoint
      const response = await fetch(`http://localhost:8000/kb/${activeKbId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadProgress("File uploaded! Extracting text and chunking...");
        setTimeout(() => {
          setUploadProgress("Indexing vectors in ChromaDB...");
          setTimeout(() => {
            setUploading(false);
            setUploadProgress("");
            fetchKbs();
          }, 1000);
        }, 1000);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Mock upload
      setUploadProgress("Extracting & Indexing (Offline Mock)...");
      setTimeout(() => {
        setKbs((prev) =>
          prev.map((kb) => {
            if (kb.id === activeKbId) {
              return {
                ...kb,
                documents: [
                  ...kb.documents,
                  {
                    id: Date.now(),
                    name: file.name,
                    file_type: file.name.split(".").pop() || "txt",
                    file_size: file.size,
                    chunk_count: Math.floor(file.size / 300) + 1,
                    status: "processed",
                    created_at: new Date().toISOString()
                  }
                ]
              };
            }
            return kb;
          })
        );
        setUploading(false);
        setUploadProgress("");
      }, 1500);
    }
  };

  const deleteDocument = async (docId: number) => {
    if (!confirm("Are you sure you want to delete this document from the index?")) return;

    try {
      const response = await fetch(`http://localhost:8000/kb/document/${docId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        fetchKbs();
      } else {
        throw new Error();
      }
    } catch (err) {
      // Offline fallback
      setKbs((prev) =>
        prev.map((kb) => {
          if (kb.id === activeKbId) {
            return {
              ...kb,
              documents: kb.documents.filter((d: any) => d.id !== docId)
            };
          }
          return kb;
        })
      );
    }
  };

  const activeKb = kbs.find((k) => k.id === activeKbId);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Knowledge Base</h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Upload and index transcripts, scripts, spreadsheets, or PDFs. Uploaded docs are embedded and automatically made queryable in PodcastGPT Chat.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column: Upload Panel */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-white tracking-tight">Upload Document</h3>
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="border-2 border-dashed border-white/[0.08] hover:border-indigo-500/50 rounded-xl p-8 text-center transition cursor-pointer relative group">
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-500 mx-auto group-hover:text-indigo-400 transition">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <div className="text-xs font-semibold text-white">Click or drag files to upload</div>
                <div className="text-[10px] text-slate-500">PDF, DOCX, TXT, CSV, MD up to 10MB</div>
              </div>
            </div>

            {uploading && (
              <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-3 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-indigo-300 font-medium">
                  <div className="h-3 w-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>{uploadProgress}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Documents Index Table */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Indexed Documents {activeKb ? `(${activeKb.documents.length})` : ""}
            </h3>
          </div>

          <div className="glass-card rounded-xl overflow-hidden border border-white/[0.06]">
            {loading ? (
              <div className="p-12 text-center text-sm text-slate-500">Loading documents...</div>
            ) : activeKb && activeKb.documents.length > 0 ? (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-slate-950/40 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="p-4">Document Name</th>
                    <th className="p-4">Format</th>
                    <th className="p-4">Size</th>
                    <th className="p-4">Chunks</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {activeKb.documents.map((doc: any) => (
                    <tr key={doc.id} className="hover:bg-white/[0.01] text-slate-300 transition">
                      <td className="p-4 font-medium text-white truncate max-w-xs">{doc.name}</td>
                      <td className="p-4 uppercase text-[10px] font-mono text-indigo-400">{doc.file_type}</td>
                      <td className="p-4 text-slate-400 font-mono">{(doc.file_size / 1024).toFixed(1)} KB</td>
                      <td className="p-4 font-mono">{doc.chunk_count}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="text-red-400 hover:text-red-300 font-medium hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-sm text-slate-500">
                No documents uploaded yet. Drag a transcript file to the upload area to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
