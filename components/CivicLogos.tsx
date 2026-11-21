"use client";
import React from "react";

// ─── Tamil Nadu Government Emblem ─────────────────────────────────────────────
export function TamilNaduEmblem({ size = 64 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="flex-shrink-0 rounded-full bg-white p-1 shadow-sm flex items-center justify-center overflow-hidden"
    >
      <img
        src="/logos/tn-govt.svg"
        alt="Government of Tamil Nadu Emblem"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

// ─── CCMC Seal ────────────────────────────────────────────────────────────────
export function CCMCSeal({ size = 64 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="flex-shrink-0 rounded-full bg-white p-1 shadow-sm flex items-center justify-center overflow-hidden"
    >
      <img
        src="/logos/ccmc.jpg"
        alt="Coimbatore City Municipal Corporation Seal"
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  );
}

// ─── Department Badge Component ───────────────────────────────────────────────
export type DeptCode =
  | "CCMC-ENG"
  | "CCMC-SWM"
  | "TANGEDCO"
  | "TWAD-CCMC"
  | "CCMC-TP"
  | "CCTP-HWY";

interface DeptConfig {
  code: DeptCode;
  label: string;
  shortName: string;
  bgColor: string;
  accentColor: string;
  textColor: string;
  logoSrc: string;
}

const DEPT_CONFIG: Record<DeptCode, DeptConfig> = {
  "CCMC-ENG": {
    code: "CCMC-ENG",
    label: "CCMC – Engineering & Roads Wing",
    shortName: "CCMC-ENG",
    bgColor: "bg-blue-900",
    accentColor: "border-amber-500",
    textColor: "text-amber-400",
    logoSrc: "/logos/highways.webp",
  },
  "CCMC-SWM": {
    code: "CCMC-SWM",
    label: "CCMC – Solid Waste Management & Public Health",
    shortName: "CCMC-SWM",
    bgColor: "bg-emerald-700",
    accentColor: "border-teal-400",
    textColor: "text-emerald-100",
    logoSrc: "/logos/ccmc.jpg",
  },
  TANGEDCO: {
    code: "TANGEDCO",
    label: "TANGEDCO / CCMC Electrical Maintenance",
    shortName: "TANGEDCO",
    bgColor: "bg-blue-700",
    accentColor: "border-yellow-400",
    textColor: "text-yellow-300",
    logoSrc: "/logos/tangedco.png",
  },
  "TWAD-CCMC": {
    code: "TWAD-CCMC",
    label: "TWAD Board / CCMC Water Supply & Sewerage",
    shortName: "TWAD-CCMC",
    bgColor: "bg-cyan-700",
    accentColor: "border-blue-800",
    textColor: "text-cyan-100",
    logoSrc: "/logos/water.jpg",
  },
  "CCMC-TP": {
    code: "CCMC-TP",
    label: "CCMC – Town Planning & Parks Department",
    shortName: "CCMC-TP",
    bgColor: "bg-green-800",
    accentColor: "border-slate-500",
    textColor: "text-green-200",
    logoSrc: "/logos/ccmc.jpg",
  },
  "CCTP-HWY": {
    code: "CCTP-HWY",
    label: "Coimbatore City Traffic Police & Highways Wing",
    shortName: "CCTP-HWY",
    bgColor: "bg-indigo-900",
    accentColor: "border-red-600",
    textColor: "text-indigo-200",
    logoSrc: "/logos/police.png",
  },
};

export const DEPT_NAME_TO_CODE: Record<string, DeptCode> = {
  "CCMC – Engineering & Roads Wing": "CCMC-ENG",
  "CCMC – Solid Waste Management & Public Health": "CCMC-SWM",
  "TANGEDCO / CCMC Electrical Maintenance": "TANGEDCO",
  "TWAD Board / CCMC Water Supply & Sewerage": "TWAD-CCMC",
  "CCMC – Town Planning & Parks Department": "CCMC-TP",
  "Coimbatore City Traffic Police & Highways Wing": "CCTP-HWY",
};

interface DepartmentBadgeProps {
  deptName: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function DepartmentBadge({
  deptName,
  size = "md",
  showLabel = true,
}: DepartmentBadgeProps) {
  const code = DEPT_NAME_TO_CODE[deptName] as DeptCode | undefined;
  if (!code) return <span className="text-xs text-gray-400 italic">{deptName}</span>;

  const config = DEPT_CONFIG[code];
  const imgSizes = { sm: 32, md: 48, lg: 64 };
  const imgSize = imgSizes[size];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex-shrink-0 rounded-lg p-1 border-2 bg-white ${config.accentColor} flex items-center justify-center overflow-hidden`}
        style={{ width: imgSize + 8, height: imgSize + 8 }}
        title={config.label}
        aria-label={config.label}
      >
        <img
          src={config.logoSrc}
          alt={config.label}
          className="w-full h-full object-contain"
        />
      </div>
      {showLabel && (
        <div>
          <div className="text-xs font-bold font-mono">
            <span className="inline-block bg-gray-800 text-white text-xs font-mono font-bold px-2 py-0.5 rounded">
              {config.shortName}
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-0.5 max-w-[160px] leading-tight">
            {config.label}
          </div>
        </div>
      )}
    </div>
  );
}

export function DeptFilterPill({
  deptName,
  selected,
  onClick,
}: {
  deptName: string;
  selected: boolean;
  onClick: () => void;
}) {
  const code = DEPT_NAME_TO_CODE[deptName] as DeptCode | undefined;
  if (!code) return null;
  const config = DEPT_CONFIG[code];

  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-semibold transition-all ${
        selected
          ? `${config.bgColor} ${config.accentColor} text-white shadow-md`
          : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
      }`}
    >
      <span className="w-5 h-5 rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0">
        <img
          src={config.logoSrc}
          alt={config.shortName}
          className="w-full h-full object-contain"
        />
      </span>
      {code}
    </button>
  );
}

export { DEPT_CONFIG };
