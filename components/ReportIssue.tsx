"use client";
import { useState, useRef, useCallback } from "react";
import {
  Upload, X, MapPin, Zap, Loader2, CheckCircle2,
  AlertTriangle, ChevronDown, ChevronUp, Eye, FileText,
  Navigation, Cpu
} from "lucide-react";
import { CivicIssue, AiTriageResult } from "@/lib/types";
import { generateTicketId, resizeImageOnCanvas, formatDate } from "@/lib/utils";
import { DepartmentBadge } from "@/components/CivicLogos";
import { PRIORITY_COLORS } from "@/lib/data";

interface ReportIssueProps {
  onIssueSubmit: (issue: CivicIssue) => void;
  onSwitchToTrack: () => void;
}

const SAMPLE_SCENARIOS = [
  {
    label: "Sample: Avinashi Rd Pothole",
    title: "Deep waterlogged pothole on Avinashi Road near Neelambur",
    description: "A severely waterlogged pothole approximately 2 feet deep has formed at the Neelambur flyover junction on the Avinashi Road bypass. Multiple two-wheelers have already skidded. Requires urgent barricading and cold-mix patching.",
    location: "Avinashi Road, Neelambur",
    category: "Roads & Potholes",
  },
  {
    label: "Sample: Peelamedu Garbage",
    title: "Overflowing garbage bin blocking footpath at Peelamedu Bus Stop",
    description: "The municipal garbage bin at Peelamedu Bus Stop has been overflowing for 3 consecutive days. Rotting waste is spilling onto the footpath creating public health hazard for daily commuters.",
    location: "Peelamedu Bus Stop",
    category: "Solid Waste & Sanitation",
  },
  {
    label: "Sample: Chinniampalayam Streetlights",
    title: "Three non-functional streetlights near Chinniampalayam junction",
    description: "Three streetlights in a row on the main road approaching the Chinniampalayam junction have been dark for over a week. The 200-metre stretch is completely unlit after 8 PM, causing road safety hazards especially for night-shift workers.",
    location: "Chinniampalayam",
    category: "Streetlights & Electrical",
  },
];

const QUICK_LOCATIONS = [
  "Avinashi Road, Neelambur",
  "Peelamedu Bus Stop",
  "Saravanampatti Junction",
  "Chinniampalayam",
];

const CATEGORIES = [
  "Auto-Detect with Gemini AI",
  "Roads & Potholes",
  "Solid Waste & Sanitation",
  "Streetlights & Electrical",
  "Water Supply & Drainage",
  "Public Parks & Encroachment",
  "Traffic & Road Safety",
];

const PRIORITY_ICON: Record<string, React.ReactNode> = {
  Critical: <AlertTriangle size={14} className="text-red-600"/>,
  High: <AlertTriangle size={14} className="text-orange-500"/>,
  Medium: <AlertTriangle size={14} className="text-yellow-600"/>,
  Low: <CheckCircle2 size={14} className="text-green-600"/>,
};

export default function ReportIssue({ onIssueSubmit, onSwitchToTrack }: ReportIssueProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Auto-Detect with Gemini AI");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState<AiTriageResult | null>(null);
  const [submittedIssue, setSubmittedIssue] = useState<CivicIssue | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fillSample = (sample: typeof SAMPLE_SCENARIOS[0]) => {
    setTitle(sample.title);
    setDescription(sample.description);
    setLocation(sample.location);
    setCategory(sample.category);
    setTriageResult(null);
    setSubmittedIssue(null);
    setError(null);
  };

  const handleImageFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const { base64, mimeType } = await resizeImageOnCanvas(file);
    setImageBase64(base64);
    setImageMimeType(mimeType);
    setImagePreview(`data:${mimeType};base64,${base64}`);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  }, [handleImageFile]);

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setImageMimeType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const detectGPS = () => {
    if (!navigator.geolocation) {
      setLocation("GPS not supported on this device");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        setGpsLoading(false);
      },
      () => {
        setLocation("Unable to detect GPS — please enter location manually");
        setGpsLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setTriageResult(null);
    setSubmittedIssue(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        userCategory: category === "Auto-Detect with Gemini AI" ? "Unknown" : category,
        ...(imageBase64 && imageMimeType ? { imageBase64, imageMimeType } : {}),
      };

      const res = await fetch("/api/analyze-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const triage: AiTriageResult = {
        aiCategory: data.aiCategory,
        priority: data.priority,
        urgencyScore: data.urgencyScore,
        recommendedDepartment: data.recommendedDepartment,
        estimatedResolutionSla: data.estimatedResolutionSla,
        aiSummary: data.aiSummary,
        aiReasoning: data.aiReasoning,
        analysisSource: data.analysisSource,
      };

      const newIssue: CivicIssue = {
        id: generateTicketId(),
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        userCategory: category,
        imageBase64: imageBase64 || undefined,
        imageMimeType: imageMimeType || undefined,
        status: "Reported",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiTriage: triage,
      };

      setTriageResult(triage);
      setSubmittedIssue(newIssue);
      onIssueSubmit(newIssue);
    } catch (err) {
      setError(`Analysis failed: ${err instanceof Error ? err.message : "Unknown error"}. Please try again.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const urgencyBarColor = (score: number) => {
    if (score >= 85) return "bg-red-500";
    if (score >= 65) return "bg-orange-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <section aria-label="Citizen Issue Reporting Portal">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Citizen Issue Reporting Portal</h1>
        <p className="text-gray-600 mt-1">Submit a civic complaint — Gemini AI will triage, classify, and route it to the correct municipal department.</p>
      </div>

      {/* Sample Scenario Buttons */}
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Quick-fill sample scenarios">
        {SAMPLE_SCENARIOS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => fillSample(s)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 hover:border-blue-400 transition-colors"
            aria-label={`Quick fill form with: ${s.label}`}
          >
            <Zap size={14}/>
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2" role="alert">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0"/>
                {error}
              </div>
            )}

            {/* Issue Title */}
            <div className="mb-4">
              <label htmlFor="issue-title" className="block text-sm font-semibold text-gray-700 mb-1">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                id="issue-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Large pothole on main road causing accidents"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                aria-required="true"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="issue-description" className="block text-sm font-semibold text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="issue-description"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail — location, severity, duration, affected people..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                aria-required="true"
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label htmlFor="issue-location" className="block text-sm font-semibold text-gray-700 mb-1">
                Location / Landmark <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="issue-location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Near Peelamedu Bus Stop, Coimbatore"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={detectGPS}
                  disabled={gpsLoading}
                  aria-label="Detect GPS Coordinates"
                  className="px-3 py-2 bg-green-50 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1 text-sm font-medium disabled:opacity-50"
                >
                  {gpsLoading ? <Loader2 size={14} className="animate-spin"/> : <Navigation size={14}/>}
                  GPS
                </button>
              </div>
              {/* Quick-fill chips */}
              <div className="flex flex-wrap gap-1.5 mt-2" aria-label="Quick-fill location options">
                {QUICK_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 border border-gray-200 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                  >
                    <MapPin size={10} className="inline mr-1"/>
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="issue-category" className="block text-sm font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                id="issue-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Upload Image <span className="text-gray-400 font-normal">(Optional — Gemini will visually analyze severity)</span>
              </label>
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Uploaded civic issue photo preview"
                    className="h-32 w-auto rounded-lg border border-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    aria-label="Remove uploaded photo"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow"
                  >
                    <X size={14}/>
                  </button>
                  <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    <Cpu size={10}/> Will be analyzed by Gemini Vision
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  aria-label="Upload image - click or drag and drop"
                >
                  <Upload size={24} className="mx-auto text-gray-400 mb-2"/>
                  <p className="text-sm text-gray-600">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — auto-compressed to 800px</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                aria-label="Upload issue photo"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file);
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAnalyzing}
              aria-label="Submit issue and analyze with Gemini AI"
              className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin"/>
                  Analyzing with Gemini AI...
                </>
              ) : (
                <>
                  <Zap size={18}/>
                  Submit & Analyze with Gemini AI
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Triage Result */}
        <div>
          {isAnalyzing && (
            <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"/>
              <p className="text-blue-700 font-semibold text-sm">Gemini AI is analyzing severity...</p>
              <p className="text-gray-500 text-xs mt-2">Inspecting visual evidence and routing to municipal department</p>
            </div>
          )}

          {triageResult && submittedIssue && !isAnalyzing && (
            <div className="bg-white rounded-xl border-2 border-blue-700 shadow-lg overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-sm">Official AI Triage Dispatch Card</div>
                  <div className="text-blue-200 text-xs font-mono mt-0.5">{submittedIssue.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    triageResult.analysisSource === "gemini-live"
                      ? "bg-green-400 text-green-900"
                      : "bg-yellow-400 text-yellow-900"
                  }`}>
                    {triageResult.analysisSource === "gemini-live" ? "✓ Live Gemini AI Verified" : "⚡ Heuristic Fallback"}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Department */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Routed Department</div>
                  <DepartmentBadge deptName={triageResult.recommendedDepartment} size="md"/>
                </div>

                {/* Priority + Category + SLA */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1 font-semibold">AI Category</div>
                    <div className="text-xs font-bold text-gray-800 leading-tight">{triageResult.aiCategory}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1 font-semibold">Priority</div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[triageResult.priority]}`}>
                      {PRIORITY_ICON[triageResult.priority]} {triageResult.priority}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1 font-semibold">SLA</div>
                    <div className="text-xs font-bold text-gray-800 leading-tight">{triageResult.estimatedResolutionSla}</div>
                  </div>
                </div>

                {/* Urgency Score */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="font-semibold">Public Impact Urgency Score</span>
                    <span className="font-bold text-gray-900">{triageResult.urgencyScore}/100</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${urgencyBarColor(triageResult.urgencyScore)}`}
                      style={{ width: `${triageResult.urgencyScore}%` }}
                      role="progressbar"
                      aria-valuenow={triageResult.urgencyScore}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Urgency score: ${triageResult.urgencyScore} out of 100`}
                    />
                  </div>
                </div>

                {/* AI Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-xs text-blue-600 font-semibold mb-1 flex items-center gap-1">
                    <Cpu size={12}/> AI Dispatch Brief
                  </div>
                  <p className="text-sm text-blue-900">{triageResult.aiSummary}</p>
                </div>

                {/* Expandable JSON Drawer */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowJson(!showJson)}
                    className="w-full px-4 py-2.5 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-semibold text-gray-700"
                    aria-expanded={showJson}
                    aria-label="Inspect Gemini Structured JSON and Reasoning"
                  >
                    <span className="flex items-center gap-2">
                      <Eye size={14}/>
                      Inspect Gemini Structured JSON & Reasoning
                    </span>
                    {showJson ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                  </button>
                  {showJson && (
                    <div className="p-4 bg-gray-900 text-xs font-mono text-green-300 overflow-x-auto max-h-64 overflow-y-auto">
                      <pre>{JSON.stringify({ ...triageResult }, null, 2)}</pre>
                    </div>
                  )}
                </div>

                {/* Track button */}
                <button
                  type="button"
                  onClick={onSwitchToTrack}
                  className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                  aria-label="Track this submitted issue"
                >
                  <FileText size={16}/>
                  Track This Issue — {submittedIssue.id}
                </button>
              </div>
            </div>
          )}

          {!isAnalyzing && !triageResult && (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-400">
              <Cpu size={40} className="mx-auto mb-3 text-gray-300"/>
              <p className="font-semibold text-gray-500">AI Triage Result will appear here</p>
              <p className="text-xs mt-2">Fill the form or click a sample scenario, then submit</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
