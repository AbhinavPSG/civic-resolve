"use client";
import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, ChevronUp, Eye, CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { CivicIssue } from "@/lib/types";
import { DepartmentBadge, DeptFilterPill } from "@/components/CivicLogos";
import { PRIORITY_COLORS, STATUS_COLORS, DEPARTMENTS } from "@/lib/data";
import { formatDate } from "@/lib/utils";

interface TrackIssuesProps {
  issues: CivicIssue[];
}

const STATUS_STEPS = ["Reported", "In Progress", "Resolved"];

function ProgressStepper({ status }: { status: string }) {
  const currentStep = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-0 w-full" role="progressbar" aria-label={`Issue status: ${status}`} aria-valuenow={currentStep + 1} aria-valuemax={3}>
      {STATUS_STEPS.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                done ? "bg-green-500 border-green-500 text-white" :
                active ? "bg-blue-600 border-blue-600 text-white animate-pulse" :
                "bg-gray-200 border-gray-300 text-gray-400"
              }`}>
                {done ? <CheckCircle2 size={14}/> : i + 1}
              </div>
              <span className={`text-[9px] mt-0.5 font-semibold text-center leading-tight ${
                active ? "text-blue-600" : done ? "text-green-600" : "text-gray-400"
              }`}>
                {step}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-1 mx-1 rounded-full ${
                i < currentStep ? "bg-green-400" : "bg-gray-200"
              }`}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

function IssueCard({ issue }: { issue: CivicIssue }) {
  const [expanded, setExpanded] = useState(false);
  const triage = issue.aiTriage;

  const urgencyBarColor = (score: number) => {
    if (score >= 85) return "bg-red-500";
    if (score >= 65) return "bg-orange-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Priority strip */}
      <div className={`h-1 w-full ${
        triage?.priority === "Critical" ? "bg-red-500" :
        triage?.priority === "High" ? "bg-orange-500" :
        triage?.priority === "Medium" ? "bg-yellow-500" : "bg-green-500"
      }`}/>

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {issue.id}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[issue.status] || "bg-gray-100 text-gray-600"}`}>
                {issue.status}
              </span>
              {triage && (
                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${PRIORITY_COLORS[triage.priority]}`}>
                  {triage.priority}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{issue.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">📍 {issue.location} · {formatDate(issue.createdAt)}</p>
          </div>
          {issue.imageBase64 && (
            <img
              src={`data:${issue.imageMimeType || "image/jpeg"};base64,${issue.imageBase64}`}
              alt="Civic issue photo"
              className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            />
          )}
        </div>

        {/* Department */}
        {triage && (
          <div className="mb-3">
            <DepartmentBadge deptName={triage.recommendedDepartment} size="sm"/>
          </div>
        )}

        {/* Progress Stepper */}
        <div className="mb-3">
          <ProgressStepper status={issue.status}/>
        </div>

        {/* Urgency score */}
        {triage && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Public Impact Score</span>
              <span className="font-bold text-gray-700">{triage.urgencyScore}/100</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${urgencyBarColor(triage.urgencyScore)}`}
                style={{ width: `${triage.urgencyScore}%` }}
                role="progressbar"
                aria-valuenow={triage.urgencyScore}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )}

        {/* Admin Note */}
        {issue.adminNote && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
            <p className="text-xs text-amber-800 font-semibold mb-0.5">📋 Official Field Update</p>
            <p className="text-xs text-amber-700">{issue.adminNote}</p>
          </div>
        )}

        {/* Expandable AI Analysis */}
        {triage && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-600 transition-colors"
              aria-expanded={expanded}
              aria-label="View AI Triage Analysis"
            >
              <span className="flex items-center gap-1">
                <Eye size={12}/> View AI Triage Analysis
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  triage.analysisSource === "gemini-live"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {triage.analysisSource === "gemini-live" ? "LIVE" : "FALLBACK"}
                </span>
              </span>
              {expanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
            </button>
            {expanded && (
              <div className="p-3 space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-gray-600">AI Summary: </span>
                  <span className="text-gray-700">{triage.aiSummary}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">AI Reasoning: </span>
                  <span className="text-gray-700">{triage.aiReasoning}</span>
                </div>
                <div className="flex gap-3 flex-wrap pt-1 border-t border-gray-100">
                  <div><span className="font-semibold text-gray-600">Category: </span>{triage.aiCategory}</div>
                  <div><span className="font-semibold text-gray-600">SLA: </span>{triage.estimatedResolutionSla}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function TrackIssues({ issues }: TrackIssuesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState<string | null>(null);

  // KPI stats
  const stats = useMemo(() => {
    const total = issues.length;
    const criticalHigh = issues.filter(i => i.aiTriage?.priority === "Critical" || i.aiTriage?.priority === "High").length;
    const inProgress = issues.filter(i => i.status === "In Progress").length;
    const resolved = issues.filter(i => i.status === "Resolved").length;
    const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;
    return { total, criticalHigh, inProgress, resolved, resolutionRate };
  }, [issues]);

  const filtered = useMemo(() => {
    return issues.filter(issue => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || issue.id.toLowerCase().includes(q) || issue.title.toLowerCase().includes(q) || issue.location.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || issue.status === statusFilter;
      const matchPriority = priorityFilter === "All" || issue.aiTriage?.priority === priorityFilter;
      const matchDept = !deptFilter || issue.aiTriage?.recommendedDepartment === deptFilter;
      return matchSearch && matchStatus && matchPriority && matchDept;
    });
  }, [issues, searchQuery, statusFilter, priorityFilter, deptFilter]);

  return (
    <section aria-label="Public Issue Tracking Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Public Transparency & Progress Dashboard</h1>
        <p className="text-gray-600 mt-1">Track all reported civic issues, their AI triage results, and real-time resolution progress.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Reported", value: stats.total, icon: <TrendingUp size={20} className="text-blue-500"/>, color: "border-blue-200 bg-blue-50" },
          { label: "Critical & High Priority", value: stats.criticalHigh, icon: <AlertCircle size={20} className="text-red-500"/>, color: "border-red-200 bg-red-50" },
          { label: "In Progress", value: stats.inProgress, icon: <Clock size={20} className="text-purple-500"/>, color: "border-purple-200 bg-purple-50" },
          { label: "Resolved", value: stats.resolved, icon: <CheckCircle2 size={20} className="text-green-500"/>, color: "border-green-200 bg-green-50" },
        ].map((kpi) => (
          <div key={kpi.label} className={`bg-white rounded-xl border-2 ${kpi.color} p-4 shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              {kpi.icon}
              <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
            </div>
            <p className="text-xs font-semibold text-gray-600">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Resolution Rate Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
          <span>Overall Resolution Rate</span>
          <span>{stats.resolutionRate}%</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
            style={{ width: `${stats.resolutionRate}%` }}
            role="progressbar"
            aria-valuenow={stats.resolutionRate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Resolution rate: ${stats.resolutionRate}%`}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{stats.resolved} of {stats.total} issues resolved</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            type="text"
            placeholder="Search by Ticket ID, title, or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search issues by ticket ID, title or landmark"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3 mb-3">
          <div>
            <label htmlFor="status-filter" className="text-xs font-semibold text-gray-600 mr-1">Status:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              aria-label="Filter by status"
            >
              {["All", "Reported", "In Progress", "Resolved"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="priority-filter" className="text-xs font-semibold text-gray-600 mr-1">Priority:</label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              aria-label="Filter by priority"
            >
              {["All", "Critical", "High", "Medium", "Low"].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Department Filter Pills */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by department">
          <button
            onClick={() => setDeptFilter(null)}
            aria-pressed={deptFilter === null}
            className={`px-3 py-1.5 rounded-full border-2 text-xs font-semibold transition-all ${
              deptFilter === null
                ? "bg-gray-800 border-gray-800 text-white"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            All Departments
          </button>
          {DEPARTMENTS.map((dept) => (
            <DeptFilterPill
              key={dept}
              deptName={dept}
              selected={deptFilter === dept}
              onClick={() => setDeptFilter(deptFilter === dept ? null : dept)}
            />
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-gray-600 font-semibold">
          {filtered.length} issue{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <Filter size={40} className="mx-auto text-gray-300 mb-3"/>
          <p className="text-gray-500 font-semibold">No issues match your filters</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting the search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((issue) => (
            <IssueCard key={issue.id} issue={issue}/>
          ))}
        </div>
      )}
    </section>
  );
}
