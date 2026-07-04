import { generateTravelPlan, TravelPlanParams } from '@/lib/services/ai-service'

describe('generateTravelPlan', () => {
  const defaultParams: TravelPlanParams = {
    destination: 'Tokyo',
    budget: 'medium',
    duration: 3,
    travelStyle: 'solo',
    interests: ['Food', 'Culture']
  }

  it('generates a travel plan with correct destination', async () => {
    const plan = await generateTravelPlan(defaultParams)
    expect(plan.destination).toBe('Tokyo')
    expect(plan.itinerary.length).toBe(3)
  })

  it('adjusts estimated budget based on budget param', async () => {
    const lowBudget = await generateTravelPlan({ ...defaultParams, budget: 'low' })
    expect(lowBudget.estimatedBudget).toContain('$50 - $100')

    const highBudget = await generateTravelPlan({ ...defaultParams, budget: 'high' })
    expect(highBudget.estimatedBudget).toContain('$400+')
  })

  it('limits itinerary to 7 days maximum', async () => {
    const longTrip = await generateTravelPlan({ ...defaultParams, duration: 10 })
    expect(longTrip.itinerary.length).toBe(7)
  })

  it('includes interests and travel style in the story', async () => {
    const plan = await generateTravelPlan(defaultParams)
    expect(plan.story).toContain('solo')
    expect(plan.story).toContain('Food and Culture')
  })
})
