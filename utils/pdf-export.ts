import { MealPlan } from '@/types';

export function exportPlanToPDF(mealPlan: MealPlan, currencySymbol: string) {
  if (typeof window === 'undefined') return;

  const { breakfast, lunch, dinner, groceryList, timeline, budget, substitutions, tips } = mealPlan;

  // Create printable DOM container
  const printContainer = document.createElement('div');
  printContainer.id = 'cooking-plan-print-container';
  printContainer.className = 'print-page p-8 max-w-4xl mx-auto bg-white text-black space-y-8';

  // Apply basic print-specific styles inline
  printContainer.innerHTML = `
    <style>
      @media print {
        body * {
          visibility: hidden;
        }
        #cooking-plan-print-container, #cooking-plan-print-container * {
          visibility: visible;
        }
        #cooking-plan-print-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 20px;
          background: white;
          color: black;
        }
      }
      .print-section {
        margin-bottom: 24px;
        page-break-inside: avoid;
      }
      .print-header {
        border-bottom: 3px solid #10b981;
        padding-bottom: 12px;
        margin-bottom: 24px;
      }
      .print-grid {
        display: grid;
        grid-template-cols: 1fr 1fr;
        gap: 20px;
      }
      .recipe-block {
        border: 1px solid #e5e7eb;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 16px;
      }
    </style>

    <div class="print-header text-center">
      <h1 style="font-size: 28px; font-weight: 800; margin: 0; color: #10b981;">Cooking To-Do List AI</h1>
      <p style="font-size: 14px; color: #4b5563; margin-top: 4px;">Personalized Daily Cooking & Shopping Plan</p>
      <p style="font-size: 11px; color: #9ca3af; margin-top: 2px;">Generated on: ${new Date(mealPlan.createdAt).toLocaleDateString()} | For ${mealPlan.formPreferences.name}</p>
    </div>

    <!-- Budget Status Banner -->
    <div class="print-section" style="background: #f3f4f6; border-radius: 8px; padding: 12px 16px; font-size: 13px;">
      <strong>Daily Budget Summary:</strong> 
      Target: ${currencySymbol}${budget.dailyBudget.toFixed(2)} | 
      Estimated Cost: ${currencySymbol}${budget.totalEstimatedCost.toFixed(2)} | 
      Status: <span style="font-weight: 700;">${budget.status}</span>
      ${substitutions.length > 0 ? `<br><small style="color: #4b5563;">* Applied ${substitutions.length} smart substitutions to optimize costs.</small>` : ''}
    </div>

    <!-- Meal Plan Section -->
    <div class="print-section">
      <h2 style="font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 16px; color: #111827;">1. Daily Meal Plan</h2>
      
      <!-- Breakfast -->
      <div class="recipe-block">
        <h3 style="font-size: 16px; margin: 0 0 8px 0; color: #d97706;">Breakfast: ${breakfast.name}</h3>
        <p style="font-size: 12px; color: #4b5563; margin-bottom: 12px;">Cuisine: ${breakfast.cuisine} | Prep & Cook Time: ${breakfast.cookingTime} mins | Calories: ${breakfast.calories} kcal</p>
        <div style="display: flex; gap: 24px; font-size: 13px;">
          <div style="flex: 1;">
            <strong>Ingredients:</strong>
            <ul style="margin: 4px 0; padding-left: 20px;">
              ${breakfast.requiredIngredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
          </div>
          <div style="flex: 2;">
            <strong>Instructions:</strong>
            <ol style="margin: 4px 0; padding-left: 20px;">
              ${breakfast.instructions.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        </div>
      </div>

      <!-- Lunch -->
      <div class="recipe-block">
        <h3 style="font-size: 16px; margin: 0 0 8px 0; color: #ea580c;">Lunch: ${lunch.name}</h3>
        <p style="font-size: 12px; color: #4b5563; margin-bottom: 12px;">Cuisine: ${lunch.cuisine} | Prep & Cook Time: ${lunch.cookingTime} mins | Calories: ${lunch.calories} kcal</p>
        <div style="display: flex; gap: 24px; font-size: 13px;">
          <div style="flex: 1;">
            <strong>Ingredients:</strong>
            <ul style="margin: 4px 0; padding-left: 20px;">
              ${lunch.requiredIngredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
          </div>
          <div style="flex: 2;">
            <strong>Instructions:</strong>
            <ol style="margin: 4px 0; padding-left: 20px;">
              ${lunch.instructions.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        </div>
      </div>

      <!-- Dinner -->
      <div class="recipe-block">
        <h3 style="font-size: 16px; margin: 0 0 8px 0; color: #4f46e5;">Dinner: ${dinner.name}</h3>
        <p style="font-size: 12px; color: #4b5563; margin-bottom: 12px;">Cuisine: ${dinner.cuisine} | Prep & Cook Time: ${dinner.cookingTime} mins | Calories: ${dinner.calories} kcal</p>
        <div style="display: flex; gap: 24px; font-size: 13px;">
          <div style="flex: 1;">
            <strong>Ingredients:</strong>
            <ul style="margin: 4px 0; padding-left: 20px;">
              ${dinner.requiredIngredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
          </div>
          <div style="flex: 2;">
            <strong>Instructions:</strong>
            <ol style="margin: 4px 0; padding-left: 20px;">
              ${dinner.instructions.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- Grocery Shopping & Timeline Grid -->
    <div class="print-section print-grid" style="display: flex; justify-content: space-between; gap: 24px;">
      
      <!-- Grocery List -->
      <div style="flex: 1; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px;">
        <h2 style="font-size: 16px; margin: 0 0 12px 0; border-bottom: 1.5px solid #e5e7eb; padding-bottom: 4px; color: #111827;">2. Grocery Shopping List</h2>
        ${groceryList.length === 0 
          ? '<p style="font-size: 12px; color: #6b7280;">No grocery items required (all items available at home).</p>' 
          : `<ul style="margin: 0; padding-left: 20px; font-size: 12px; line-height: 1.8;">
              ${groceryList.map(item => `<li><strong>${item.name}</strong> - <small>${item.quantity} (${item.category})</small></li>`).join('')}
             </ul>`
        }
      </div>

      <!-- Schedule Timeline -->
      <div style="flex: 1; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px;">
        <h2 style="font-size: 16px; margin: 0 0 12px 0; border-bottom: 1.5px solid #e5e7eb; padding-bottom: 4px; color: #111827;">3. Cooking Timeline</h2>
        <ul style="margin: 0; padding-left: 0; list-style: none; font-size: 12px; line-height: 1.8;">
          ${timeline.map(task => `
            <li style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
              <span style="font-weight: 700; color: #10b981; min-width: 65px; display: inline-block;">[ ${task.time} ]</span>
              <span>${task.action}</span>
            </li>
          `).join('')}
        </ul>
      </div>

    </div>

    <!-- AI Smart Tips -->
    <div class="print-section" style="border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; font-size: 12px;">
      <h2 style="font-size: 16px; margin: 0 0 12px 0; border-bottom: 1.5px solid #e5e7eb; padding-bottom: 4px; color: #111827;">4. AI Cooking & Nutrition Tips</h2>
      <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 16px;">
        <div>
          <strong>Kitchen Hacks:</strong>
          <ul style="margin: 4px 0; padding-left: 16px;">
            ${tips.cooking.map(tip => `<li>${tip}</li>`).join('')}
            ${tips.timeSaving.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
        <div>
          <strong>Nutrition & Storage:</strong>
          <ul style="margin: 4px 0; padding-left: 16px;">
            ${tips.nutrition.map(tip => `<li>${tip}</li>`).join('')}
            ${tips.storage.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;

  // Append container, print, and clean up
  document.body.appendChild(printContainer);
  
  // Give CSS style execution time to settle
  setTimeout(() => {
    window.print();
    document.body.removeChild(printContainer);
  }, 100);
}
