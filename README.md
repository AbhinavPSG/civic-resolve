# CivicResolve 🏛️

**AI-Powered Civic Issue Reporting System**

> Built for **PromptWars x GDG on Campus PSG iTech Hackathon**

CivicResolve is a Next.js 15 web application that empowers citizens of Coimbatore to report civic issues and receive instant AI-powered triage using Google Gemini. Issues are automatically categorized, prioritized, and routed to the correct municipal department — turning citizen complaints into actionable work orders.

---

## ✨ Features

1. **📸 AI-Powered Issue Triage** — Submit a civic complaint with an optional photo; Google Gemini (gemini-2.0-flash) analyzes the text and image to classify the issue, assign priority, and estimate resolution time.

2. **🗂️ Smart Department Routing** — Each issue is automatically routed to the appropriate CCMC department (Roads, Sanitation, Electrical, Water, Parks, or Traffic) based on AI analysis.

3. **🔴 Urgency Scoring** — Every report receives a 0–100 urgency score so administrators can triage their queue at a glance.

4. **📋 Issue Dashboard** — A live dashboard lists all submitted issues with status badges (Reported / In Progress / Resolved), AI category chips, priority labels, and department assignments.

5. **🖼️ Image Upload & Vision Analysis** — Citizens can attach a photo of the problem; Gemini's vision capability reads the image to enrich the AI summary and reasoning.

6. **⚡ Graceful Keyword Fallback** — When no Gemini API key is configured (or the API is unreachable), the system falls back to a deterministic keyword-matching engine so the app remains fully functional offline or in demo mode.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| AI / LLM | Google Gemini API (`@google/genai`) |
| Deployment | Vercel |
| State | React `useState` / `useEffect` (no external store) |

### Custom Tailwind Colours

| Token | Hex | Usage |
|---|---|---|
| `tn-saffron` | `#FF9933` | Tamil Nadu flag saffron accent |
| `tn-green` | `#138808` | Tamil Nadu flag green accent |
| `tn-navy` | `#000080` | Tamil Nadu flag navy |
| `ccmc-blue` | `#1a3a6b` | CCMC primary brand blue |
| `ccmc-gold` | `#c8a000` | CCMC gold accent |

---

## 🚀 Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/civic-resolve.git
cd civic-resolve

# 2. Add your Gemini API key
cp .env.example .env.local
# Edit .env.local and set:
# GEMINI_API_KEY=your_google_ai_studio_api_key_here

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Tip:** Get a free Gemini API key at [Google AI Studio](https://aistudio.google.com/). Without a key the app works in keyword-fallback mode.

---

## ☁️ Vercel Deployment

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New → Project**.
3. Import the GitHub repository.
4. In **Environment Variables**, add:
   - `GEMINI_API_KEY` = `<your key>`
5. Click **Deploy**. Vercel auto-detects Next.js and uses the settings in `vercel.json`.

---

## 📡 API Documentation

### `POST /api/analyze-issue`

Analyzes a civic issue report with Google Gemini and returns a structured triage result.

#### Request Body

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "location": "string (required)",
  "userCategory": "string (optional)",
  "imageBase64": "string (optional, base64-encoded image)",
  "imageMimeType": "string (optional, e.g. image/jpeg)"
}
```

#### Success Response `200 OK`

```json
{
  "aiCategory": "Roads & Potholes",
  "priority": "Critical",
  "urgencyScore": 92,
  "recommendedDepartment": "CCMC – Engineering & Roads Wing",
  "estimatedResolutionSla": "24 Hours",
  "aiSummary": "Large pothole on Avinashi Road causing vehicle damage and traffic hazard.",
  "aiReasoning": "The image confirms a deep pothole spanning both lanes. High traffic volume and risk of accidents justify Critical priority.",
  "analysisSource": "gemini-live"
}
```

| Field | Type | Description |
|---|---|---|
| `aiCategory` | string | One of 6 civic categories |
| `priority` | `Critical` \| `High` \| `Medium` \| `Low` | Assigned priority level |
| `urgencyScore` | number (0–100) | Composite urgency score |
| `recommendedDepartment` | string | CCMC / TANGEDCO / TWAD department |
| `estimatedResolutionSla` | string | Human-readable SLA estimate |
| `aiSummary` | string | One-sentence AI-generated summary |
| `aiReasoning` | string | Detailed AI reasoning |
| `analysisSource` | `gemini-live` \| `fallback` | Whether Gemini or keyword engine was used |

#### Error Response `400 Bad Request`

```json
{ "error": "Missing required fields" }
```

#### Error Response `500 Internal Server Error`

```json
{ "error": "Internal server error" }
```

---

## 📂 Project Structure

```
civic-resolve/
├── app/
│   ├── api/
│   │   └── analyze-issue/
│   │       └── route.ts          # Gemini AI triage endpoint
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Main page (issue submission + dashboard)
│   └── globals.css               # Tailwind base styles
├── components/
│   ├── IssueForm.tsx             # Citizen issue submission form
│   ├── IssueCard.tsx             # Dashboard issue card component
│   └── StatusBadge.tsx           # Coloured status/priority badge
├── lib/
│   ├── types.ts                  # TypeScript type definitions
│   └── data.ts                   # Seed issues for demo mode
├── .env.example                  # Environment variable template
├── .gitignore
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
└── README.md
```

---

## 🏆 Hackathon Context

**PromptWars x GDG on Campus PSG iTech** challenged participants to build AI-first civic-tech solutions for Tier-2 Indian cities. CivicResolve targets Coimbatore Corporation (CCMC) and demonstrates how a Gemini-powered triage layer can dramatically reduce the time from citizen complaint to department action.

---

## 📄 License

MIT © 2026 CivicResolve Team
