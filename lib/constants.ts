import { DietaryPreference, CookingSkill, CookingTimeAvailable, Schedule, HealthGoal } from '@/types';

export const DIETARY_PREFERENCES: DietaryPreference[] = ['Veg', 'Vegan', 'Eggetarian', 'Non-Veg'];

export const COOKING_SKILLS: CookingSkill[] = ['Beginner', 'Intermediate', 'Expert'];

export const COOKING_TIMES: CookingTimeAvailable[] = ['15 min', '30 min', '45 min', '60+ min'];

export const SCHEDULES: Schedule[] = ['Busy', 'Normal', 'Free'];

export const HEALTH_GOALS: HealthGoal[] = [
  'Balanced Diet',
  'Weight Loss',
  'Muscle Gain',
  'Diabetic Friendly',
  'High Protein',
  'Low Carb',
];

export const CUISINES = [
  'Indian',
  'Italian',
  'American',
  'Mexican',
  'Mediterranean',
  'Asian',
  'Any / Global',
];

export const COUNTRIES = [
  { name: 'United States', code: 'US', currency: 'USD', symbol: '$', rate: 1.0 },
  { name: 'India', code: 'IN', currency: 'INR', symbol: '₹', rate: 83.5 },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP', symbol: '£', rate: 0.79 },
  { name: 'European Union', code: 'EU', currency: 'EUR', symbol: '€', rate: 0.92 },
  { name: 'Canada', code: 'CA', currency: 'CAD', symbol: 'CA$', rate: 1.37 },
  { name: 'Australia', code: 'AU', currency: 'AUD', symbol: 'A$', rate: 1.51 },
];

export const ALLERGIES = [
  'Nuts',
  'Peanuts',
  'Dairy',
  'Gluten',
  'Soy',
  'Eggs',
  'Shellfish',
  'Fish',
];

export const COMMON_INGREDIENTS = [
  'Tomatoes',
  'Onions',
  'Garlic',
  'Ginger',
  'Spinach',
  'Potatoes',
  'Cauliflower',
  'Broccoli',
  'Bell Peppers',
  'Carrots',
  'Paneer',
  'Tofu',
  'Chicken',
  'Eggs',
  'Rolled Oats',
  'Milk',
  'Greek Yogurt',
  'Rice (Basmati/Brown)',
  'Pasta / Spaghetti',
  'Bread / Whole Wheat Toast',
  'Cheese (Cheddar/Parmesan)',
  'Butter / Olive Oil',
  'Lemon',
  'Quinoa',
  'Almond Milk',
  'Lentils / Beans',
  'Avocado',
];
