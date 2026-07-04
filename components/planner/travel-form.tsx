"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const travelFormSchema = z.object({
  destination: z.string().min(2, "Destination must be at least 2 characters."),
  budget: z.enum(["low", "medium", "high"]),
  duration: z.number().min(1, "Duration must be at least 1 day.").max(30, "Duration must be at most 30 days."),
  travelStyle: z.enum(["solo", "family", "friends", "couple"]),
  interests: z.array(z.string()).min(1, "Select at least one interest."),
})

type TravelFormValues = z.infer<typeof travelFormSchema>

const interestsList = [
  "Food",
  "History",
  "Nature",
  "Adventure",
  "Shopping",
  "Photography",
  "Culture"
]

export function TravelForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<TravelFormValues>({
    resolver: zodResolver(travelFormSchema),
    defaultValues: {
      budget: "medium",
      duration: 3,
      travelStyle: "couple",
      interests: [],
    },
  })

  const watchInterests = useWatch({
    control,
    name: "interests",
  })

  const onSubmit = async (data: TravelFormValues) => {
    setIsLoading(true)
    try {
      // Encode form data into URL parameters for the plan page
      const searchParams = new URLSearchParams()
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v))
        } else {
          searchParams.append(key, String(value))
        }
      })
      
      // Simulate API delay for a better UX
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      router.push(`/plan?${searchParams.toString()}`)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleInterest = (interest: string) => {
    const current = watchInterests || []
    if (current.includes(interest)) {
      setValue("interests", current.filter(i => i !== interest), { shouldValidate: true })
    } else {
      setValue("interests", [...current, interest], { shouldValidate: true })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="glass">
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
          <CardDescription>Fill out the form below to get started.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination (City/Country)</Label>
            <Input 
              id="destination" 
              placeholder="e.g., Tokyo, Japan" 
              {...register("destination")} 
              disabled={isLoading}
            />
            {errors.destination && <p className="text-sm text-red-500">{errors.destination.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Days)</Label>
              <Input 
                id="duration" 
                type="number" 
                min={1} 
                max={30}
                {...register("duration", { valueAsNumber: true })} 
                disabled={isLoading}
              />
              {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Level</Label>
              <select 
                id="budget"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("budget")}
                disabled={isLoading}
              >
                <option value="low">Budget / Backpacker</option>
                <option value="medium">Standard / Moderate</option>
                <option value="high">Luxury / Premium</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelStyle">Travel Style</Label>
            <select 
              id="travelStyle"
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("travelStyle")}
              disabled={isLoading}
            >
              <option value="solo">Solo</option>
              <option value="couple">Couple</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
            </select>
          </div>

          <div className="space-y-3">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2">
              {interestsList.map((interest) => {
                const isSelected = watchInterests?.includes(interest)
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background hover:bg-accent border-border text-foreground'
                    }`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>
            {errors.interests && <p className="text-sm text-red-500">{errors.interests.message}</p>}
          </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Itinerary
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
