'use client';

import React from 'react';
import { CheckSquare, Square, Calendar, Flame, Coffee, Utensils, ClipboardCheck } from 'lucide-react';
import { TimelineTask } from '@/types';

interface TimelineTodoProps {
  tasks: TimelineTask[];
  onToggleTask: (taskId: string) => void;
}

export default function TimelineTodo({ tasks, onToggleTask }: TimelineTodoProps) {
  const completedCount = tasks.filter(t => t.checked).length;
  const totalCount = tasks.length;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getMealIcon = (type: TimelineTask['mealType']) => {
    switch (type) {
      case 'Breakfast':
        return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'Lunch':
        return <Utensils className="w-4 h-4 text-orange-500" />;
      case 'Dinner':
        return <Flame className="w-4 h-4 text-indigo-500" />;
      default:
        return <ClipboardCheck className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Daily Cooking Schedule
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Follow your personalized timeline to prep and cook efficiently.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-semibold text-muted-foreground block">Progress</span>
            <span className="text-sm font-bold text-foreground">
              {completedCount} of {totalCount} ({percentComplete}%)
            </span>
          </div>
          <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center relative">
            {/* Simple circular indicator */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-border fill-transparent"
                strokeWidth="4"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-primary fill-transparent"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - percentComplete / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-bold text-foreground">{percentComplete}%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar (Linear) */}
      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mb-6 border border-border/50">
        <div 
          className="bg-primary h-full rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      {/* Checklist Timeline */}
      <div className="space-y-4 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            onClick={() => onToggleTask(task.id)}
            className="flex items-start gap-4 group cursor-pointer relative z-10 select-none"
          >
            {/* Circle Node on the timeline */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition shrink-0 ${
              task.checked 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'bg-card border-border text-muted-foreground group-hover:border-primary/50'
            }`}>
              {getMealIcon(task.mealType)}
            </div>

            {/* Checkbox and Text Container */}
            <div className={`flex-1 p-4 rounded-xl border transition flex items-center gap-3 ${
              task.checked
                ? 'bg-muted/30 border-border text-muted-foreground'
                : 'bg-background border-border text-foreground hover:bg-muted/10 group-hover:border-primary/30'
            }`}>
              <div className="shrink-0">
                {task.checked ? (
                  <CheckSquare className="w-5 h-5 text-primary" />
                ) : (
                  <Square className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
                )}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider block text-primary/80 mb-0.5">
                  {task.time}
                </span>
                <p className={`text-sm font-medium leading-normal ${task.checked ? 'line-through text-muted-foreground/80' : 'text-foreground'}`}>
                  {task.action}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
