import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cooking To-Do List AI - Smart Cooking & Meal Planner",
  description: "Create personalized meal plans, interactive cooking timelines, smart grocery lists, and budget estimations based on your available ingredients.",
  keywords: ["cooking planner", "ai recipe generator", "meal todo list", "grocery list maker", "budget meal planning"],
  authors: [{ name: "Cooking To-Do List AI" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
