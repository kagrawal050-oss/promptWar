'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ChefHat, Wallet, ShoppingCart, CalendarRange } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between relative overflow-hidden bg-background">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* Floating Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
            <ChefHat className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-clip-text text-foreground">
            Cooking To-Do <span className="text-primary">AI</span>
          </span>
        </div>
        <Link
          href="/dashboard"
          className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/20 transition flex items-center gap-1.5"
        >
          Open App <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 md:py-24 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary border border-border text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span>Smart AI Meal Planner</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-foreground">
              Cook Smarter. Spend Less.<br />
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                Save Time Every Day.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground font-medium leading-relaxed">
              Craft personalized cooking schedules, budget-calibrated grocery lists, and interactive step-by-step prep timelines tailored to your available ingredients and health goals.
            </p>
          </motion.div>

          {/* Call To Actions */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-md rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] hover:opacity-95 transition"
            >
              Start Meal Planning <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Feature Grid Widgets */}
          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-12 md:pt-16"
          >
            {[
              {
                icon: <ChefHat className="w-5 h-5 text-amber-500" />,
                title: 'Custom Meal Engine',
                desc: 'Tailored recipes matching your exact dietary preferences and allergies.'
              },
              {
                icon: <Wallet className="w-5 h-5 text-emerald-500" />,
                title: 'Budget Scaling',
                desc: 'Estimated ingredient costs compared to your daily limit with savings advice.'
              },
              {
                icon: <ShoppingCart className="w-5 h-5 text-sky-500" />,
                title: 'Smart Grocery Lists',
                desc: 'Auto-filtered shopping checklists excluding items already in your pantry.'
              },
              {
                icon: <CalendarRange className="w-5 h-5 text-indigo-500" />,
                title: 'Interactive Timeline',
                desc: 'Chronological schedules with completion logs saved in local storage.'
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-card text-card-foreground border border-border p-5 rounded-2xl text-left hover:border-primary/30 transition-all hover:shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-border text-center text-xs text-muted-foreground relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          &copy; {new Date().getFullYear()} Cooking To-Do List AI. Built for premium kitchen efficiency.
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="hover:text-primary transition font-semibold">Dashboard</Link>
          <a href="#" className="hover:text-primary transition font-semibold">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition font-semibold">Vercel Deploy Ready</a>
        </div>
      </footer>
    </div>
  );
}
