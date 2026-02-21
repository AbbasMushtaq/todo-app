"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckSquare, ArrowRight, Shield, Zap, Sparkles, Layout } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center pt-20 pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-md">
          <Sparkles size={16} />
          <span>Experience productivity like never before</span>
        </div>

        <h1 className="mb-6 text-5xl font-black tracking-tight text-foreground md:text-7xl">
          Master Your Day with <span className="text-primary">TaskMaster</span>
        </h1>

        <p className="mb-10 text-xl text-muted-foreground md:text-2xl leading-relaxed max-w-2xl mx-auto">
          A premium, glass-morphic productivity tool designed for builders, creators, and professionals who demand the best.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
          <Link
            href="/signup"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <span>Start Building Now</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-2xl border border-border bg-background/50 px-8 py-4 text-lg font-bold text-foreground backdrop-blur-md transition-all hover:bg-muted"
          >
            Welcome Back
          </Link>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {[
          {
            title: "Intuitive UI",
            desc: "Beautiful glassmorphism design that stays out of your way while you work.",
            icon: Layout,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
          },
          {
            title: "Smart Filters",
            desc: "Locate mission-critical tasks in seconds with advanced categorizing and search.",
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
          },
          {
            title: "Secure & Fast",
            desc: "Built with the latest Next.js 14 features for blazing fast performance and local security.",
            icon: Shield,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
          }
        ].map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
            className="glass relative overflow-hidden rounded-3xl p-8 group transition-transform hover:-translate-y-2"
          >
            <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} ${feature.color}`}>
              <feature.icon size={28} />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-foreground">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Dashboard Mockup Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-32 w-full max-w-6xl px-4"
      >
        <div className="glass aspect-[16/10] w-full rounded-[2.5rem] border-8 border-white/5 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent flex items-center justify-center shadow-3xl">
          <div className="flex flex-col items-center gap-4 opacity-50">
            <CheckSquare size={64} className="text-primary animate-pulse" />
            <span className="text-xl font-medium tracking-widest uppercase">The Future of Productivity</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
