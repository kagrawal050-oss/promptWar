import { TravelPlanParams, generateTravelPlan } from "@/lib/services/ai-service"
import { TravelChecklist } from "@/components/plan/checklist"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Utensils, Landmarks, Star, Calendar, Printer, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function PlanPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams
  
  const planParams: TravelPlanParams = {
    destination: Array.isArray(params.destination) ? params.destination[0] : params.destination || "Unknown Destination",
    budget: Array.isArray(params.budget) ? params.budget[0] : params.budget || "medium",
    duration: parseInt(Array.isArray(params.duration) ? params.duration[0] : params.duration || "3", 10),
    travelStyle: Array.isArray(params.travelStyle) ? params.travelStyle[0] : params.travelStyle || "solo",
    interests: Array.isArray(params.interests) ? params.interests : params.interests ? [params.interests] : ["Sightseeing"],
  }

  const plan = await generateTravelPlan(planParams)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-primary">
            {plan.destination}
          </h1>
          <p className="text-muted-foreground text-lg">
            Your personalized {planParams.duration}-day {planParams.budget} budget itinerary.
          </p>
        </div>
        <div className="flex space-x-2 no-print">
          <Button variant="outline" className="print-button bg-background" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print Plan
          </Button>
          <Button className="print-button" onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" />
            Save as PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Story & Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card className="glass overflow-hidden border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                The Story of {plan.destination}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-lg italic text-foreground/80">
                &quot;{plan.story}&quot;
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4 page-break">
            <h2 className="text-2xl font-bold flex items-center mb-6">
              <Calendar className="w-6 h-6 mr-2 text-primary" />
              Your Itinerary
            </h2>
            {plan.itinerary.map((day) => (
              <Card key={day.day} className="mb-4">
                <CardHeader className="py-4 bg-muted/50">
                  <CardTitle className="text-lg">Day {day.day}</CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                  <ul className="space-y-4">
                    {day.activities.map((activity, idx) => (
                      <li key={idx} className="flex gap-4 items-start">
                        <span className="font-semibold w-24 shrink-0 text-primary">{activity.time}</span>
                        <span>{activity.description}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>

        {/* Sidebar: Attractions, Food, Tips, Checklist */}
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Landmarks className="w-4 h-4 mr-2" />
                  Top Attractions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {plan.topAttractions.map((item, idx) => (
                    <li key={idx}><span className="font-semibold">{item.name}:</span> {item.description}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Hidden Gems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {plan.hiddenGems.map((item, idx) => (
                    <li key={idx}><span className="font-semibold">{item.name}:</span> {item.description}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Utensils className="w-4 h-4 mr-2" />
                  Local Foods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {plan.localFoods.map((item, idx) => (
                    <li key={idx}><span className="font-semibold">{item.name}:</span> {item.description}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-primary text-primary-foreground">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Travel Tips & Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold mb-2">Estimated: {plan.estimatedBudget}</p>
                <ul className="list-disc pl-4 space-y-1 text-sm opacity-90">
                  {plan.travelTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="no-print sticky top-24">
            <TravelChecklist />
          </div>

        </div>
      </div>
    </div>
  )
}
