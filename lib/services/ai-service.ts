export interface TravelPlanParams {
  destination: string
  budget: string
  duration: number
  travelStyle: string
  interests: string[]
}

export interface TravelPlanResponse {
  destination: string
  topAttractions: { name: string; description: string }[]
  hiddenGems: { name: string; description: string }[]
  localFoods: { name: string; description: string }[]
  culturalExperiences: { name: string; description: string }[]
  festivals: { name: string; description: string }[]
  itinerary: { day: number; activities: { time: string; description: string }[] }[]
  travelTips: string[]
  estimatedBudget: string
  story: string
}

export async function generateTravelPlan(params: TravelPlanParams): Promise<TravelPlanResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { destination, budget, duration, interests, travelStyle } = params;

  // Mock response builder based on input
  return {
    destination: destination || "Unknown Destination",
    topAttractions: [
      { name: "Central Plaza", description: "The historic heart of the city." },
      { name: "National Museum", description: "Learn about the rich history and culture." },
      { name: "City Viewpoint", description: "Panoramic views of the skyline." }
    ],
    hiddenGems: [
      { name: "Old Quarter Alley", description: "A quiet street filled with local artisans." },
      { name: "Secret Garden Café", description: "Tucked away behind the main street, perfect for relaxing." }
    ],
    localFoods: [
      { name: "Street Market Dumplings", description: "A local favorite for a quick bite." },
      { name: "Traditional Roast", description: "A hearty meal often shared with family." }
    ],
    culturalExperiences: [
      { name: "Local Cooking Class", description: "Learn to cook authentic dishes." },
      { name: "Traditional Tea Ceremony", description: "Experience a mindful and historic practice." }
    ],
    festivals: [
      { name: "Summer Solstice Festival", description: "A vibrant celebration with music and dance." }
    ],
    itinerary: Array.from({ length: Math.min(duration, 7) }).map((_, i) => ({
      day: i + 1,
      activities: [
        { time: "Morning", description: `Explore the ${interests[0] || 'local'} spots.` },
        { time: "Afternoon", description: "Enjoy a relaxing lunch and visit the main attractions." },
        { time: "Evening", description: `Dinner and experiencing the ${travelStyle} nightlife.` }
      ]
    })),
    travelTips: [
      "Carry some cash as small vendors might not accept cards.",
      "Public transport is the best way to get around.",
      "Always greet locals with a smile and a simple 'hello' in their language."
    ],
    estimatedBudget: budget === "low" ? "$50 - $100 per day" : budget === "medium" ? "$150 - $300 per day" : "$400+ per day",
    story: `Welcome to ${destination}, a place where history and modernity blend seamlessly. Legend has it that the city was founded centuries ago by travelers who were captivated by its natural beauty. As you walk through its vibrant streets, you can still feel the echoes of ancient traditions alive in the smiles of the locals. Whether you're traveling as a ${travelStyle} or seeking new ${interests.join(' and ')} experiences, ${destination} promises an unforgettable adventure filled with breathtaking sights, delicious flavors, and stories waiting to be discovered.`
  }
}
