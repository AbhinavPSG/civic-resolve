import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CivicResolve – CCMC Unified Civic Grievance Redressal Portal",
  description:
    "AI-powered civic issue reporting and municipal resolution system for Coimbatore City. Powered by Gemini AI — PromptWars x GDG on Campus PSG iTech Hackathon.",
  keywords: ["civic", "CCMC", "Coimbatore", "Tamil Nadu", "municipal", "Gemini AI", "pothole", "grievance"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
