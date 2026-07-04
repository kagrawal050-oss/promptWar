'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChefHat, Sparkles, Plus, Download, ChevronRight,
  Calculator, Activity, ShoppingCart, ListChecks
} from 'lucide-react';
import MealForm from '@/features/planner/components/meal-form';
import PlanDisplay from '@/features/planner/components/plan-display';
import GroceryList from '@/features/planner/components/grocery-list';
import TimelineTodo from '@/features/planner/components/timeline-todo';
import BudgetCard from '@/features/planner/components/budget-card';
import AITips from '@/features/planner/components/ai-tips';
import { useMealPlan } from '@/features/planner/hooks/use-meal-plan';
import { exportPlanToPDF } from '@/utils/pdf-export';
import { COUNTRIES } from '@/lib/constants';

export default function Dashboard() {
  const {
    mealPlan,
    isLoading,
    loadingMessage,
    generatePlan,
    toggleTimelineTask,
    toggleGroceryItem,
    resetPlan
  } = useMealPlan();

  const [activeTab, setActiveTab] = React.useState<'meals' | 'grocery' | 'timeline' | 'budget' | 'tips'>('meals');

  // Determine currency symbol based on plan preferences
  const getCurrencySymbol = () => {
    if (!mealPlan) return '$';
    const country = COUNTRIES.find(c => c.name === mealPlan.formPreferences.country);
    return country ? country.symbol : '$';
  };

  const currencySymbol = getCurrencySymbol();

  // Helper stats for dashboard summary widgets
  const totalCalories = mealPlan 
    ? mealPlan.breakfast.calories + mealPlan.lunch.calories + mealPlan.dinner.calories 
    : 0;

  const totalProtein = mealPlan 
    ? mealPlan.breakfast.macros.protein + mealPlan.lunch.macros.protein + mealPlan.dinner.macros.protein
    : 0;

  const totalCarbs = mealPlan 
    ? mealPlan.breakfast.macros.carbs + mealPlan.lunch.macros.carbs + mealPlan.dinner.macros.carbs
    : 0;

  const totalFat = mealPlan 
    ? mealPlan.breakfast.macros.fat + mealPlan.lunch.macros.fat + mealPlan.dinner.macros.fat
    : 0;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background relative z-10">
      {/* Navbar */}
      <header className="w-full border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-foreground">
              Cooking To-Do <span className="text-primary">AI</span>
            </span>
          </Link>

          {mealPlan && !isLoading && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportPlanToPDF(mealPlan, currencySymbol)}
                className="px-3.5 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted transition flex items-center gap-1.5"
                title="Export or print your daily cooking plan"
              >
                <Download className="w-3.5 h-3.5" /> Export Plan
              </button>
              <button
                onClick={resetPlan}
                className="px-3.5 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:text-destructive hover:bg-destructive/5 transition flex items-center gap-1.5"
                title="Clear current preferences and plan a new day"
              >
                <Plus className="w-3.5 h-3.5" /> New Plan
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {/* 1. Loading Phase */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-md mx-auto py-16 text-center space-y-6"
            >
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                {/* Modern loading ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                <ChefHat className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">AI Cooking Assistant Planning</h3>
                <p className="text-xs text-muted-foreground animate-pulse font-medium">{loadingMessage}</p>
              </div>

              {/* Fake Skeleton Card */}
              <div className="bg-card border border-border p-6 rounded-2xl text-left space-y-4 shadow-sm opacity-60">
                <div className="h-4 bg-muted rounded-full w-2/3 animate-pulse" />
                <div className="h-3 bg-muted rounded-full w-1/2 animate-pulse" />
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-muted rounded-full w-full animate-pulse" />
                  <div className="h-3 bg-muted rounded-full w-4/5 animate-pulse" />
                  <div className="h-3 bg-muted rounded-full w-11/12 animate-pulse" />
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. Form Input Phase */}
          {!mealPlan && !isLoading && (
            <motion.div
              key="form-entry"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-foreground">Configure Your Cooking Plan</h1>
                <p className="text-sm text-muted-foreground font-medium max-w-md mx-auto">
                  Provide your kitchen details, and our local AI engine will prepare optimized daily schedules, recipes, and shopping lists.
                </p>
              </div>
              <MealForm onSubmit={generatePlan} isLoading={isLoading} />
            </motion.div>
          )}

          {/* 3. Result / Dashboard Phase */}
          {mealPlan && !isLoading && (
            <motion.div
              key="dashboard-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Welcome Banner */}
              <div className="bg-card border border-border p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-foreground">
                    Chef {mealPlan.formPreferences.name}&apos;s Daily Planner
                  </h1>
                  <p className="text-xs text-muted-foreground font-medium mt-1">
                    Cuisine preference: <span className="font-bold text-foreground">{mealPlan.formPreferences.cuisinePreference}</span> | 
                    Diet: <span className="font-bold text-foreground">{mealPlan.formPreferences.dietaryPreference}</span> | 
                    Health Goal: <span className="font-bold text-foreground">{mealPlan.formPreferences.healthGoal}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-3.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> Healthy plan
                  </div>
                </div>
              </div>

              {/* Sub-Header Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Daily Calories</span>
                  <span className="text-lg font-black text-foreground">{totalCalories} kcal</span>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Protein Total</span>
                  <span className="text-lg font-black text-foreground">{totalProtein}g</span>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Carbs Total</span>
                  <span className="text-lg font-black text-foreground">{totalCarbs}g</span>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Fat Total</span>
                  <span className="text-lg font-black text-foreground">{totalFat}g</span>
                </div>
              </div>

              {/* Main Split Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                <div className="lg:col-span-3 space-y-2 lg:sticky lg:top-24">
                  {(
                    [
                      { id: 'meals', label: 'Meal Plan', icon: <ChefHat className="w-4 h-4" /> },
                      { id: 'timeline', label: 'Cooking Timeline', icon: <ListChecks className="w-4 h-4" /> },
                      { id: 'grocery', label: 'Grocery List', icon: <ShoppingCart className="w-4 h-4" /> },
                      { id: 'budget', label: 'Budget Feasibility', icon: <Calculator className="w-4 h-4" /> },
                      { id: 'tips', label: 'Smart AI Tips', icon: <Sparkles className="w-4 h-4" /> }
                    ] as const
                  ).map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold transition ${
                        activeTab === tab.id
                          ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                          : 'bg-card border-border hover:bg-muted text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 opacity-50 transition ${activeTab === tab.id ? 'translate-x-0.5' : ''}`} />
                    </button>
                  ))}
                </div>

                {/* Tab content panel */}
                <div className="lg:col-span-9">
                  <AnimatePresence mode="wait">
                    {activeTab === 'meals' && (
                      <motion.div
                        key="meals-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <PlanDisplay 
                          breakfast={mealPlan.breakfast} 
                          lunch={mealPlan.lunch} 
                          dinner={mealPlan.dinner} 
                          currencySymbol={currencySymbol} 
                        />
                      </motion.div>
                    )}

                    {activeTab === 'timeline' && (
                      <motion.div
                        key="timeline-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TimelineTodo 
                          tasks={mealPlan.timeline} 
                          onToggleTask={toggleTimelineTask} 
                        />
                      </motion.div>
                    )}

                    {activeTab === 'grocery' && (
                      <motion.div
                        key="grocery-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <GroceryList 
                          items={mealPlan.groceryList} 
                          substitutions={mealPlan.substitutions} 
                          onToggleItem={toggleGroceryItem} 
                        />
                      </motion.div>
                    )}

                    {activeTab === 'budget' && (
                      <motion.div
                        key="budget-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <BudgetCard 
                          budget={mealPlan.budget} 
                          currencySymbol={currencySymbol} 
                        />
                      </motion.div>
                    )}

                    {activeTab === 'tips' && (
                      <motion.div
                        key="tips-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AITips tips={mealPlan.tips} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
