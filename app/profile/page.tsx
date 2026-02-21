"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useTasks } from "@/app/context/TaskContext";
import { motion } from "framer-motion";
import { User, Mail, Shield, Settings, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
    const { user } = useAuth();
    const { tasks } = useTasks();

    if (!user) return null;

    const completedCount = tasks.filter(t => t.status.toLowerCase() === 'completed').length;
    const pendingCount = tasks.filter(t => t.status.toLowerCase() === 'pending').length;
    const missedCount = tasks.filter(t => t.status.toLowerCase() === 'missed').length;

    const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    }) : "Recently";

    return (
        <div className="pt-8 max-w-4xl mx-auto space-y-8 pb-12">
            <h1 className="text-4xl font-black tracking-tight text-foreground dark:text-white">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - User Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:col-span-1"
                >
                    <div className="glass rounded-[2rem] p-8 flex flex-col items-center text-center shadow-2xl dark:bg-slate-900/50">
                        <div className="relative mb-6">
                            <div className="h-24 w-24 overflow-hidden rounded-3xl border-4 border-primary/20 bg-muted dark:bg-slate-800">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-primary">
                                        <User size={40} />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg border-2 border-background dark:border-slate-900">
                                <Shield size={16} />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-foreground dark:text-white">{user.name}</h2>
                        <p className="text-muted-foreground dark:text-slate-400 mb-6 flex items-center justify-center gap-2">
                            <Mail size={14} />
                            {user.email}
                        </p>

                        <button className="w-full rounded-2xl bg-muted dark:bg-slate-800 py-3 text-sm font-bold text-foreground dark:text-slate-200 transition-all hover:bg-muted/80 dark:hover:bg-slate-700 flex items-center justify-center gap-2">
                            <Settings size={18} />
                            Edit Profile
                        </button>
                    </div>
                </motion.div>

                {/* Right Column - Stats & Activity */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:col-span-2 space-y-6"
                >
                    <div className="glass rounded-[2rem] p-8 shadow-xl dark:bg-slate-900/50">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground dark:text-white">
                            <CheckCircle size={20} className="text-primary" />
                            Performance Overview
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 p-4">
                                <p className="text-xs font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest mb-1">Productivity</p>
                                <p className="text-3xl font-black text-foreground dark:text-white">
                                    {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
                                </p>
                                <p className="text-xs text-muted-foreground dark:text-slate-400 mt-2">Tasks completed</p>
                            </div>
                            <div className="rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 dark:border-amber-500/20 p-4">
                                <p className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest mb-1">On Deck</p>
                                <p className="text-3xl font-black text-foreground dark:text-white">{pendingCount}</p>
                                <p className="text-xs text-muted-foreground dark:text-slate-400 mt-2">Currently active</p>
                            </div>
                            <div className="rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 dark:border-rose-500/20 p-4">
                                <p className="text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-1">Missed</p>
                                <p className="text-3xl font-black text-foreground dark:text-white">{missedCount}</p>
                                <p className="text-xs text-muted-foreground dark:text-slate-400 mt-2">Deadline passed</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-[2rem] p-8 shadow-xl dark:bg-slate-900/50">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground dark:text-white">
                            <Clock size={20} className="text-primary" />
                            Account Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-border dark:border-slate-800">
                                <span className="text-muted-foreground dark:text-slate-400">Member Since</span>
                                <span className="font-semibold text-foreground dark:text-white">{joinDate}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-border dark:border-slate-800">
                                <span className="text-muted-foreground dark:text-slate-400">Account Type</span>
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">PRO PLAN</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-muted-foreground dark:text-slate-400">Notification Settings</span>
                                <span className="text-primary hover:underline cursor-pointer text-sm font-semibold">Manage</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
