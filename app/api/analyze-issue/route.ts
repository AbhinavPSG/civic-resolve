import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

interface AnalyzeRequest {
  title: string;
  description: string;
  location: string;
  userCategory: string;
  imageBase64?: string;
  imageMimeType?: string;
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    aiCategory: {
      type: Type.STRING,
      enum: [
        "Roads & Potholes",
        "Solid Waste & Sanitation",
        "Streetlights & Electrical",
        "Water Supply & Drainage",
        "Public Parks & Encroachment",
        "Traffic & Road Safety",
      ],
    },
    priority: {
      type: Type.STRING,
      enum: ["Critical", "High", "Medium", "Low"],
    },
    urgencyScore: { type: Type.INTEGER },
    recommendedDepartment: {
      type: Type.STRING,
      enum: [
        "CCMC – Engineering & Roads Wing",
        "CCMC – Solid Waste Management & Public Health",
        "TANGEDCO / CCMC Electrical Maintenance",
        "TWAD Board / CCMC Water Supply & Sewerage",
        "CCMC – Town Planning & Parks Department",
        "Coimbatore City Traffic Police & Highways Wing",
      ],
    },
    estimatedResolutionSla: { type: Type.STRING },
    aiSummary: { type: Type.STRING },
    aiReasoning: { type: Type.STRING },
  },
  required: [
    "aiCategory",
    "priority",
    "urgencyScore",
    "recommendedDepartment",
    "estimatedResolutionSla",
    "aiSummary",
    "aiReasoning",
  ],
};

function buildPrompt(body: AnalyzeRequest, hasImage: boolean): string {
  return `You are an AI civic issue triage officer for the Coimbatore City Municipal Corporation (CCMC), Tamil Nadu, India.

Analyze the following civic complaint and return a structured JSON triage assessment:

COMPLAINT DETAILS:
- Title: ${body.title}
- Description: ${body.description}
- Location/Landmark: ${body.location}
- Citizen-Selected Category: ${body.userCategory}
${hasImage ? "- Photo Evidence: Attached (analyze the image for severity assessment)" : ""}

TRIAGE INSTRUCTIONS:
1. aiCategory: Classify into exactly one of the 6 civic categories.
2. priority: Assess urgency - Critical (life-threatening/major infrastructure), High (significant impact), Medium (moderate inconvenience), Low (minor/cosmetic).
3. urgencyScore: 1-100 public impact score. Critical=85-100, High=65-84, Medium=40-64, Low=1-39.
4. recommendedDepartment: Route to the correct Tamil Nadu civic department.
5. estimatedResolutionSla: Realistic SLA - "24 Hours", "48 Hours", "3–5 Business Days", "7–10 Business Days".
6. aiSummary: One concise dispatch brief sentence for field engineers (max 25 words).
7. aiReasoning: Two sentences explaining your priority decision, citing public safety impact, location context${hasImage ? ", and visual photo findings" : ""}.

Respond with valid JSON only.`;
}

function keywordFallback(body: AnalyzeRequest) {
  const text = `${body.title} ${body.description}`.toLowerCase();
  let aiCategory = "Roads & Potholes" as string;
  let recommendedDepartment = "CCMC – Engineering & Roads Wing" as string;
  let priority = "Medium" as string;
  let urgencyScore = 55;
  let estimatedResolutionSla = "3–5 Business Days";

  if (text.includes("pothole") || text.includes("road") || text.includes("bridge") || text.includes("footpath")) {
    aiCategory = "Roads & Potholes";
    recommendedDepartment = "CCMC – Engineering & Roads Wing";
    priority = text.includes("deep") || text.includes("large") || text.includes("danger") ? "High" : "Medium";
    urgencyScore = priority === "High" ? 75 : 55;
    estimatedResolutionSla = priority === "High" ? "48 Hours" : "3–5 Business Days";
  } else if (text.includes("garbage") || text.includes("waste") || text.includes("sanitation") || text.includes("dump") || text.includes("bin")) {
    aiCategory = "Solid Waste & Sanitation";
    recommendedDepartment = "CCMC – Solid Waste Management & Public Health";
    priority = "High";
    urgencyScore = 72;
    estimatedResolutionSla = "48 Hours";
  } else if (text.includes("street") || text.includes("light") || text.includes("lamp") || text.includes("electric") || text.includes("power")) {
    aiCategory = "Streetlights & Electrical";
    recommendedDepartment = "TANGEDCO / CCMC Electrical Maintenance";
    priority = "High";
    urgencyScore = 70;
    estimatedResolutionSla = "48 Hours";
  } else if (text.includes("water") || text.includes("pipe") || text.includes("drain") || text.includes("sewage") || text.includes("flood")) {
    aiCategory = "Water Supply & Drainage";
    recommendedDepartment = "TWAD Board / CCMC Water Supply & Sewerage";
    priority = text.includes("burst") || text.includes("flood") ? "Critical" : "High";
    urgencyScore = priority === "Critical" ? 90 : 75;
    estimatedResolutionSla = priority === "Critical" ? "24 Hours" : "48 Hours";
  } else if (text.includes("park") || text.includes("tree") || text.includes("encroach") || text.includes("garden")) {
    aiCategory = "Public Parks & Encroachment";
    recommendedDepartment = "CCMC – Town Planning & Parks Department";
    priority = "Medium";
    urgencyScore = 50;
    estimatedResolutionSla = "3–5 Business Days";
  } else if (text.includes("traffic") || text.includes("signal") || text.includes("accident") || text.includes("highway")) {
    aiCategory = "Traffic & Road Safety";
    recommendedDepartment = "Coimbatore City Traffic Police & Highways Wing";
    priority = "High";
    urgencyScore = 73;
    estimatedResolutionSla = "48 Hours";
  }

  return {
    aiCategory,
    priority,
    urgencyScore,
    recommendedDepartment,
    estimatedResolutionSla,
    aiSummary: `${aiCategory} issue reported at ${body.location}; routed to ${recommendedDepartment} for field inspection.`,
    aiReasoning: `Based on keyword analysis of the complaint text, this issue has been classified as ${aiCategory} with ${priority} priority. The location at ${body.location} and the nature of the complaint warrant routing to ${recommendedDepartment} for timely resolution.`,
    analysisSource: "fallback" as const,
  };
}

async function callGemini(
  ai: GoogleGenAI,
  model: string,
  body: AnalyzeRequest
): Promise<Record<string, unknown>> {
  const hasImage = !!(body.imageBase64 && body.imageMimeType);
  const prompt = buildPrompt(body, hasImage);

  const contentParts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [
    { text: prompt },
  ];

  if (hasImage) {
    const cleanBase64 = body.imageBase64!.replace(/^data:image\/[a-z]+;base64,/, "");
    contentParts.push({
      inlineData: { data: cleanBase64, mimeType: body.imageMimeType! },
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: "user", parts: contentParts }],
    config: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const text = response.text();
  if (!text) throw new Error("Empty response from Gemini");
  return JSON.parse(text);
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();

    if (!body.title || !body.description || !body.location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        ...keywordFallback(body),
        analysisSource: "fallback",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    let result: Record<string, unknown>;
    try {
      result = await callGemini(ai, "gemini-3.8-flash", body);
    } catch (primaryError) {
      console.warn("Primary model (gemini-3.8-flash) failed, trying fallback model (gemini-3.5-flash-lite):", primaryError);
      try {
        result = await callGemini(ai, "gemini-3.5-flash-lite", body);
      } catch (fallbackError) {
        console.error("Both Gemini models failed, falling back to heuristic:", fallbackError);
        return NextResponse.json({
          ...keywordFallback(body),
          analysisSource: "fallback",
        });
      }
    }

    return NextResponse.json({ ...result, analysisSource: "gemini-live" });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
