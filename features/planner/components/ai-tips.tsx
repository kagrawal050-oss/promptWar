'use client';

import React from 'react';
import { Lightbulb, HeartPulse, Clock, ShieldCheck, Zap } from 'lucide-react';
import { AITips as AITipsType } from '@/types';

interface AITipsProps {
  tips: AITipsType;
}

export default function AITips({ tips }: AITipsProps) {
  const categories = [
    {
      title: 'Cooking Hacks',
      icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
      items: tips.cooking,
      bg: 'bg-amber-500/5 border-amber-500/10',
    },
    {
      title: 'Nutritional Info',
      icon: <HeartPulse className="w-5 h-5 text-emerald-500" />,
      items: tips.nutrition,
      bg: 'bg-emerald-500/5 border-emerald-500/10',
    },
    {
      title: 'Time Saving Prep',
      icon: <Clock className="w-5 h-5 text-sky-500" />,
      items: tips.timeSaving,
      bg: 'bg-sky-500/5 border-sky-500/10',
    },
    {
      title: 'Food Storage & Safety',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />,
      items: tips.storage,
      bg: 'bg-indigo-500/5 border-indigo-500/10',
    },
  ];

  return (
    <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary animate-pulse" /> AI Smart Tips
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
          Personalized advice to optimize your nutrition, time, and kitchen resources.
        </p>
      </div>

      {/* Grid of Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat, i) => {
          if (!cat.items || cat.items.length === 0) return null;
          return (
            <div key={i} className={`p-5 rounded-2xl border ${cat.bg} space-y-3`}>
              <h4 className="font-bold text-sm flex items-center gap-2 text-foreground">
                {cat.icon} {cat.title}
              </h4>
              <ul className="space-y-2">
                {cat.items.map((item, idx) => (
                  <li key={idx} className="text-xs text-foreground/80 leading-relaxed flex items-start gap-2">
                    <span className="text-primary mt-0.5 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
