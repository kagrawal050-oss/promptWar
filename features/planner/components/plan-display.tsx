'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, ChevronDown, ChevronUp, Check, Award } from 'lucide-react';
import { Recipe } from '@/types';

interface PlanDisplayProps {
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
  currencySymbol: string;
}

export default function PlanDisplay({ breakfast, lunch, dinner, currencySymbol }: PlanDisplayProps) {
  const [activeMeal, setActiveMeal] = useState<'Breakfast' | 'Lunch' | 'Dinner'>('Breakfast');

  const meals = {
    Breakfast: breakfast,
    Lunch: lunch,
    Dinner: dinner
  };

  const currentRecipe = meals[activeMeal];

  return (
    <div className="space-y-6">
      {/* Meal Selection Tabs */}
      <div className="flex bg-muted/40 p-1.5 rounded-xl border border-border">
        {(['Breakfast', 'Lunch', 'Dinner'] as const).map(meal => (
          <button
            key={meal}
            onClick={() => setActiveMeal(meal)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
              activeMeal === meal
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${
              meal === 'Breakfast' ? 'bg-amber-400' : meal === 'Lunch' ? 'bg-orange-500' : 'bg-indigo-600'
            }`} />
            {meal}
          </button>
        ))}
      </div>

      {/* Selected Recipe Detail Card */}
      <motion.div
        key={activeMeal}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card text-card-foreground border border-border rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Card Header Banner */}
        <div className="bg-muted/30 p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                {currentRecipe.cuisine} Cuisine
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                Est. Cost: {currencySymbol}{(currentRecipe.estimatedCostPerPortion).toFixed(2)}/portion
              </span>
            </div>
            <h3 className="text-2xl font-bold text-foreground leading-tight">{currentRecipe.name}</h3>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-background border border-border px-3.5 py-2 rounded-xl text-sm font-medium">
              <Clock className="w-4 h-4 text-primary" />
              <span>{currentRecipe.cookingTime} Mins</span>
            </div>
            <div className="flex items-center gap-1.5 bg-background border border-border px-3.5 py-2 rounded-xl text-sm font-medium">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{currentRecipe.calories} Cal</span>
            </div>
          </div>
        </div>

        {/* Macros Breakdown */}
        <div className="grid grid-cols-3 border-b border-border bg-muted/10 divide-x divide-border">
          <div className="py-3.5 px-4 text-center">
            <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Protein</span>
            <span className="text-lg font-bold text-foreground">{currentRecipe.macros.protein}g</span>
          </div>
          <div className="py-3.5 px-4 text-center">
            <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Carbs</span>
            <span className="text-lg font-bold text-foreground">{currentRecipe.macros.carbs}g</span>
          </div>
          <div className="py-3.5 px-4 text-center">
            <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fat</span>
            <span className="text-lg font-bold text-foreground">{currentRecipe.macros.fat}g</span>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Ingredients list */}
          <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-border">
            <h4 className="font-bold text-md mb-4 text-foreground flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-primary" /> Required Ingredients
            </h4>
            <ul className="space-y-3">
              {currentRecipe.requiredIngredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                  <div className="mt-0.5 w-4.5 h-4.5 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions list */}
          <div className="lg:col-span-7 p-6">
            <h4 className="font-bold text-md mb-4 text-foreground">Instructions</h4>
            <ol className="space-y-4">
              {currentRecipe.instructions.map((stepText, idx) => (
                <li key={idx} className="flex gap-4 text-sm text-foreground leading-relaxed">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-foreground text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{stepText}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
