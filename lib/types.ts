export type Priority = "Critical" | "High" | "Medium" | "Low";
export type IssueStatus = "Reported" | "In Progress" | "Resolved";
export type AnalysisSource = "gemini-live" | "fallback";

export type AiCategory =
  | "Roads & Potholes"
  | "Solid Waste & Sanitation"
  | "Streetlights & Electrical"
  | "Water Supply & Drainage"
  | "Public Parks & Encroachment"
  | "Traffic & Road Safety";

export type DepartmentName =
  | "CCMC – Engineering & Roads Wing"
  | "CCMC – Solid Waste Management & Public Health"
  | "TANGEDCO / CCMC Electrical Maintenance"
  | "TWAD Board / CCMC Water Supply & Sewerage"
  | "CCMC – Town Planning & Parks Department"
  | "Coimbatore City Traffic Police & Highways Wing";

export interface AiTriageResult {
  aiCategory: AiCategory;
  priority: Priority;
  urgencyScore: number;
  recommendedDepartment: DepartmentName;
  estimatedResolutionSla: string;
  aiSummary: string;
  aiReasoning: string;
  analysisSource: AnalysisSource;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  location: string;
  userCategory: string;
  imageBase64?: string;
  imageMimeType?: string;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
  aiTriage?: AiTriageResult;
  adminNote?: string;
}
