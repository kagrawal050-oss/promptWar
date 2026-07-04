'use client';

import React from 'react';
import { DollarSign, Percent, PiggyBank, ArrowDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { BudgetStatus } from '@/types';

interface BudgetCardProps {
  budget: BudgetStatus;
  currencySymbol: string;
}

export default function BudgetCard({ budget, currencySymbol }: BudgetCardProps) {
  const { totalEstimatedCost, dailyBudget, status, difference, savingsTips } = budget;

  // Calculate percentage of budget used
  const percentUsed = Math.min(100, Math.round((totalEstimatedCost / dailyBudget) * 100));

  const getStatusColor = () => {
    switch (status) {
      case 'Within Budget':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Near Budget':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Over Budget':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-muted-foreground bg-secondary';
    }
  };

  const getGaugeStrokeColor = () => {
    switch (status) {
      case 'Within Budget':
        return 'stroke-emerald-500';
      case 'Near Budget':
        return 'stroke-amber-500';
      case 'Over Budget':
        return 'stroke-rose-500';
      default:
        return 'stroke-primary';
    }
  };

  return (
    <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <PiggyBank className="w-5 h-5 text-primary" /> Budget Feasibility Analysis
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
          Comparison of estimated raw ingredient costs against your daily limit.
        </p>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Circular Gauge */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center bg-secondary/30 rounded-full border border-border/40">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="58"
                className="stroke-muted fill-transparent opacity-20"
                strokeWidth="8"
              />
              <circle
                cx="72"
                cy="72"
                r="58"
                className={`fill-transparent ${getGaugeStrokeColor()}`}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 58}`}
                strokeDashoffset={`${2 * Math.PI * 58 * (1 - percentUsed / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-black block leading-none text-foreground">{percentUsed}%</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mt-1">Budget Used</span>
            </div>
          </div>
        </div>

        {/* Cost stats */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <span className="text-sm font-medium text-muted-foreground">Estimated Meal Cost:</span>
            <span className="text-lg font-black text-foreground">{currencySymbol}{totalEstimatedCost.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <span className="text-sm font-medium text-muted-foreground">Your Budget Limit:</span>
            <span className="text-lg font-black text-foreground">{currencySymbol}{dailyBudget.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between pb-1">
            <span className="text-sm font-medium text-muted-foreground">Budget Status:</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor()}`}>
              {status}
            </span>
          </div>

          {/* Difference notice */}
          {status === 'Within Budget' ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
              <ArrowDown className="w-4 h-4 shrink-0" />
              <span>You are under budget by {currencySymbol}{Math.abs(difference).toFixed(2)}!</span>
            </div>
          ) : status === 'Near Budget' ? (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
              <Percent className="w-4 h-4 shrink-0" />
              <span>Tight margin: only {currencySymbol}{difference.toFixed(2)} remaining.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Over budget by {currencySymbol}{Math.abs(difference).toFixed(2)}. Applied saving swaps.</span>
            </div>
          )}
        </div>
      </div>

      {/* Savings Tips Section */}
      {savingsTips.length > 0 && (
        <div className="border-t border-border pt-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-primary" /> Budget Recommendations
          </h4>
          <ul className="space-y-2">
            {savingsTips.map((tip, i) => (
              <li key={i} className="text-xs text-foreground/90 leading-relaxed flex items-start gap-2">
                <span className="text-primary mt-0.5 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
