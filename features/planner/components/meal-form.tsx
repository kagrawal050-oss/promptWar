'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Sparkles, ChefHat, Wallet, Clock, Check, 
  ArrowRight, ArrowLeft, RotateCcw, AlertCircle, Globe 
} from 'lucide-react';
import { MealPlanFormValues } from '@/types';
import { 
  DIETARY_PREFERENCES, COOKING_SKILLS, COOKING_TIMES, 
  SCHEDULES, HEALTH_GOALS, CUISINES, COUNTRIES, 
  ALLERGIES, COMMON_INGREDIENTS 
} from '@/lib/constants';

// Zod Schema matching MealPlanFormValues
const mealFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  country: z.string().min(1, 'Please select a country'),
  cuisinePreference: z.string().min(1, 'Please select a cuisine preference'),
  dietaryPreference: z.enum(['Veg', 'Vegan', 'Eggetarian', 'Non-Veg'] as const),
  allergies: z.array(z.string()),
  dailyBudget: z.number().min(1, 'Budget must be at least 1'),
  currency: z.string().min(1, 'Please select a currency'),
  familyMembers: z.number().min(1, 'Must be at least 1').max(20, 'Max 20 members'),
  cookingSkill: z.enum(['Beginner', 'Intermediate', 'Expert'] as const),
  cookingTimeAvailable: z.enum(['15 min', '30 min', '45 min', '60+ min'] as const),
  schedule: z.enum(['Busy', 'Normal', 'Free'] as const),
  healthGoal: z.enum(['Weight Loss', 'Muscle Gain', 'Balanced Diet', 'Diabetic Friendly', 'High Protein', 'Low Carb'] as const),
  availableIngredients: z.array(z.string()),
});

interface MealFormProps {
  onSubmit: (data: MealPlanFormValues) => void;
  isLoading: boolean;
}

export default function MealForm({ onSubmit, isLoading }: MealFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MealPlanFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      name: '',
      country: 'United States',
      cuisinePreference: 'Any / Global',
      dietaryPreference: 'Veg',
      allergies: [],
      dailyBudget: 15,
      currency: 'USD',
      familyMembers: 1,
      cookingSkill: 'Intermediate',
      cookingTimeAvailable: '30 min',
      schedule: 'Normal',
      healthGoal: 'Balanced Diet',
      availableIngredients: [],
    },
  });

  const selectedCountryName = watch('country');
  const selectedIngredients = watch('availableIngredients') || [];
  const selectedAllergies = watch('allergies') || [];

  // Update currency automatically when country changes
  React.useEffect(() => {
    const matched = COUNTRIES.find(c => c.name === selectedCountryName);
    if (matched) {
      setValue('currency', matched.currency);
      // Adjust default budget scale based on currency rate
      if (matched.currency === 'INR') {
        setValue('dailyBudget', Math.round(15 * 83.5));
      } else {
        setValue('dailyBudget', 15);
      }
    }
  }, [selectedCountryName, setValue]);

  const nextStep = () => {
    // Basic validation before going to next step
    if (step === 1) {
      if (!watch('name') || watch('name').length < 2) return;
    }
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const toggleIngredient = (ing: string) => {
    if (selectedIngredients.includes(ing)) {
      setValue('availableIngredients', selectedIngredients.filter(i => i !== ing));
    } else {
      setValue('availableIngredients', [...selectedIngredients, ing]);
    }
  };

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setValue('allergies', selectedAllergies.filter(a => a !== allergy));
    } else {
      setValue('allergies', [...selectedAllergies, allergy]);
    }
  };

  return (
    <div className="w-full bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6 md:p-8">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map(num => (
          <div key={num} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm border-2 ${
              step >= num 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'border-border text-muted-foreground bg-transparent'
            }`}>
              {step > num ? <Check className="w-4 h-4" /> : num}
            </div>
            {num < 3 && (
              <div className={`h-0.5 flex-1 mx-3 ${
                step > num ? 'bg-primary' : 'bg-border'
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User className="text-primary w-5 h-5" /> Profile & Health Goals
              </h2>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">What is your name?</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  {...register('name')}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {errors.name && (
                  <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
                    <Globe className="w-4 h-4 text-muted-foreground" /> Country
                  </label>
                  <select
                    {...register('country')}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Cuisine Preference</label>
                  <select
                    {...register('cuisinePreference')}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {CUISINES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2.5">Dietary Preference</label>
                <Controller
                  name="dietaryPreference"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {DIETARY_PREFERENCES.map(pref => (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => field.onChange(pref)}
                          className={`py-2 px-3 rounded-xl border text-sm font-medium transition ${
                            field.value === pref
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-background border-border hover:bg-muted'
                          }`}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2.5">Health Goal</label>
                <Controller
                  name="healthGoal"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {HEALTH_GOALS.map(goal => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => field.onChange(goal)}
                          className={`py-2 px-3 rounded-xl border text-sm font-medium transition ${
                            field.value === goal
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-background border-border hover:bg-muted'
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ChefHat className="text-primary w-5 h-5" /> Cooking Preferences
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2.5">Cooking Skill Level</label>
                <Controller
                  name="cookingSkill"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-3 gap-2">
                      {COOKING_SKILLS.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => field.onChange(skill)}
                          className={`py-2 px-3 rounded-xl border text-sm font-medium transition ${
                            field.value === skill
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-background border-border hover:bg-muted'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" /> Cooking Time Available Today
                </label>
                <Controller
                  name="cookingTimeAvailable"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-4 gap-2">
                      {COOKING_TIMES.map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => field.onChange(time)}
                          className={`py-2 px-3 rounded-xl border text-sm font-medium transition ${
                            field.value === time
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-background border-border hover:bg-muted'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2.5">Today&apos;s Schedule Constraint</label>
                <Controller
                  name="schedule"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-3 gap-2">
                      {SCHEDULES.map(sch => (
                        <button
                          key={sch}
                          type="button"
                          onClick={() => field.onChange(sch)}
                          className={`py-2 px-3 rounded-xl border text-sm font-medium transition ${
                            field.value === sch
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-background border-border hover:bg-muted'
                          }`}
                        >
                          {sch}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Food Allergies (Exclusions)</label>
                <div className="flex flex-wrap gap-2">
                  {ALLERGIES.map(allergy => {
                    const isSelected = selectedAllergies.includes(allergy);
                    return (
                      <button
                        key={allergy}
                        type="button"
                        onClick={() => toggleAllergy(allergy)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                          isSelected
                            ? 'bg-destructive/10 border-destructive text-destructive'
                            : 'bg-background border-border text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {allergy}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Wallet className="text-primary w-5 h-5" /> Budget & Pantry
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Daily Cooking Budget</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      {...register('dailyBudget', { valueAsNumber: true })}
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">
                      {watch('currency')}
                    </div>
                  </div>
                  {errors.dailyBudget && (
                    <p className="text-destructive text-xs mt-1">{errors.dailyBudget.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Family Members</label>
                  <input
                    type="number"
                    placeholder="1"
                    {...register('familyMembers', { valueAsNumber: true })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                  />
                  {errors.familyMembers && (
                    <p className="text-destructive text-xs mt-1">{errors.familyMembers.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2.5">
                  Select ingredients already available at home:
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 bg-muted/30 border border-border rounded-xl">
                  {COMMON_INGREDIENTS.map(ing => {
                    const isSelected = selectedIngredients.includes(ing);
                    return (
                      <button
                        key={ing}
                        type="button"
                        onClick={() => toggleIngredient(ing)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1 transition ${
                          isSelected
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-card border-border text-foreground hover:bg-muted'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {ing}
                      </button>
                    );
                  })}
                </div>
                <p className="text-muted-foreground text-[11px] mt-1.5">
                  * Note: We won&apos;t include these checked ingredients in your generated grocery shopping list!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={step === 1 && (!watch('name') || watch('name').length < 2)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-75 transition shadow-sm"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" /> Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Cooking Plan
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
