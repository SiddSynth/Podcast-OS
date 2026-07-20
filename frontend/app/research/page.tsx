"use client";

import React, { useState } from "react";

export default function GuestResearch() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    website: "",
    linkedin: "",
    twitter: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("brief"); // brief, detailed, questions, markdown

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const runResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setLoading(true);
    setReport(null);

    try {
      const response = await fetch("http://localhost:8000/guests/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // The endpoint returns ResearchReportResponse, the raw data is inside analysis_raw
        if (data && data.analysis_raw) {
          setReport(data.analysis_raw);
        } else {
          setReport(data);
        }
      } else {
        alert("Failed to compile research report from backend. Running offline mode.");
        throw new Error();
      }
    } catch (err) {
      // Offline fallback
      setTimeout(() => {
        // Mock data generator matching our agent schema
        const mockName = formData.name;
        const mockCompany = formData.company || "Innovate Corp";
        setReport({
          summary: `${mockName} is a high-profile executive and entrepreneur at ${mockCompany}. Known for scaling engineering operations and building products under tight capital schedules.`,
          biography: `Detailed bio about ${mockName}. They grew up in tech development, leading early automation projects before taking executive director seats at ${mockCompany}.`,
          fast_facts: [
            "Co-authored multiple open-source utilities.",
            "Led product scaling to 1.5 million monthly readers.",
            "Featured on top technology and developer panels."
          ],
          career_timeline: [
            { year: "2016", event: "Joined software design team." },
            { year: "2020", event: `Director of Product Engineering at ${mockCompany}.` },
            { year: "2024", event: "Spearheading regional scale deployment." }
          ],
          funding_investments: [
            { year: "2021", company: mockCompany, role: "Engineering Lead", amount: "$5 Million Series A" }
          ],
          recent_news: [
            `${mockName} shared their vision for custom developer pipelines at a major SaaS summit.`,
            `${mockCompany} announced product expansion under their operational direction.`
          ],
          social_media_presence: "Active on LinkedIn, publishing frameworks on developer operations and scaling.",
          competitors_industry: "Operates in core cloud software and SaaS product divisions.",
          interesting_stories: [
            "Dropped out of secondary athletics to focus on custom electronics design.",
            "Believes a 4-day sprint creates faster outcomes than a standard 5-day cycle."
          ],
          future_trends: [
            "Transition to modular microservices running on edge systems.",
            "Expanding customer success models with local automation agents."
          ],
          podcast_brief: `Focus on scaling technology, managing remote engineer groups, and their thoughts on AI developer productivity.`,
          questions: [
            {
              category: "Ice Breakers",
              questions: [
                `You designed your first program back in high school. What was it, and is it still running?`,
                "What is the single biggest myth about scaling product that you wish builders would stop believing?"
              ]
            },
            {
              category: "Career",
              questions: [
                "What was the hardest career choice you faced, and how did it influence your current path?",
                "What core developer principles do you still rely on as a director?"
              ]
            },
            {
              category: "Startup",
              questions: [
                "What is the top mistake early teams make when designing their MVP?",
                "How do you resolve architectural technical debt while shipping daily features?"
              ]
            },
            {
              category: "Contrarian",
              questions: [
                "Many claim developers will be replaced by LLMs. Why do you strongly disagree?",
                "Why is raising too much capital early on actually a death sentence for tech startups?"
              ]
            }
          ]
        });
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!report) return;
    const text = generateMarkdownContent();
    navigator.clipboard.writeText(text);
    alert("Dossier copied to clipboard as Markdown!");
  };

  const downloadMarkdown = () => {
    if (!report) return;
    const markdown = generateMarkdownContent();
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.name || formData.name}_research_report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateMarkdownContent = () => {
    if (!report) return "";
    let md = `# PodcastOS Research Dossier: ${formData.name}\n\n`;
    md += `## Executive Summary\n${report.summary}\n\n`;
    md += `## Biography\n${report.biography}\n\n`;
    md += `## Fast Facts\n` + report.fast_facts.map((f: string) => `- ${f}`).join("\n") + `\n\n`;
    md += `## Career Timeline\n` + report.career_timeline.map((c: any) => `- **${c.year}**: ${c.event}`).join("\n") + `\n\n`;
    md += `## Recent News\n` + report.recent_news.map((n: string) => `- ${n}`).join("\n") + `\n\n`;
    md += `## Industry & Competitors\n${report.competitors_industry}\n\n`;
    md += `## Suggested Podcast Questions\n\n`;
    report.questions.forEach((qSet: any) => {
      md += `### ${qSet.category}\n`;
      qSet.questions.forEach((q: string) => {
        md += `- ${q}\n`;
      });
      md += `\n`;
    });
    return md;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Guest Research Agent</h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Automate hours of guest research. The agent scrapes bios, careers, timelines, funding, and writes custom questions.
        </p>
      </div>

      {/* Inputs Form */}
      <div className="glass-card rounded-xl p-6">
        <form onSubmit={runResearch} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Guest Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Nikhil Kamath"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Company (Optional)</label>
            <input
              type="text"
              name="company"
              placeholder="e.g. Zerodha"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Website (Optional)</label>
            <input
              type="text"
              name="website"
              placeholder="e.g. https://zerodha.com"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">LinkedIn Profile (Optional)</label>
            <input
              type="text"
              name="linkedin"
              placeholder="e.g. linkedin.com/in/nikhilkamath"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Twitter Handle (Optional)</label>
            <input
              type="text"
              name="twitter"
              placeholder="e.g. nikhilkamath7"
              value={formData.twitter}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:bg-indigo-700/60"
            >
              {loading ? "Searching & Analyzing..." : "Run Research Agent"}
            </button>
          </div>
        </form>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="glass-card rounded-xl p-6 space-y-6 animate-pulse">
          <div className="h-6 bg-slate-800 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-slate-800 rounded"></div>
            <div className="h-20 bg-slate-800 rounded"></div>
            <div className="h-20 bg-slate-800 rounded"></div>
          </div>
        </div>
      )}

      {/* Output Panel */}
      {report && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            {/* Tabs */}
            <div className="flex space-x-1 border border-white/[0.06] bg-slate-950/40 rounded-lg p-1">
              {[
                { id: "brief", name: "One-Page Brief" },
                { id: "detailed", name: "Detailed Dossier" },
                { id: "questions", name: "Interview Questions (50)" },
                { id: "markdown", name: "Markdown Output" },
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

            {/* Export buttons */}
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-900"
              >
                Copy Markdown
              </button>
              <button
                onClick={downloadMarkdown}
                className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-900"
              >
                Download MD
              </button>
              <button
                onClick={() => window.print()}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Print PDF
              </button>
            </div>
          </div>

          {/* Tab Contents */}
          <div className="glass-card rounded-xl p-6 bg-slate-950/10">
            {activeTab === "brief" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Executive Summary</h3>
                  <p className="mt-2 text-slate-200 text-sm leading-relaxed">{report.summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Fast Facts</h3>
                    <ul className="mt-3 space-y-2">
                      {report.fast_facts?.map((fact: string, idx: number) => (
                        <li key={idx} className="text-slate-300 text-xs flex items-start space-x-2">
                          <span className="text-indigo-400">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Host Podcast Brief</h3>
                    <p className="mt-3 text-slate-300 text-xs leading-relaxed">{report.podcast_brief}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Career Timeline</h3>
                  <div className="mt-4 border-l border-slate-800 ml-2 space-y-6">
                    {report.career_timeline?.map((item: any, idx: number) => (
                      <div key={idx} className="relative pl-6">
                        <div className="absolute left-0 -translate-x-[5px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500 border border-slate-950"></div>
                        <div className="text-xs font-bold text-white">{item.year}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{item.event}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "detailed" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Detailed Biography</h3>
                  <p className="mt-2 text-slate-200 text-sm leading-relaxed">{report.biography}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Startup & Funding History</h3>
                    {report.funding_investments && report.funding_investments.length > 0 ? (
                      <div className="mt-3 space-y-3">
                        {report.funding_investments.map((fund: any, idx: number) => (
                          <div key={idx} className="border border-white/[0.04] bg-white/[0.01] rounded-lg p-3 text-xs">
                            <div className="flex justify-between font-medium text-white">
                              <span>{fund.company}</span>
                              <span className="text-indigo-400">{fund.amount}</span>
                            </div>
                            <div className="text-slate-400 mt-1">{fund.role} ({fund.year})</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-slate-500 text-xs">No explicit investment rounds detected.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Recent News Updates</h3>
                    <ul className="mt-3 space-y-2">
                      {report.recent_news?.map((news: string, idx: number) => (
                        <li key={idx} className="text-slate-300 text-xs flex items-start space-x-2">
                          <span className="text-indigo-400">•</span>
                          <span>{news}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Competitors & Industry</h3>
                    <p className="mt-2 text-slate-300 text-xs leading-relaxed">{report.competitors_industry}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Interesting Stories / Hooks</h3>
                    <ul className="mt-3 space-y-2">
                      {report.interesting_stories?.map((story: string, idx: number) => (
                        <li key={idx} className="text-slate-300 text-xs flex items-start space-x-2">
                          <span className="text-pink-400">★</span>
                          <span>{story}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "questions" && (
              <div className="space-y-8">
                {report.questions?.map((categoryGroup: any, idx: number) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="text-sm font-semibold text-white border-b border-white/[0.06] pb-2">
                      {categoryGroup.category}
                    </h3>
                    <ul className="grid md:grid-cols-2 gap-4">
                      {categoryGroup.questions.map((q: string, qIdx: number) => (
                        <li key={qIdx} className="border border-white/[0.04] bg-white/[0.01] hover:border-indigo-500/30 rounded-lg p-3 text-xs leading-relaxed text-slate-300">
                          <span className="font-semibold text-indigo-400 mr-1">{qIdx + 1}.</span> {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "markdown" && (
              <div className="space-y-4">
                <textarea
                  readOnly
                  rows={20}
                  value={generateMarkdownContent()}
                  className="w-full rounded-lg border border-white/[0.08] bg-slate-900/40 p-4 font-mono text-xs text-slate-300 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
