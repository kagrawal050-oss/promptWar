import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Map, Compass, Camera, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 md:py-24 lg:py-32 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-70 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-70" />

      <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm text-primary mb-4 border border-primary/20">
            <Sparkles className="w-4 h-4 inline-block mr-2" />
            AI-Powered Travel Recommendations
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400 pb-2">
            Discover Your Next Destination
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground md:px-12">
            Let our intelligent engine craft the perfect itinerary tailored to your budget, travel style, and unique interests. Explore the world like never before.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/planner" className={cn(buttonVariants({ size: "lg" }), "rounded-full shadow-lg group")}>
            Get Started
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="container px-4 md:px-6 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-6 rounded-2xl flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-shadow cursor-default">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Map className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Smart Itineraries</h3>
            <p className="text-muted-foreground text-sm">
              Custom-built travel plans based on your exact preferences, from food to history.
            </p>
          </div>
          <div className="glass p-6 rounded-2xl flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-shadow cursor-default">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Compass className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Hidden Gems</h3>
            <p className="text-muted-foreground text-sm">
              Discover off-the-beaten-path locations and authentic local experiences.
            </p>
          </div>
          <div className="glass p-6 rounded-2xl flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-shadow cursor-default">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Beautiful Memories</h3>
            <p className="text-muted-foreground text-sm">
              Immerse yourself in rich culture and captivating stories about your destination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
