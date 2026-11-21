import { CivicIssue } from "./types";

export const SEED_ISSUES: CivicIssue[] = [
  {
    id: "CR-2026-1001",
    title: "Deep waterlogged pothole near Neelambur – Avinashi Road bypass",
    description: "A severely waterlogged pothole approximately 2 feet deep has formed at the Neelambur flyover junction on the Avinashi Road bypass. Multiple two-wheelers have already skidded. Requires urgent barricading and cold-mix patching.",
    location: "Avinashi Road, Neelambur",
    userCategory: "Roads & Potholes",
    status: "In Progress",
    createdAt: "2026-11-18T08:30:00.000Z",
    updatedAt: "2026-11-19T14:00:00.000Z",
    adminNote: "CCMC East Zone road crew barricaded crater; cold-mix resurfacing scheduled tonight.",
    aiTriage: {
      aiCategory: "Roads & Potholes",
      priority: "Critical",
      urgencyScore: 92,
      recommendedDepartment: "CCMC – Engineering & Roads Wing",
      estimatedResolutionSla: "24 Hours",
      aiSummary: "Critical pothole on high-traffic bypass creating imminent safety hazard for two-wheelers; immediate barricading and cold-mix repair required.",
      aiReasoning: "The Avinashi Road bypass carries heavy daily commuter and freight traffic. A 2-foot deep waterlogged crater poses life-threatening risks to two-wheeler riders and pedestrians, warranting Critical priority and 24-hour emergency response from CCMC Engineering.",
      analysisSource: "gemini-live",
    },
  },
  {
    id: "CR-2026-1002",
    title: "Overflowing garbage bin blocking pedestrian footpath at Peelamedu",
    description: "The municipal garbage bin at the Peelamedu Bus Stop junction has been overflowing for 3 consecutive days. Rotting waste is spilling onto the footpath, creating an unhygienic and foul-smelling public health hazard for daily commuters.",
    location: "Peelamedu Bus Stop",
    userCategory: "Solid Waste & Sanitation",
    status: "Reported",
    createdAt: "2026-11-19T10:15:00.000Z",
    updatedAt: "2026-11-19T10:15:00.000Z",
    aiTriage: {
      aiCategory: "Solid Waste & Sanitation",
      priority: "High",
      urgencyScore: 81,
      recommendedDepartment: "CCMC – Solid Waste Management & Public Health",
      estimatedResolutionSla: "48 Hours",
      aiSummary: "Overflowing bin at busy bus stop creating public health hazard; SWM crew collection and deep sanitisation required within 48 hours.",
      aiReasoning: "Peelamedu Bus Stop sees thousands of commuters daily. Persistent overflow for 3+ days with rotting organic waste constitutes a High-priority public health risk requiring urgent SWM clearance and disinfection.",
      analysisSource: "gemini-live",
    },
  },
  {
    id: "CR-2026-1003",
    title: "Three consecutive non-functional streetlights near Chinniampalayam junction",
    description: "Three streetlights in a row on the main road approaching the Chinniampalayam junction have been dark for over a week. The 200-metre stretch is completely unlit after 8 PM, causing road safety hazards especially for night-shift workers.",
    location: "Chinniampalayam",
    userCategory: "Streetlights & Electrical",
    status: "Reported",
    createdAt: "2026-11-19T19:45:00.000Z",
    updatedAt: "2026-11-19T19:45:00.000Z",
    aiTriage: {
      aiCategory: "Streetlights & Electrical",
      priority: "High",
      urgencyScore: 78,
      recommendedDepartment: "TANGEDCO / CCMC Electrical Maintenance",
      estimatedResolutionSla: "48 Hours",
      aiSummary: "200m unlit stretch at Chinniampalayam junction; TANGEDCO electrical crew required for lamp/driver replacement within 48 hours.",
      aiReasoning: "A 200-metre unlit corridor on a junction road creates accident risk for night-time commuters and pedestrians. The extended 7+ day outage across 3 consecutive poles suggests a feeder-line or MCB fault requiring TANGEDCO intervention.",
      analysisSource: "gemini-live",
    },
  },
  {
    id: "CR-2026-1004",
    title: "Burst underground drinking water pipeline causing road flooding in Saravanampatti",
    description: "A major underground drinking water pipeline has burst near the Saravanampatti IT corridor junction. Clean water is gushing onto the road causing significant flooding, traffic disruption, and water wastage. The area smells of chlorine indicating the main supply line is affected.",
    location: "Saravanampatti Junction",
    userCategory: "Water Supply & Drainage",
    status: "In Progress",
    createdAt: "2026-11-20T06:00:00.000Z",
    updatedAt: "2026-11-20T11:30:00.000Z",
    adminNote: "TWAD valve isolation unit on site; main pipeline joint replacement underway.",
    aiTriage: {
      aiCategory: "Water Supply & Drainage",
      priority: "Critical",
      urgencyScore: 95,
      recommendedDepartment: "TWAD Board / CCMC Water Supply & Sewerage",
      estimatedResolutionSla: "24 Hours",
      aiSummary: "Critical main water pipeline burst in Saravanampatti IT corridor; TWAD emergency valve isolation and joint replacement dispatched.",
      aiReasoning: "A burst main supply line in the Saravanampatti IT corridor affects thousands of residents and businesses while causing severe road flooding and massive potable water wastage. Critical priority with 24-hour emergency TWAD response is mandatory.",
      analysisSource: "gemini-live",
    },
  },
  {
    id: "CR-2026-1005",
    title: "Damaged storm-water drain grate near Hopes College signal",
    description: "The storm-water drain grate near Hopes College traffic signal has been broken and partially displaced. The exposed drain cavity is a tripping hazard for pedestrians and could cause vehicle tyre damage.",
    location: "Hopes College, Coimbatore",
    userCategory: "Water Supply & Drainage",
    status: "Resolved",
    createdAt: "2026-11-15T09:00:00.000Z",
    updatedAt: "2026-11-17T16:00:00.000Z",
    adminNote: "Heavy-duty ductile iron grating installed and inspected.",
    aiTriage: {
      aiCategory: "Water Supply & Drainage",
      priority: "Medium",
      urgencyScore: 58,
      recommendedDepartment: "TWAD Board / CCMC Water Supply & Sewerage",
      estimatedResolutionSla: "3–5 Business Days",
      aiSummary: "Damaged storm drain grate at Hopes College signal; TWAD civil team to install heavy-duty replacement grating.",
      aiReasoning: "An exposed drain cavity near a busy traffic signal creates a pedestrian tripping hazard and potential tyre damage risk. While not immediately life-threatening, medium priority ensures timely replacement before monsoon rains exacerbate the hazard.",
      analysisSource: "gemini-live",
    },
  },
];

export const DEPARTMENTS = [
  "CCMC – Engineering & Roads Wing",
  "CCMC – Solid Waste Management & Public Health",
  "TANGEDCO / CCMC Electrical Maintenance",
  "TWAD Board / CCMC Water Supply & Sewerage",
  "CCMC – Town Planning & Parks Department",
  "Coimbatore City Traffic Police & Highways Wing",
] as const;

export const AI_CATEGORIES = [
  "Roads & Potholes",
  "Solid Waste & Sanitation",
  "Streetlights & Electrical",
  "Water Supply & Drainage",
  "Public Parks & Encroachment",
  "Traffic & Road Safety",
] as const;

export const PRIORITY_COLORS: Record<string, string> = {
  Critical: "bg-red-100 text-red-800 border-red-300",
  High: "bg-orange-100 text-orange-800 border-orange-300",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Low: "bg-green-100 text-green-800 border-green-300",
};

export const STATUS_COLORS: Record<string, string> = {
  Reported: "bg-blue-100 text-blue-800 border-blue-300",
  "In Progress": "bg-purple-100 text-purple-800 border-purple-300",
  Resolved: "bg-green-100 text-green-800 border-green-300",
};

export const DEPT_TO_CATEGORY: Record<string, string> = {
  "CCMC – Engineering & Roads Wing": "Roads & Potholes",
  "CCMC – Solid Waste Management & Public Health": "Solid Waste & Sanitation",
  "TANGEDCO / CCMC Electrical Maintenance": "Streetlights & Electrical",
  "TWAD Board / CCMC Water Supply & Sewerage": "Water Supply & Drainage",
  "CCMC – Town Planning & Parks Department": "Public Parks & Encroachment",
  "Coimbatore City Traffic Police & Highways Wing": "Traffic & Road Safety",
};
