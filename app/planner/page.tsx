import { TravelForm } from "@/components/planner/travel-form";

export default function PlannerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Plan Your Adventure</h1>
        <p className="text-muted-foreground">
          Tell us about your dream trip, and our AI will curate the perfect itinerary.
        </p>
      </div>
      
      <TravelForm />
    </div>
  );
}
