"use client";
import { useState, useMemo } from "react";
import {
  Shield, RefreshCw, ChevronDown, ChevronUp, Truck, CheckCircle2,
  AlertCircle, Clock, BarChart3, Filter
} from "lucide-react";
import { CivicIssue, IssueStatus, Priority, DepartmentName } from "@/lib/types";
import { DepartmentBadge, DeptFilterPill } from "@/components/CivicLogos";
import { PRIORITY_COLORS, STATUS_COLORS, DEPARTMENTS } from "@/lib/data";
import { formatDate } from "@/lib/utils";

interface AdminDashboardProps {
  issues: CivicIssue[];
  onUpdateIssues: (issues: CivicIssue[]) => void;
  onResetDemo: () => void;
}

interface AdminCardProps {
  issue: CivicIssue;
  onUpdate: (updated: CivicIssue) => void;
}

function AdminIssueCard({ issue, onUpdate }: AdminCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [adminNote, setAdminNote] = useState(issue.adminNote || "");
  const [editingNote, setEditingNote] = useState(false);

  const updateStatus = (status: IssueStatus) => {
    onUpdate({
      ...issue,
      status,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateDept = (dept: string) => {
    onUpdate({
      ...issue,
      aiTriage: issue.aiTriage
        ? { ...issue.aiTriage, recommendedDepartment: dept as DepartmentName }
        : issue.aiTriage,
      updatedAt: new Date().toISOString(),
    });
  };

  const updatePriority = (priority: Priority) => {
    onUpdate({
      ...issue,
      aiTriage: issue.aiTriage
        ? { ...issue.aiTriage, priority }
        : issue.aiTriage,
      updatedAt: new Date().toISOString(),
    });
  };

  const saveNote = () => {
    onUpdate({
      ...issue,
      adminNote: adminNote.trim(),
      updatedAt: new Date().toISOString(),
    });
    setEditingNote(false);
  };

  const triage = issue.aiTriage;

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className={`h-1.5 w-full ${
        triage?.priority === "Critical" ? "bg-red-500" :
        triage?.priority === "High" ? "bg-orange-500" :
        triage?.priority === "Medium" ? "bg-yellow-500" : "bg-green-500"
      }`}/>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {issue.id}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[issue.status] || ""}`}>
                {issue.status}
              </span>
              {triage && (
                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${PRIORITY_COLORS[triage.priority]}`}>
                  {triage.priority}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">{issue.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">📍 {issue.location} · {formatDate(issue.updatedAt)}</p>
          </div>
          {issue.imageBase64 && (
            <img
              src={`data:${issue.imageMimeType || "image/jpeg"};base64,${issue.imageBase64}`}
              alt="Issue photo"
              className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            />
          )}
        </div>

        {/* Department badge */}
        {triage && (
          <div className="mb-3">
            <DepartmentBadge deptName={triage.recommendedDepartment} size="sm"/>
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {issue.status !== "In Progress" && (
            <button
              onClick={() => updateStatus("In Progress")}
              aria-label={`Mark ${issue.id} as In Progress`}
              className="flex-1 min-w-0 flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Truck size={13}/> Dispatch Crew / In Progress
            </button>
          )}
          {issue.status !== "Resolved" && (
            <button
              onClick={() => updateStatus("Resolved")}
              aria-label={`Mark ${issue.id} as Resolved`}
              className="flex-1 min-w-0 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <CheckCircle2 size={13}/> Mark Resolved
            </button>
          )}
          {issue.status !== "Reported" && (
            <button
              onClick={() => updateStatus("Reported")}
              aria-label={`Reset ${issue.id} to Reported`}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Expand for more controls */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-600 transition-colors mb-2"
          aria-expanded={expanded}
          aria-label="Toggle advanced admin controls"
        >
          <span className="flex items-center gap-1"><Shield size={12}/> Advanced Controls & Field Notes</span>
          {expanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
        </button>

        {expanded && (
          <div className="space-y-3 border-t border-gray-100 pt-3">
            {/* Status dropdown */}
            <div>
              <label htmlFor={`status-${issue.id}`} className="block text-xs font-semibold text-gray-600 mb-1">Update Status</label>
              <select
                id={`status-${issue.id}`}
                value={issue.status}
                onChange={(e) => updateStatus(e.target.value as IssueStatus)}
                className="w-full text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Update issue status"
              >
                {["Reported", "In Progress", "Resolved"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Priority dropdown */}
            <div>
              <label htmlFor={`priority-${issue.id}`} className="block text-xs font-semibold text-gray-600 mb-1">Reassign Priority</label>
              <select
                id={`priority-${issue.id}`}
                value={triage?.priority || "Medium"}
                onChange={(e) => updatePriority(e.target.value as Priority)}
                className="w-full text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Reassign priority"
              >
                {["Critical", "High", "Medium", "Low"].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Department dropdown */}
            <div>
              <label htmlFor={`dept-${issue.id}`} className="block text-xs font-semibold text-gray-600 mb-1">Reassign Department</label>
              <select
                id={`dept-${issue.id}`}
                value={triage?.recommendedDepartment || ""}
                onChange={(e) => updateDept(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Reassign department"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Field Note */}
            <div>
              <label htmlFor={`note-${issue.id}`} className="block text-xs font-semibold text-gray-600 mb-1">Official Field Update Note</label>
              {editingNote ? (
                <div>
                  <textarea
                    id={`note-${issue.id}`}
                    rows={3}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Enter official field update for citizens..."
                    className="w-full text-xs border border-blue-300 rounded-md px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                    aria-label="Official field update note"
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={saveNote}
                      aria-label="Save field note"
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors"
                    >
                      Save Note
                    </button>
                    <button
                      onClick={() => { setAdminNote(issue.adminNote || ""); setEditingNote(false); }}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setEditingNote(true)}
                  className="cursor-pointer border border-dashed border-gray-300 rounded-md px-3 py-2 text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors min-h-[40px]"
                  role="button"
                  aria-label="Click to add field note"
                >
                  {issue.adminNote || "Click to add official field note..."}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function AdminDashboard({ issues, onUpdateIssues, onResetDemo }: AdminDashboardProps) {
  const [deptFilter, setDeptFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Department workload stats
  const deptStats = useMemo(() => {
    return DEPARTMENTS.map((dept) => {
      const deptIssues = issues.filter(i => i.aiTriage?.recommendedDepartment === dept);
      const open = deptIssues.filter(i => i.status !== "Resolved").length;
      const critical = deptIssues.filter(i => i.aiTriage?.priority === "Critical").length;
      const resolved = deptIssues.filter(i => i.status === "Resolved").length;
      const total = deptIssues.length;
      const resolvedPct = total ? Math.round((resolved / total) * 100) : 0;
      return { dept, open, critical, resolved, total, resolvedPct };
    });
  }, [issues]);

  // Overall stats
  const totalOpen = issues.filter(i => i.status !== "Resolved").length;
  const totalCritical = issues.filter(i => i.aiTriage?.priority === "Critical").length;
  const totalResolved = issues.filter(i => i.status === "Resolved").length;

  const updateIssue = (updated: CivicIssue) => {
    onUpdateIssues(issues.map(i => i.id === updated.id ? updated : i));
  };

  const filtered = useMemo(() => {
    return issues.filter(issue => {
      const matchStatus = statusFilter === "All" || issue.status === statusFilter;
      const matchPriority = priorityFilter === "All" || issue.aiTriage?.priority === priorityFilter;
      const matchDept = !deptFilter || issue.aiTriage?.recommendedDepartment === deptFilter;
      return matchStatus && matchPriority && matchDept;
    });
  }, [issues, statusFilter, priorityFilter, deptFilter]);

  return (
    <section aria-label="Admin Municipal Command Dashboard">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield size={24} className="text-blue-700"/> Municipal Triage & Resolution Command Center
          </h1>
          <p className="text-gray-600 mt-1">Manage civic issue dispatch, field crew assignment, and resolution tracking.</p>
        </div>
        <button
          onClick={onResetDemo}
          aria-label="Reset to demo data"
          className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-300 text-orange-700 text-sm font-semibold rounded-lg hover:bg-orange-100 transition-colors"
        >
          <RefreshCw size={15}/> Reset Demo Data
        </button>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Open", value: totalOpen, icon: <AlertCircle size={20} className="text-orange-500"/>, color: "border-orange-200 bg-orange-50" },
          { label: "Critical Priority", value: totalCritical, icon: <AlertCircle size={20} className="text-red-500"/>, color: "border-red-200 bg-red-50" },
          { label: "Resolved", value: totalResolved, icon: <CheckCircle2 size={20} className="text-green-500"/>, color: "border-green-200 bg-green-50" },
        ].map(kpi => (
          <div key={kpi.label} className={`bg-white rounded-xl border-2 ${kpi.color} p-4 shadow-sm`}>
            <div className="flex justify-between items-center mb-2">
              {kpi.icon}
              <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
            </div>
            <p className="text-xs font-semibold text-gray-600">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Department Workload Cards */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <BarChart3 size={20} className="text-blue-600"/> Department-Wise Workload
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {deptStats.map(({ dept, open, critical, total, resolvedPct }) => (
            <div
              key={dept}
              className={`bg-white rounded-xl border-2 p-4 shadow-sm cursor-pointer transition-all ${
                deptFilter === dept ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => setDeptFilter(deptFilter === dept ? null : dept)}
              role="button"
              aria-pressed={deptFilter === dept}
              aria-label={`Filter by ${dept}`}
            >
              <div className="mb-3">
                <DepartmentBadge deptName={dept} size="sm"/>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div>
                  <div className="text-lg font-bold text-gray-900">{total}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">{open}</div>
                  <div className="text-xs text-gray-500">Open</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">{critical}</div>
                  <div className="text-xs text-gray-500">Critical</div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Resolution</span>
                  <span className="font-semibold">{resolvedPct}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${resolvedPct}%` }}
                    role="progressbar"
                    aria-valuenow={resolvedPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Triage Queue Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Filter size={14}/> Triage Queue Filters
        </h2>
        <div className="flex flex-wrap gap-3 mb-3">
          <div>
            <label htmlFor="admin-status-filter" className="text-xs font-semibold text-gray-600 mr-1">Status:</label>
            <select
              id="admin-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              aria-label="Admin filter by status"
            >
              {["All", "Reported", "In Progress", "Resolved"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="admin-priority-filter" className="text-xs font-semibold text-gray-600 mr-1">Priority:</label>
            <select
              id="admin-priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              aria-label="Admin filter by priority"
            >
              {["All", "Critical", "High", "Medium", "Low"].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dept filter pills */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Admin department filter">
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
          {DEPARTMENTS.map(dept => (
            <DeptFilterPill
              key={dept}
              deptName={dept}
              selected={deptFilter === dept}
              onClick={() => setDeptFilter(deptFilter === dept ? null : dept)}
            />
          ))}
        </div>
      </div>

      {/* Issue Queue */}
      <div className="mb-3">
        <span className="text-sm text-gray-600 font-semibold">{filtered.length} issue{filtered.length !== 1 ? "s" : ""} in queue</span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <Clock size={40} className="mx-auto text-gray-300 mb-3"/>
          <p className="text-gray-500 font-semibold">No issues match the current filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(issue => (
            <AdminIssueCard key={issue.id} issue={issue} onUpdate={updateIssue}/>
          ))}
        </div>
      )}
    </section>
  );
}
