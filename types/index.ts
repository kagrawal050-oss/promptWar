export type DietaryPreference = 'Veg' | 'Vegan' | 'Eggetarian' | 'Non-Veg';
export type CookingSkill = 'Beginner' | 'Intermediate' | 'Expert';
export type CookingTimeAvailable = '15 min' | '30 min' | '45 min' | '60+ min';
export type Schedule = 'Busy' | 'Normal' | 'Free';
export type HealthGoal = 
  | 'Weight Loss' 
  | 'Muscle Gain' 
  | 'Balanced Diet' 
  | 'Diabetic Friendly' 
  | 'High Protein' 
  | 'Low Carb';

export interface MealPlanFormValues {
  name: string;
  country: string;
  cuisinePreference: string;
  dietaryPreference: DietaryPreference;
  allergies: string[];
  dailyBudget: number;
  currency: string;
  familyMembers: number;
  cookingSkill: CookingSkill;
  cookingTimeAvailable: CookingTimeAvailable;
  schedule: Schedule;
  healthGoal: HealthGoal;
  availableIngredients: string[];
}

export interface MacroInfo {
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
}

export interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';
  cookingTime: number; // in minutes
  calories: number;
  macros: MacroInfo;
  requiredIngredients: string[]; // detailed string e.g., "1 cup Rolled Oats"
  baseIngredients: string[]; // base names for matching e.g., ["oats", "milk"]
  instructions: string[];
  dietTags: DietaryPreference[];
  healthGoals: HealthGoal[];
  estimatedCostPerPortion: number; // in USD equivalent
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: 'Vegetables' | 'Fruits' | 'Spices' | 'Dairy' | 'Protein' | 'Grains' | 'Others';
  checked: boolean;
}

export interface TimelineTask {
  id: string;
  time: string;
  action: string;
  checked: boolean;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Prep';
}

export interface SubstitutionInfo {
  original: string;
  substitutedWith: string;
  reason: string;
}

export interface BudgetStatus {
  totalEstimatedCost: number;
  dailyBudget: number;
  status: 'Within Budget' | 'Near Budget' | 'Over Budget';
  difference: number;
  savingsTips: string[];
}

export interface AITips {
  cooking: string[];
  nutrition: string[];
  timeSaving: string[];
  storage: string[];
}

export interface MealPlan {
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
  groceryList: GroceryItem[];
  timeline: TimelineTask[];
  budget: BudgetStatus;
  substitutions: SubstitutionInfo[];
  tips: AITips;
  createdAt: string;
  formPreferences: MealPlanFormValues;
}
