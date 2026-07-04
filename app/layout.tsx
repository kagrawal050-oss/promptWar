import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Compass } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Culture Compass | GenAI Travel Guide",
  description: "Discover your next destination with AI-powered travel plans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="no-print sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Compass className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight text-foreground">Culture Compass</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/planner" className="transition-colors hover:text-primary text-muted-foreground">
                Plan a Trip
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="no-print border-t py-6 md:py-0">
          <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by Culture Compass Team. Powered by Mock AI.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
