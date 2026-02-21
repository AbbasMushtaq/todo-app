"use client";

import { Task, Category, Priority } from "@/app/types";
import { useTasks } from "@/app/context/TaskContext";
import { motion } from "framer-motion";
import {
    Calendar,
    Trash2,
    CheckCircle2,
    Circle,
    AlertCircle,
    Clock,
    Briefcase,
    GraduationCap,
    UserCircle,
    Inbox,
    Pencil,
    CalendarDays
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/app/utils/cn";

const priorityStyles: Record<string, string> = {
    low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    high: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    LOW: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    MEDIUM: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    HIGH: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

const categoryIcons = {
    General: Inbox,
    Work: Briefcase,
    Study: GraduationCap,
    Personal: UserCircle,
};

interface TaskCardProps {
    task: Task;
    provided?: any; // For drag and drop
    onEdit?: () => void;
}

export const TaskCard = ({ task, provided, onEdit }: TaskCardProps) => {
    const { deleteTask, toggleComplete } = useTasks();
    const CategoryIcon = categoryIcons[task.category as keyof typeof categoryIcons] || Inbox;
    const isMissed = task.status.toLowerCase() === "missed";
    const isCompleted = task.status.toLowerCase() === "completed";

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTask(task.id);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            {...provided?.draggableProps}
            {...provided?.dragHandleProps}
            ref={provided?.innerRef}
            className={cn(
                "glass group relative overflow-hidden rounded-2xl p-5 transition-all hover:shadow-xl",
                isCompleted && "opacity-80 grayscale-[0.2]",
                isMissed && "border-rose-500/30 bg-rose-500/5"
            )}
        >
            {/* Status Indicator Bar */}
            <div
                className={cn(
                    "absolute left-0 top-0 bottom-0 w-1",
                    task.priority.toLowerCase() === "high" ? "bg-rose-500" :
                        task.priority.toLowerCase() === "medium" ? "bg-amber-500" : "bg-emerald-500"
                )}
            />

            <div className="flex items-start justify-between gap-2">
                <div className="flex gap-4 flex-1 min-w-0">
                    <button
                        onClick={() => toggleComplete(task.id)}
                        className={cn(
                            "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                            isCompleted
                                ? "border-primary bg-primary text-white"
                                : "border-muted-foreground/30 hover:border-primary"
                        )}
                    >
                        {isCompleted && <CheckCircle2 size={16} />}
                    </button>

                    <div className="min-w-0 flex-1">
                        <h3 className={cn(
                            "text-lg font-bold leading-tight text-foreground dark:text-white truncate",
                            isCompleted && "line-through text-muted-foreground"
                        )}>
                            {task.title}
                        </h3>

                        {task.description && (
                            <p className="mt-1 text-sm text-muted-foreground dark:text-slate-400 line-clamp-2">
                                {task.description}
                            </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className={cn(
                                "flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                priorityStyles[task.priority]
                            )}>
                                <AlertCircle size={10} />
                                {task.priority}
                            </span>

                            <span className="flex items-center gap-1 rounded-full bg-muted/50 dark:bg-slate-800/50 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground dark:text-slate-300 border border-border dark:border-slate-700">
                                <CategoryIcon size={10} />
                                {task.category}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onEdit}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all active:scale-90"
                        title="Update Task"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground bg-muted/50 hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                        title="Delete Task"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-border dark:border-slate-700 pt-4">
                <div className={cn(
                    "flex items-center justify-between gap-2 text-[10px] font-medium",
                    isMissed ? "text-rose-500" : "text-muted-foreground dark:text-slate-400"
                )}>
                    <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>
                            {isMissed ? "Missed" : isCompleted ? "Completed" : "Due"} {format(parseISO(task.deadline), "MMM d, yyyy - h:mm a")}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-60">
                        <CalendarDays size={10} />
                        <span>Created {format(parseISO(task.createdAt), "MMM d, yyyy")}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {isCompleted ? (
                            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400">
                                <CheckCircle2 size={12} />
                                DONE
                            </div>
                        ) : isMissed ? (
                            <div className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-2 py-1 text-[10px] font-bold text-rose-500 dark:bg-rose-500/20 dark:text-rose-400">
                                <AlertCircle size={12} />
                                OVERDUE
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                                <Clock size={12} />
                                PENDING
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => toggleComplete(task.id)}
                        className="text-[10px] font-bold text-primary hover:underline"
                    >
                        {isCompleted ? "Mark Pending" : "Mark Complete"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
