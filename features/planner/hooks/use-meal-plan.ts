'use client';

import { useState, useEffect } from 'react';
import { MealPlan, MealPlanFormValues } from '@/types';
import { generateMealPlan } from '../services/ai-service';
import { useLocalStorage } from '@/hooks/use-local-storage';

const LOADING_PHASES = [
  'Harvesting fresh ingredients...',
  'Consulting virtual nutritionists...',
  'Balancing daily caloric targets...',
  'Applying smart allergy exclusions...',
  'Calibrating ingredients for family budget...',
  'Polishing your step-by-step timeline...',
  'Platter plating...'
];

export function useMealPlan() {
  const [mealPlan, setMealPlan] = useLocalStorage<MealPlan | null>('cooking_todo_ai_plan', null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);

  // Cycling through loading text phases when active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingPhase(prev => (prev + 1) % LOADING_PHASES.length);
      }, 1000);
    } else {
      setLoadingPhase(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const generatePlan = async (values: MealPlanFormValues) => {
    setIsLoading(true);
    
    // Simulate smart AI reasoning delay (2.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    try {
      const generated = generateMealPlan(values);
      setMealPlan(generated);
    } catch (err) {
      console.error('Failed to generate meal plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTimelineTask = (taskId: string) => {
    if (!mealPlan) return;
    
    const updatedTimeline = mealPlan.timeline.map(task => 
      task.id === taskId ? { ...task, checked: !task.checked } : task
    );

    setMealPlan({
      ...mealPlan,
      timeline: updatedTimeline
    });
  };

  const toggleGroceryItem = (itemId: string) => {
    if (!mealPlan) return;

    const updatedGrocery = mealPlan.groceryList.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    setMealPlan({
      ...mealPlan,
      groceryList: updatedGrocery
    });
  };

  const resetPlan = () => {
    setMealPlan(null);
  };

  return {
    mealPlan,
    isLoading,
    loadingMessage: LOADING_PHASES[loadingPhase],
    generatePlan,
    toggleTimelineTask,
    toggleGroceryItem,
    resetPlan
  };
}
