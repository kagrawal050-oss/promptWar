'use client';

import React from 'react';
import { ShoppingCart, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { GroceryItem, SubstitutionInfo } from '@/types';

interface GroceryListProps {
  items: GroceryItem[];
  substitutions: SubstitutionInfo[];
  onToggleItem: (itemId: string) => void;
}

export default function GroceryList({ items, substitutions, onToggleItem }: GroceryListProps) {
  // Group items by category
  const categories: Record<GroceryItem['category'], GroceryItem[]> = {
    Vegetables: [],
    Fruits: [],
    Spices: [],
    Dairy: [],
    Protein: [],
    Grains: [],
    Others: []
  };

  items.forEach(item => {
    if (categories[item.category]) {
      categories[item.category].push(item);
    } else {
      categories.Others.push(item);
    }
  });

  const checkedCount = items.filter(i => i.checked).length;
  const totalCount = items.length;

  return (
    <div className="space-y-6">
      {/* Smart Substitutions Notice */}
      {substitutions.length > 0 && (
        <div className="bg-accent/40 border border-accent/60 rounded-2xl p-5 text-accent-foreground">
          <h4 className="font-bold text-sm flex items-center gap-2 mb-2">
            <RefreshCw className="w-4 h-4 animate-spin-slow text-accent-foreground" />
            Smart Ingredient Substitutions Applied
          </h4>
          <p className="text-xs leading-relaxed mb-4 text-accent-foreground/90">
            We adjusted these ingredients to help you save money or bypass allergens while maintaining nutritional balance:
          </p>
          <div className="space-y-3">
            {substitutions.map((sub, i) => (
              <div key={i} className="flex gap-3 text-xs bg-background/50 border border-accent/40 rounded-xl p-3 shadow-xs">
                <div className="flex items-center gap-1.5 font-bold shrink-0">
                  <span className="line-through text-muted-foreground">{sub.original}</span>
                  <span>&rarr;</span>
                  <span className="text-primary">{sub.substitutedWith}</span>
                </div>
                <div className="text-muted-foreground text-left leading-normal border-l border-accent/20 pl-3">
                  {sub.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shopping Checklist Card */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" /> Grocery Shopping List
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              Only includes ingredients NOT already available in your kitchen.
            </p>
          </div>
          <span className="text-xs font-bold bg-secondary px-3 py-1.5 rounded-full text-foreground border border-border">
            {checkedCount} / {totalCount} Got
          </span>
        </div>

        {totalCount === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-xl">
            <AlertCircle className="w-10 h-10 text-muted-foreground/60 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">All ingredients are at home!</p>
            <p className="text-xs text-muted-foreground mt-0.5">You don&apos;t need to buy anything today.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {(Object.keys(categories) as GroceryItem['category'][]).map(cat => {
              const catItems = categories[cat];
              if (catItems.length === 0) return null;

              return (
                <div key={cat} className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
                    {cat}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {catItems.map(item => (
                      <div
                        key={item.id}
                        onClick={() => onToggleItem(item.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer select-none transition ${
                          item.checked
                            ? 'bg-muted/40 border-border/50 text-muted-foreground'
                            : 'bg-background border-border text-foreground hover:bg-muted/10'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${
                          item.checked
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-border bg-card group-hover:border-primary/50'
                        }`}>
                          {item.checked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0 flex justify-between items-center gap-2">
                          <span className={`text-sm font-medium truncate ${item.checked ? 'line-through' : ''}`}>
                            {item.name}
                          </span>
                          <span className="text-xs font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border/50 shrink-0">
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
