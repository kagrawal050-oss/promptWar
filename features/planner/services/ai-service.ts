import { 
  MealPlanFormValues, 
  Recipe, 
  MealPlan, 
  GroceryItem, 
  TimelineTask, 
  SubstitutionInfo, 
  BudgetStatus, 
  AITips,
  DietaryPreference
} from '@/types';
import { RECIPES_DATABASE } from './recipe-db';

// Helper to check if a recipe contains any user allergies
function containsAllergen(recipe: Recipe, allergies: string[]): boolean {
  if (!allergies || allergies.length === 0) return false;

  const allergyMap: Record<string, string[]> = {
    dairy: ['milk', 'greek yogurt', 'paneer', 'cheese', 'butter', 'cream', 'yogurt'],
    nuts: ['almond milk', 'peanut', 'almond', 'cashew', 'walnut', 'nuts'],
    peanuts: ['peanut', 'peanuts'],
    gluten: ['bread', 'spaghetti', 'pasta', 'rolled oats', 'wheat', 'toast'],
    soy: ['tofu', 'soy sauce', 'soy'],
    eggs: ['egg', 'eggs'],
    shellfish: ['shrimp', 'prawn', 'crab', 'lobster', 'shellfish'],
    fish: ['salmon', 'tuna', 'fish'],
  };

  const recipeIngredientsLower = recipe.baseIngredients.map(i => i.toLowerCase());

  for (const allergy of allergies) {
    const allergenKeywords = allergyMap[allergy.toLowerCase()];
    if (allergenKeywords) {
      for (const keyword of allergenKeywords) {
        if (recipeIngredientsLower.some(ing => ing.includes(keyword))) {
          return true;
        }
      }
    }
  }

  return false;
}

// Categorize ingredients for the grocery list
function getIngredientCategory(ingredientName: string): GroceryItem['category'] {
  const name = ingredientName.toLowerCase();
  
  const vegetables = ['spinach', 'onion', 'tomato', 'broccoli', 'cauliflower', 'pepper', 'carrot', 'garlic', 'ginger', 'cucumber', 'herb', 'parsley', 'thyme', 'rosemary', 'sprout', 'cabbage'];
  const fruits = ['berry', 'berries', 'avocado', 'lemon', 'banana', 'apple', 'orange'];
  const spices = ['cumin', 'turmeric', 'masala', 'paprika', 'powder', 'pepper to taste', 'salt to taste', 'chili', 'spices'];
  const dairy = ['milk', 'greek yogurt', 'paneer', 'cheese', 'butter', 'cream', 'curd', 'parmesan', 'cheddar'];
  const protein = ['chicken', 'tofu', 'egg', 'eggs', 'salmon', 'tuna', 'shrimp', 'beef', 'pork'];
  const grains = ['rolled oats', 'rice', 'basmati', 'spaghetti', 'pasta', 'bread', 'toast', 'quinoa', 'oats', 'wheat'];

  if (vegetables.some(v => name.includes(v))) return 'Vegetables';
  if (fruits.some(f => name.includes(f))) return 'Fruits';
  if (spices.some(s => name.includes(s))) return 'Spices';
  if (dairy.some(d => name.includes(d))) return 'Dairy';
  if (protein.some(p => name.includes(p))) return 'Protein';
  if (grains.some(g => name.includes(g))) return 'Grains';
  
  return 'Others';
}

// Clean and extract base ingredient name from detailed recipe string
function cleanIngredientName(ingLine: string): string {
  // e.g. "1 cup Rolled Oats" -> "Rolled Oats"
  // e.g. "150g Paneer" -> "Paneer"
  // e.g. "2 large Eggs" -> "Eggs"
  let name = ingLine.replace(/^\d+(\.\d+)?\s*(cup|cups|tbsp|tsp|g|large|slices|cloves|tbsp|g)?\s*/i, '');
  // capitalize first letters
  name = name.trim();
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// AI Plan Generation Logic
export function generateMealPlan(values: MealPlanFormValues): MealPlan {
  const {
    dietaryPreference,
    allergies,
    dailyBudget,
    familyMembers,
    cookingTimeAvailable,
    schedule,
    healthGoal,
    availableIngredients
  } = values;

  // 1. Filter recipe pool by Diet Tag and Allergy Constraints
  let eligibleRecipes = RECIPES_DATABASE.filter(recipe => {
    // Check dietary preference match
    // 'Veg' recipe must have 'Veg' tag.
    // 'Vegan' recipe must have 'Vegan' tag.
    // 'Eggetarian' recipe must have 'Eggetarian' tag.
    // 'Non-Veg' can have any tag, but we prefer 'Non-Veg' tags or Veg/Egg.
    if (dietaryPreference === 'Veg' && !recipe.dietTags.includes('Veg')) return false;
    if (dietaryPreference === 'Vegan' && !recipe.dietTags.includes('Vegan')) return false;
    if (dietaryPreference === 'Eggetarian' && !recipe.dietTags.includes('Eggetarian') && !recipe.dietTags.includes('Veg')) return false;

    // Check allergy exclusions
    if (containsAllergen(recipe, allergies)) return false;

    return true;
  });

  // Fallback: If no recipes match due to extreme allergy filters, bypass allergy filters on a case-by-case (warning will be shown in UI)
  if (eligibleRecipes.length === 0) {
    eligibleRecipes = RECIPES_DATABASE.filter(recipe => {
      if (dietaryPreference === 'Veg' && !recipe.dietTags.includes('Veg')) return false;
      if (dietaryPreference === 'Vegan' && !recipe.dietTags.includes('Vegan')) return false;
      return true;
    });
  }

  // 2. Select meals based on Health Goal, Cuisine, and Cooking Time
  const breakfastPool = eligibleRecipes.filter(r => r.mealType === 'Breakfast');
  const lunchPool = eligibleRecipes.filter(r => r.mealType === 'Lunch');
  const dinnerPool = eligibleRecipes.filter(r => r.mealType === 'Dinner');

  // Matcher function
  const selectBestMeal = (pool: Recipe[], preferredCuisine: string, timeLimitMin: number): Recipe => {
    if (pool.length === 0) {
      // Return absolute fallback from main database if pool is empty
      return RECIPES_DATABASE.find(r => r.mealType === pool[0]?.mealType) || RECIPES_DATABASE[0];
    }

    // Score recipes based on criteria
    const scored = pool.map(recipe => {
      let score = 0;
      
      // Preferred cuisine match
      if (preferredCuisine.toLowerCase() === 'any / global' || recipe.cuisine.toLowerCase() === preferredCuisine.toLowerCase()) {
        score += 5;
      }
      
      // Health goal match
      if (recipe.healthGoals.includes(healthGoal)) {
        score += 4;
      }

      // Time match (prioritize cooking times within the available limits)
      if (recipe.cookingTime <= timeLimitMin) {
        score += 3;
      } else {
        score -= 2; // small penalty for going over time limit
      }

      // Available ingredients bonus: count how many home ingredients are used in the recipe
      const homeIngMatches = recipe.baseIngredients.filter(ing => 
        availableIngredients.some(homeIng => homeIng.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(homeIng.toLowerCase()))
      );
      score += homeIngMatches.length * 2;

      return { recipe, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);
    return scored[0].recipe;
  };

  // Convert Cooking Time Available to minutes limit
  const maxTimeMap: Record<string, number> = {
    '15 min': 15,
    '30 min': 30,
    '45 min': 45,
    '60+ min': 120
  };
  const timeLimit = maxTimeMap[cookingTimeAvailable] || 30;

  let selectedBreakfast = selectBestMeal(breakfastPool, values.cuisinePreference, timeLimit);
  let selectedLunch = selectBestMeal(lunchPool, values.cuisinePreference, timeLimit);
  let selectedDinner = selectBestMeal(dinnerPool, values.cuisinePreference, timeLimit);

  // 3. Substitutions Logic & Budget Feasibility Checks
  let totalBaseCost = selectedBreakfast.estimatedCostPerPortion + 
                      selectedLunch.estimatedCostPerPortion + 
                      selectedDinner.estimatedCostPerPortion;
  
  let totalEstimatedCost = totalBaseCost * familyMembers;
  const substitutions: SubstitutionInfo[] = [];

  // Standard substitutions map (Item -> Simpler/Cheaper swap)
  const substitutionDb: Record<string, { swap: string; costDiff: number; reason: string }> = {
    'greek yogurt': { swap: 'Curd', costDiff: 0.8, reason: 'Curd is a cheaper, highly accessible dairy alternative to Greek Yogurt.' },
    'broccoli': { swap: 'Cauliflower', costDiff: 0.5, reason: 'Cauliflower is a budget-friendly local alternative to Broccoli.' },
    'quinoa': { swap: 'Brown Rice', costDiff: 1.0, reason: 'Brown rice offers complex carbs at a fraction of the cost of Quinoa.' },
    'almond milk': { swap: 'Regular Milk', costDiff: 0.7, reason: 'Regular dairy milk is more affordable and provides similar liquid volume.' },
    'paneer': { swap: 'Tofu', costDiff: 0.4, reason: 'Tofu is a cheaper, plant-based protein alternative to fresh Paneer.' },
    'avocado': { swap: 'Spinach', costDiff: 1.2, reason: 'Spinach is a nutrient-dense vegetable that is much cheaper than Avocado.' }
  };

  // Check if we are over budget
  if (totalEstimatedCost > dailyBudget) {
    // Attempt substitutions to reduce cost
    const checkAndSubstitute = (recipe: Recipe): Recipe => {
      let modifiedRecipe = { ...recipe };
      let newIngredients = [...modifiedRecipe.requiredIngredients];
      let newBaseIngredients = [...modifiedRecipe.baseIngredients];
      
      recipe.baseIngredients.forEach((baseIng, index) => {
        const swapDetails = substitutionDb[baseIng.toLowerCase()];
        if (swapDetails) {
          // Perform swap in ingredient list strings
          newIngredients = newIngredients.map(ing => {
            const lowerIng = ing.toLowerCase();
            if (lowerIng.includes(baseIng.toLowerCase())) {
              substitutions.push({
                original: cleanIngredientName(ing),
                substitutedWith: swapDetails.swap,
                reason: `Budget savings: ${swapDetails.reason}`
              });
              
              // Replace the matching ingredient text
              const matchRegex = new RegExp(baseIng, 'gi');
              return ing.replace(matchRegex, swapDetails.swap);
            }
            return ing;
          });

          newBaseIngredients[index] = swapDetails.swap.toLowerCase();
          
          // Deduct savings
          modifiedRecipe.estimatedCostPerPortion = Math.max(0.5, modifiedRecipe.estimatedCostPerPortion - swapDetails.costDiff);
        }
      });

      modifiedRecipe.requiredIngredients = newIngredients;
      modifiedRecipe.baseIngredients = newBaseIngredients;
      return modifiedRecipe;
    };

    // Apply substitutions
    selectedBreakfast = checkAndSubstitute(selectedBreakfast);
    selectedLunch = checkAndSubstitute(selectedLunch);
    selectedDinner = checkAndSubstitute(selectedDinner);

    // Recalculate cost
    totalBaseCost = selectedBreakfast.estimatedCostPerPortion + 
                    selectedLunch.estimatedCostPerPortion + 
                    selectedDinner.estimatedCostPerPortion;
    totalEstimatedCost = totalBaseCost * familyMembers;
  }

  // If still over budget after substitutions, search for cheaper recipes in the pools
  if (totalEstimatedCost > dailyBudget) {
    const getCheapestRecipe = (pool: Recipe[]): Recipe => {
      if (pool.length === 0) return RECIPES_DATABASE[0];
      return [...pool].sort((a, b) => a.estimatedCostPerPortion - b.estimatedCostPerPortion)[0];
    };

    // Swap dinner or lunch for cheaper alternatives if necessary
    const cheapDinner = getCheapestRecipe(dinnerPool);
    if (cheapDinner.id !== selectedDinner.id && cheapDinner.estimatedCostPerPortion < selectedDinner.estimatedCostPerPortion) {
      substitutions.push({
        original: selectedDinner.name,
        substitutedWith: cheapDinner.name,
        reason: `Replaced dinner recipe with a budget-friendly alternative (${cheapDinner.name}) to stay within limit.`
      });
      selectedDinner = cheapDinner;
    }

    // Recalculate
    totalBaseCost = selectedBreakfast.estimatedCostPerPortion + 
                    selectedLunch.estimatedCostPerPortion + 
                    selectedDinner.estimatedCostPerPortion;
    totalEstimatedCost = totalBaseCost * familyMembers;
  }

  // 4. Compute Final Budget Feasibility Report
  let budgetStatus: BudgetStatus['status'] = 'Within Budget';
  const ratio = totalEstimatedCost / dailyBudget;
  if (ratio > 1.0) {
    budgetStatus = 'Over Budget';
  } else if (ratio >= 0.85) {
    budgetStatus = 'Near Budget';
  }

  const savingsTips = [];
  if (budgetStatus === 'Over Budget') {
    savingsTips.push('Consider buying store brands for pantry staples like oats and rice.');
    savingsTips.push('Cook in larger batches to save on cooking fuel and benefit from wholesale ingredient sizes.');
    savingsTips.push('Remove non-essential garnishes or fancy sauces to drop the cost.');
  } else if (budgetStatus === 'Near Budget') {
    savingsTips.push('Keep an eye on portion sizes to avoid cooking excess leftovers.');
  } else {
    savingsTips.push('You have budget headroom! You could add a side dish or fruit dessert to your menu.');
  }

  const budgetReport: BudgetStatus = {
    totalEstimatedCost: parseFloat(totalEstimatedCost.toFixed(2)),
    dailyBudget,
    status: budgetStatus,
    difference: parseFloat((dailyBudget - totalEstimatedCost).toFixed(2)),
    savingsTips
  };

  // 5. Generate Grocery List (Excluding ingredients already at home)
  const combinedIngredientsList: { original: string; base: string }[] = [];
  
  const addRecipeIngredients = (recipe: Recipe) => {
    recipe.requiredIngredients.forEach((ing, index) => {
      const base = recipe.baseIngredients[index] || ing.toLowerCase();
      combinedIngredientsList.push({ original: ing, base });
    });
  };

  addRecipeIngredients(selectedBreakfast);
  addRecipeIngredients(selectedLunch);
  addRecipeIngredients(selectedDinner);

  // Deduplicate and filter out items "already available at home"
  const groceryItems: GroceryItem[] = [];
  const lowercaseHomeIngredients = availableIngredients.map(i => i.toLowerCase());

  combinedIngredientsList.forEach((item, idx) => {
    // Check if ingredient base is in the home ingredients list
    const isAtHome = lowercaseHomeIngredients.some(homeIng => 
      item.base.includes(homeIng) || homeIng.includes(item.base)
    );

    if (!isAtHome) {
      const category = getIngredientCategory(item.original);
      const name = cleanIngredientName(item.original);
      
      // Attempt to estimate quantity
      // Extract starting digits/words
      const quantityMatch = item.original.match(/^\d+(\.\d+)?\s*(cup|cups|tbsp|tsp|g|large|slices|cloves|tbsp|g)?/i);
      const quantity = quantityMatch ? quantityMatch[0].trim() : 'As needed';

      // Check if we already added a grocery item with the same name, if so merge/append
      const existing = groceryItems.find(g => g.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        // If both have numbers, sum them up (very simple parsing)
        const qtyNum = parseFloat(quantity);
        const extNum = parseFloat(existing.quantity);
        if (!isNaN(qtyNum) && !isNaN(extNum) && quantity.replace(/[0-9.]/g, '') === existing.quantity.replace(/[0-9.]/g, '')) {
          const unit = quantity.replace(/[0-9.]/g, '').trim();
          existing.quantity = `${(qtyNum + extNum).toFixed(1).replace(/\.0$/, '')} ${unit}`.trim();
        } else {
          existing.quantity += ` + ${quantity}`;
        }
      } else {
        groceryItems.push({
          id: `g-${idx}`,
          name,
          quantity: quantity || 'As needed',
          category,
          checked: false
        });
      }
    }
  });

  // 6. Generate Timeline based on Schedule
  const timeline: TimelineTask[] = [];
  
  if (schedule === 'Busy') {
    timeline.push(
      { id: 't1', time: '07:30 AM', action: `Prep ingredients for breakfast: ${selectedBreakfast.name}`, checked: false, mealType: 'Prep' },
      { id: 't2', time: '07:45 AM', action: `Cook breakfast: ${selectedBreakfast.name}`, checked: false, mealType: 'Breakfast' },
      { id: 't3', time: '12:15 PM', action: `Quick prep for lunch: ${selectedLunch.name}`, checked: false, mealType: 'Prep' },
      { id: 't4', time: '12:30 PM', action: `Assemble/Cook lunch: ${selectedLunch.name}`, checked: false, mealType: 'Lunch' },
      { id: 't5', time: '06:30 PM', action: `Prep and marinate dinner ingredients`, checked: false, mealType: 'Prep' },
      { id: 't6', time: '06:50 PM', action: `Cook dinner: ${selectedDinner.name}`, checked: false, mealType: 'Dinner' }
    );
  } else if (schedule === 'Normal') {
    timeline.push(
      { id: 't1', time: '08:00 AM', action: `Gather and prep breakfast ingredients`, checked: false, mealType: 'Prep' },
      { id: 't2', time: '08:15 AM', action: `Cook and serve: ${selectedBreakfast.name}`, checked: false, mealType: 'Breakfast' },
      { id: 't3', time: '12:30 PM', action: `Begin lunch prep: chop veggies and gather spices`, checked: false, mealType: 'Prep' },
      { id: 't4', time: '12:50 PM', action: `Cook and enjoy: ${selectedLunch.name}`, checked: false, mealType: 'Lunch' },
      { id: 't5', time: '07:00 PM', action: `Start dinner preparations`, checked: false, mealType: 'Prep' },
      { id: 't6', time: '07:20 PM', action: `Cook and plating: ${selectedDinner.name}`, checked: false, mealType: 'Dinner' }
    );
  } else { // Free schedule
    timeline.push(
      { id: 't1', time: '08:30 AM', action: `Relaxed prep for breakfast: ${selectedBreakfast.name}`, checked: false, mealType: 'Prep' },
      { id: 't2', time: '09:00 AM', action: `Cook breakfast with coffee or tea`, checked: false, mealType: 'Breakfast' },
      { id: 't3', time: '01:00 PM', action: `Leisurely prepare lunch ingredients`, checked: false, mealType: 'Prep' },
      { id: 't4', time: '01:30 PM', action: `Cook and plate lunch: ${selectedLunch.name}`, checked: false, mealType: 'Lunch' },
      { id: 't5', time: '07:00 PM', action: `Marinate and prep dinner ingredients`, checked: false, mealType: 'Prep' },
      { id: 't6', time: '07:30 PM', action: `Cook a delicious dinner: ${selectedDinner.name}`, checked: false, mealType: 'Dinner' },
      { id: 't7', time: '08:15 PM', action: `Kitchen clean-up and meal prep for tomorrow`, checked: false, mealType: 'Prep' }
    );
  }

  // 7. Assemble Tailored AI Tips
  const tips: AITips = {
    cooking: [
      'Preheat your pans before adding food to ensure even cooking and prevent sticking.',
      selectedBreakfast.instructions.length > 0 ? 'For breakfast, measure out dry ingredients the night before.' : '',
      selectedLunch.name.toLowerCase().includes('salad') ? 'Dress your salad right before eating to prevent sogginess.' : 'Let hot dishes sit for 2 minutes before serving to distribute flavors.'
    ].filter(Boolean),
    nutrition: [
      healthGoal === 'Weight Loss' ? 'Focus on hydration. Drink water 30 minutes before meals to naturally regulate appetite.' : '',
      healthGoal === 'High Protein' || healthGoal === 'Muscle Gain' ? 'Egg whites, paneer, and tofu are highly bioavailable protein sources. Consume them within 2 hours of exercise.' : '',
      healthGoal === 'Low Carb' ? 'Load up on green leafy vegetables to ensure you get sufficient fiber on low-carb days.' : 'Ensure half of your plate consists of colorful vegetables to maximize micronutrient intake.'
    ].filter(Boolean),
    timeSaving: [
      'Chop all onions, garlic, and ginger for the entire day during your morning breakfast prep.',
      'Use a multi-timer or clean up as you cook to keep your workstation clutter-free.'
    ],
    storage: [
      'Keep leftover herbs in a glass of water like fresh flowers to double their fridge life.',
      'Store cooked rice in airtight containers immediately after cooling to prevent bacteria growth.'
    ]
  };

  return {
    breakfast: selectedBreakfast,
    lunch: selectedLunch,
    dinner: selectedDinner,
    groceryList: groceryItems,
    timeline,
    budget: budgetReport,
    substitutions,
    tips,
    createdAt: new Date().toISOString(),
    formPreferences: values
  };
}
