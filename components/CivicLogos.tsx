"use client";
import React from "react";

// ─── Tamil Nadu Government Emblem ─────────────────────────────────────────────
export function TamilNaduEmblem({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="Government of Tamil Nadu Emblem">
      {/* Background circle with tricolor ring */}
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#138808" strokeWidth="3"/>
      <circle cx="50" cy="50" r="45" fill="none" stroke="#FF9933" strokeWidth="2"/>
      <circle cx="50" cy="50" r="42" fill="none" stroke="#000080" strokeWidth="1.5"/>
      {/* Gopuram silhouette */}
      <g fill="#000080">
        <polygon points="50,8 55,20 58,20 60,30 56,30 58,40 42,40 44,30 40,30 42,20 45,20" />
        <rect x="45" y="38" width="10" height="5" />
        <polygon points="50,6 52,9 48,9" fill="#FF9933"/>
        {/* Gopuram tiers */}
        <rect x="47" y="20" width="6" height="2" fill="#FF9933"/>
        <rect x="46" y="25" width="8" height="2" fill="#FF9933"/>
        <rect x="45" y="30" width="10" height="2" fill="#FF9933"/>
      </g>
      {/* Ashoka Lion base (simplified) */}
      <g fill="#8B6914">
        <ellipse cx="50" cy="60" rx="8" ry="5"/>
        <circle cx="44" cy="57" r="4"/>
        <circle cx="56" cy="57" r="4"/>
        <circle cx="50" cy="55" r="3"/>
        {/* Wheel */}
        <circle cx="50" cy="68" r="4" fill="none" stroke="#000080" strokeWidth="1.5"/>
        <line x1="50" y1="64" x2="50" y2="72" stroke="#000080" strokeWidth="1"/>
        <line x1="46" y1="68" x2="54" y2="68" stroke="#000080" strokeWidth="1"/>
        <line x1="47" y1="65" x2="53" y2="71" stroke="#000080" strokeWidth="0.8"/>
        <line x1="53" y1="65" x2="47" y2="71" stroke="#000080" strokeWidth="0.8"/>
      </g>
      {/* Stars */}
      <g fill="#FF9933">
        <polygon points="20,30 21,33 24,33 22,35 23,38 20,36 17,38 18,35 16,33 19,33" transform="scale(0.6) translate(14,20)"/>
        <polygon points="80,30 81,33 84,33 82,35 83,38 80,36 77,38 78,35 76,33 79,33" transform="scale(0.6) translate(-14,20)"/>
      </g>
      {/* Bottom label band */}
      <rect x="10" y="76" width="80" height="16" rx="3" fill="#000080" opacity="0.9"/>
      <text x="50" y="84" textAnchor="middle" fill="#FF9933" fontSize="4.5" fontFamily="serif" fontWeight="bold">TAMIL NADU</text>
      <text x="50" y="89" textAnchor="middle" fill="#fff" fontSize="3.8" fontFamily="sans-serif">தமிழ்நாடு அரசு</text>
    </svg>
  );
}

// ─── CCMC Seal ────────────────────────────────────────────────────────────────
export function CCMCSeal({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="Coimbatore City Municipal Corporation Seal">
      <circle cx="50" cy="50" r="48" fill="#1a3a6b"/>
      <circle cx="50" cy="50" r="44" fill="none" stroke="#c8a000" strokeWidth="2"/>
      <circle cx="50" cy="50" r="40" fill="#1e4080"/>
      {/* City skyline */}
      <g fill="#c8a000">
        <rect x="20" y="52" width="6" height="18"/>
        <rect x="28" y="45" width="8" height="25"/>
        <rect x="38" y="40" width="10" height="30"/>
        <rect x="50" y="35" width="12" height="35"/>
        <rect x="64" y="43" width="8" height="27"/>
        <rect x="74" y="50" width="6" height="20"/>
        {/* Flag on tallest building */}
        <rect x="61" y="30" width="1.5" height="8" fill="#fff"/>
        <polygon points="62.5,30 68,32.5 62.5,35" fill="#FF9933"/>
      </g>
      {/* Ground line */}
      <rect x="10" y="70" width="80" height="2" fill="#c8a000"/>
      {/* Stars */}
      <text x="50" y="22" textAnchor="middle" fill="#FF9933" fontSize="8">★</text>
      {/* Text */}
      <text x="50" y="82" textAnchor="middle" fill="#fff" fontSize="5" fontFamily="sans-serif" fontWeight="bold">CCMC</text>
      <text x="50" y="89" textAnchor="middle" fill="#c8a000" fontSize="3.5" fontFamily="sans-serif">COIMBATORE</text>
    </svg>
  );
}

// ─── Department Badge Component ───────────────────────────────────────────────
export type DeptCode = "CCMC-ENG" | "CCMC-SWM" | "TANGEDCO" | "TWAD-CCMC" | "CCMC-TP" | "CCTP-HWY";

interface DeptConfig {
  code: DeptCode;
  label: string;
  shortName: string;
  bgColor: string;
  accentColor: string;
  textColor: string;
  svg: React.ReactNode;
}

function RoadsShield() {
  return (
    <g>
      <polygon points="50,10 80,25 80,65 50,85 20,65 20,25" fill="#1a3a6b" stroke="#D97706" strokeWidth="3"/>
      {/* Road */}
      <line x1="50" y1="30" x2="50" y2="75" stroke="#D97706" strokeWidth="4" strokeDasharray="5,4"/>
      <line x1="30" y1="55" x2="70" y2="55" stroke="#D97706" strokeWidth="3"/>
      {/* Gear */}
      <circle cx="50" cy="45" r="10" fill="none" stroke="#fff" strokeWidth="3"/>
      <circle cx="50" cy="45" r="4" fill="#fff"/>
      {[0,45,90,135,180,225,270,315].map((a,i) => (
        <rect key={i} x="48" y="31" width="4" height="6" fill="#fff"
          transform={`rotate(${a},50,45)`}/>
      ))}
      <text x="50" y="80" textAnchor="middle" fill="#D97706" fontSize="8" fontWeight="bold" fontFamily="sans-serif">ENG</text>
    </g>
  );
}

function SWMSeal() {
  return (
    <g>
      <circle cx="50" cy="50" r="40" fill="#059669" stroke="#0d9488" strokeWidth="3"/>
      <circle cx="50" cy="50" r="34" fill="none" stroke="#d1fae5" strokeWidth="1.5"/>
      {/* Leaf */}
      <path d="M50,20 C65,30 70,50 50,65 C30,50 35,30 50,20Z" fill="#d1fae5" opacity="0.9"/>
      <line x1="50" y1="20" x2="50" y2="65" stroke="#059669" strokeWidth="2"/>
      {/* Bin */}
      <rect x="38" y="52" width="24" height="18" rx="2" fill="#fff" opacity="0.9"/>
      <rect x="36" y="50" width="28" height="4" rx="1" fill="#0d9488"/>
      <line x1="44" y1="54" x2="44" y2="68" stroke="#0d9488" strokeWidth="1.5"/>
      <line x1="50" y1="54" x2="50" y2="68" stroke="#0d9488" strokeWidth="1.5"/>
      <line x1="56" y1="54" x2="56" y2="68" stroke="#0d9488" strokeWidth="1.5"/>
      <text x="50" y="82" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold" fontFamily="sans-serif">SWM</text>
    </g>
  );
}

function TangedcoCrest() {
  return (
    <g>
      <rect x="10" y="10" width="80" height="80" rx="8" fill="#1d4ed8" stroke="#c8a000" strokeWidth="3"/>
      {/* Lightning bolt */}
      <polygon points="58,15 42,50 52,50 42,85 68,45 55,45" fill="#c8a000"/>
      {/* Streetlight */}
      <line x1="25" y1="75" x2="25" y2="30" stroke="#fff" strokeWidth="3"/>
      <path d="M25,30 Q35,25 40,32" fill="none" stroke="#fff" strokeWidth="2.5"/>
      <circle cx="41" cy="34" r="4" fill="#FFD700"/>
      <text x="50" y="93" textAnchor="middle" fill="#c8a000" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">TNEB</text>
    </g>
  );
}

function TwadCrest() {
  return (
    <g>
      <ellipse cx="50" cy="50" rx="40" ry="40" fill="#0891b2" stroke="#1e40af" strokeWidth="3"/>
      {/* Water waves */}
      <path d="M15,50 Q25,40 35,50 Q45,60 55,50 Q65,40 75,50 Q80,55 85,50" fill="none" stroke="#fff" strokeWidth="3"/>
      <path d="M15,58 Q25,48 35,58 Q45,68 55,58 Q65,48 75,58 Q80,63 85,58" fill="none" stroke="#bae6fd" strokeWidth="2"/>
      {/* Pipeline */}
      <rect x="20" y="30" width="60" height="10" rx="5" fill="#1e40af" stroke="#fff" strokeWidth="1.5"/>
      <circle cx="35" cy="35" r="4" fill="#fff"/>
      <circle cx="50" cy="35" r="4" fill="#fff"/>
      <circle cx="65" cy="35" r="4" fill="#fff"/>
      {/* Drop */}
      <path d="M50,15 Q55,22 55,27 Q55,33 50,33 Q45,33 45,27 Q45,22 50,15Z" fill="#bae6fd"/>
      <text x="50" y="80" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold" fontFamily="sans-serif">TWAD</text>
    </g>
  );
}

function ParksCrest() {
  return (
    <g>
      <rect x="10" y="10" width="80" height="80" rx="6" fill="#166534" stroke="#64748b" strokeWidth="3"/>
      {/* Tree */}
      <polygon points="50,15 65,38 55,38 68,55 55,55 68,70 32,70 45,55 32,55 45,38 35,38" fill="#4ade80"/>
      <rect x="46" y="68" width="8" height="12" fill="#92400e"/>
      {/* Blueprint grid */}
      <line x1="15" y1="80" x2="85" y2="80" stroke="#94a3b8" strokeWidth="1" opacity="0.6"/>
      <line x1="15" y1="85" x2="85" y2="85" stroke="#94a3b8" strokeWidth="1" opacity="0.4"/>
      <text x="50" y="93" textAnchor="middle" fill="#86efac" fontSize="6" fontWeight="bold" fontFamily="sans-serif">PARKS</text>
    </g>
  );
}

function TrafficShield() {
  return (
    <g>
      <polygon points="50,8 85,25 85,70 50,92 15,70 15,25" fill="#312e81" stroke="#dc2626" strokeWidth="3"/>
      {/* Traffic signal */}
      <rect x="40" y="25" width="20" height="45" rx="3" fill="#1f2937"/>
      <circle cx="50" cy="33" r="6" fill="#ef4444"/>
      <circle cx="50" cy="47" r="6" fill="#f59e0b"/>
      <circle cx="50" cy="61" r="6" fill="#22c55e"/>
      {/* Chevron */}
      <polyline points="30,78 50,68 70,78" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round"/>
      <text x="50" y="88" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold" fontFamily="sans-serif">CCTP</text>
    </g>
  );
}

const DEPT_CONFIG: Record<DeptCode, DeptConfig> = {
  "CCMC-ENG": {
    code: "CCMC-ENG", label: "CCMC – Engineering & Roads Wing", shortName: "CCMC-ENG",
    bgColor: "bg-blue-900", accentColor: "border-amber-500", textColor: "text-amber-400",
    svg: <RoadsShield/>,
  },
  "CCMC-SWM": {
    code: "CCMC-SWM", label: "CCMC – Solid Waste Management & Public Health", shortName: "CCMC-SWM",
    bgColor: "bg-emerald-700", accentColor: "border-teal-400", textColor: "text-emerald-100",
    svg: <SWMSeal/>,
  },
  "TANGEDCO": {
    code: "TANGEDCO", label: "TANGEDCO / CCMC Electrical Maintenance", shortName: "TANGEDCO",
    bgColor: "bg-blue-700", accentColor: "border-yellow-400", textColor: "text-yellow-300",
    svg: <TangedcoCrest/>,
  },
  "TWAD-CCMC": {
    code: "TWAD-CCMC", label: "TWAD Board / CCMC Water Supply & Sewerage", shortName: "TWAD-CCMC",
    bgColor: "bg-cyan-700", accentColor: "border-blue-800", textColor: "text-cyan-100",
    svg: <TwadCrest/>,
  },
  "CCMC-TP": {
    code: "CCMC-TP", label: "CCMC – Town Planning & Parks Department", shortName: "CCMC-TP",
    bgColor: "bg-green-800", accentColor: "border-slate-500", textColor: "text-green-200",
    svg: <ParksCrest/>,
  },
  "CCTP-HWY": {
    code: "CCTP-HWY", label: "Coimbatore City Traffic Police & Highways Wing", shortName: "CCTP-HWY",
    bgColor: "bg-indigo-900", accentColor: "border-red-600", textColor: "text-indigo-200",
    svg: <TrafficShield/>,
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

export function DepartmentBadge({ deptName, size = "md", showLabel = true }: DepartmentBadgeProps) {
  const code = DEPT_NAME_TO_CODE[deptName] as DeptCode | undefined;
  if (!code) return <span className="text-xs text-gray-400 italic">{deptName}</span>;

  const config = DEPT_CONFIG[code];
  const svgSizes = { sm: 32, md: 48, lg: 64 };
  const svgSize = svgSizes[size];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex-shrink-0 rounded-lg p-1 border-2 ${config.bgColor} ${config.accentColor}`}
        style={{ width: svgSize + 8, height: svgSize + 8 }}
        title={config.label}
        aria-label={config.label}
      >
        <svg width={svgSize} height={svgSize} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {config.svg}
        </svg>
      </div>
      {showLabel && (
        <div>
          <div className={`text-xs font-bold font-mono ${config.textColor} bg-opacity-10`}
            style={{ color: undefined }}
          >
            <span className="inline-block bg-gray-800 text-white text-xs font-mono font-bold px-2 py-0.5 rounded">
              {config.shortName}
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-0.5 max-w-[160px] leading-tight">{config.label}</div>
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
  const svgSize = 20;

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
      <svg width={svgSize} height={svgSize} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {config.svg}
      </svg>
      {code}
    </button>
  );
}

export { DEPT_CONFIG };
