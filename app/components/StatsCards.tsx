"use client";

import { useTasks } from "@/app/context/TaskContext";
import { motion } from "framer-motion";
import { ListChecks, Clock, CheckCircle, AlertCircle } from "lucide-react";

export const StatsCards = () => {
    const { tasks } = useTasks();

    const stats = [
        {
            label: "Total Tasks",
            value: tasks.length,
            icon: ListChecks,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            label: "Completed",
            value: tasks.filter((t) => t.status.toLowerCase() === "completed").length,
            icon: CheckCircle,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            label: "Pending",
            value: tasks.filter((t) => t.status.toLowerCase() === "pending").length,
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
        {
            label: "Missed",
            value: tasks.filter((t) => t.status.toLowerCase() === "missed").length,
            icon: AlertCircle,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {stats.map((stat, idx) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass rounded-2xl p-4 flex flex-col items-center text-center sm:items-start sm:text-left gap-3"
                >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                        <stat.icon size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-black text-foreground">{stat.value}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
