"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const defaultChecklist = {
  documents: [
    { id: "passport", label: "Passport / ID" },
    { id: "tickets", label: "Flight / Train Tickets" },
    { id: "insurance", label: "Travel Insurance" },
    { id: "visa", label: "Visa (if required)" },
  ],
  clothes: [
    { id: "shirts", label: "Tops & Shirts" },
    { id: "pants", label: "Pants & Shorts" },
    { id: "underwear", label: "Underwear & Socks" },
    { id: "jacket", label: "Jacket / Sweater" },
    { id: "shoes", label: "Comfortable Shoes" },
  ],
  medicines: [
    { id: "prescriptions", label: "Prescription Meds" },
    { id: "painkillers", label: "Pain Relievers" },
    { id: "bandaids", label: "First Aid & Band-Aids" },
  ],
  essentials: [
    { id: "charger", label: "Phone Charger / Power Bank" },
    { id: "adapter", label: "Travel Adapter" },
    { id: "toiletries", label: "Toiletries" },
    { id: "waterbottle", label: "Reusable Water Bottle" },
  ]
}

export function TravelChecklist() {
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({})
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem("culture-compass-checklist")
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCheckedItems(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse checklist from local storage", e)
      }
    }
    setIsLoaded(true)
  }, [])

  const handleCheck = (id: string, checked: boolean) => {
    const newChecked = { ...checkedItems, [id]: checked }
    setCheckedItems(newChecked)
    localStorage.setItem("culture-compass-checklist", JSON.stringify(newChecked))
  }

  if (!isLoaded) return null // Prevent hydration mismatch

  return (
    <Card className="glass h-full">
      <CardHeader>
        <CardTitle>Travel Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(defaultChecklist).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary capitalize">
              {category}
            </h4>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`check-${item.id}`} 
                    checked={checkedItems[item.id] || false}
                    onCheckedChange={(checked) => handleCheck(item.id, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`check-${item.id}`}
                    className={`text-sm cursor-pointer ${checkedItems[item.id] ? "line-through text-muted-foreground" : ""}`}
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
