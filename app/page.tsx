"use client";
import { useState, useEffect } from "react";
import { TamilNaduEmblem, CCMCSeal } from "@/components/CivicLogos";
import ReportIssue from "@/components/ReportIssue";
import TrackIssues from "@/components/TrackIssues";
import AdminDashboard from "@/components/AdminDashboard";
import { CivicIssue } from "@/lib/types";
import { SEED_ISSUES } from "@/lib/data";
import { FileText, Search, Shield, Cpu, ChevronRight } from "lucide-react";

type TabId = "report" | "track" | "admin";

const STORAGE_KEY = "civic_resolve_issues";

function loadIssues(): CivicIssue[] {
  if (typeof window === "undefined") return SEED_ISSUES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ISSUES));
      return SEED_ISSUES;
    }
    return JSON.parse(stored);
  } catch {
    return SEED_ISSUES;
  }
}

function saveIssues(issues: CivicIssue[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("report");
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIssues(loadIssues());
    setMounted(true);
  }, []);

  const updateIssues = (updated: CivicIssue[]) => {
    setIssues(updated);
    saveIssues(updated);
  };

  const addIssue = (issue: CivicIssue) => {
    const updated = [issue, ...issues];
    updateIssues(updated);
  };

  const resetDemoData = () => {
    updateIssues(SEED_ISSUES);
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "report", label: "Report Issue", icon: <FileText size={18}/>, desc: "Citizen Submission Portal" },
    { id: "track", label: "Track Issues", icon: <Search size={18}/>, desc: "Public Transparency Dashboard" },
    { id: "admin", label: "Admin Dashboard", icon: <Shield size={18}/>, desc: "Municipal Command Center" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Tricolor top stripe */}
      <div className="tricolor-bar h-1.5 w-full"/>

      {/* Government Header */}
      <header className="bg-gradient-to-r from-[#0f2a5e] via-[#1a3a6b] to-[#0f2a5e] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left: TN Emblem + CCMC */}
            <div className="flex items-center gap-4">
              <TamilNaduEmblem size={58}/>
              <div>
                <div className="text-xs text-amber-300 font-semibold tracking-widest uppercase">Government of Tamil Nadu</div>
                <div className="text-lg font-bold leading-tight">தமிழ்நாடு அரசு</div>
                <div className="text-xs text-blue-200 mt-0.5">Coimbatore City Municipal Corporation</div>
              </div>
              <div className="hidden sm:block w-px h-14 bg-blue-400 opacity-40 mx-2"/>
              <div className="hidden sm:flex items-center gap-3">
                <CCMCSeal size={52}/>
                <div>
                  <div className="text-sm font-bold text-amber-300">CCMC Portal</div>
                  <div className="text-xs text-blue-200 leading-tight max-w-[180px]">Unified Civic Grievance<br/>Redressal System</div>
                </div>
              </div>
            </div>

            {/* Right: AI badge + title */}
            <div className="flex flex-col items-end gap-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                <Cpu size={12}/> AI-Assisted Civic Prototype
              </span>
              <div className="text-right">
                <div className="text-base font-bold text-white leading-tight">CivicResolve</div>
                <div className="text-xs text-blue-200">PromptWars × GDG PSG iTech 2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* Portal title bar */}
        <div className="bg-[#0a1f4e] border-t border-blue-700 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
            <ChevronRight size={14} className="text-amber-400"/>
            <span className="text-amber-400 font-semibold">CCMC Unified Civic Grievance Redressal Portal</span>
            <span className="text-blue-400 ml-auto text-xs hidden sm:block">
              Powered by Google Gemini AI · Structured JSON Triage · Real-Time Dispatch
            </span>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-label={`${tab.label} - ${tab.desc}`}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-700 text-blue-700 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className={`hidden sm:block text-xs font-normal ${activeTab === tab.id ? "text-blue-500" : "text-gray-400"}`}>
                  — {tab.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6" role="main">
        {!mounted ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"/>
          </div>
        ) : (
          <>
            {activeTab === "report" && (
              <ReportIssue onIssueSubmit={addIssue} onSwitchToTrack={() => setActiveTab("track")}/>
            )}
            {activeTab === "track" && (
              <TrackIssues issues={issues}/>
            )}
            {activeTab === "admin" && (
              <AdminDashboard issues={issues} onUpdateIssues={updateIssues} onResetDemo={resetDemoData}/>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0f2a5e] text-blue-200 text-center py-4 text-xs mt-auto">
        <div className="tricolor-bar h-1 w-full mb-3"/>
        <p className="font-semibold text-white">CivicResolve · CCMC Unified Civic Grievance Redressal Portal</p>
        <p className="mt-1">Government of Tamil Nadu &middot; Coimbatore City Municipal Corporation &middot; Powered by Google Gemini AI</p>
        <p className="mt-1 text-blue-300">PromptWars × GDG on Campus PSG iTech Hackathon 2026 · AI-Assisted Civic Prototype</p>
      </footer>
    </div>
  );
}
