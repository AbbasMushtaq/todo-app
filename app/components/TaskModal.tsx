"use client";

import { useEffect } from "react";
import { useTasks } from "@/app/context/TaskContext";
import { Task } from "@/app/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Tag } from "lucide-react";
import { cn } from "@/app/utils/cn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().max(500).optional(),
    deadline: z.string().min(1, "Deadline is required"),
    category: z.enum(["General", "Work", "Study", "Personal"]),
    priority: z.enum(["low", "medium", "high"]),
    status: z.enum(["PENDING", "COMPLETED", "MISSED"]).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
}

export const TaskModal = ({ isOpen, onClose, task }: TaskModalProps) => {
    const { addTask, updateTask } = useTasks();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            category: "General",
            priority: "medium",
            status: "PENDING",
        }
    });

    // Populate form when editing
    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description || "",
                deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "",
                category: task.category,
                priority: task.priority.toLowerCase() as any,
                status: task.status.toUpperCase() as any,
            });
        } else {
            reset({
                title: "",
                description: "",
                deadline: "",
                category: "General",
                priority: "medium",
                status: "PENDING",
            });
        }
    }, [task, reset, isOpen]);

    const onSubmit = async (data: TaskFormData) => {
        try {
            if (task) {
                await updateTask(task.id, data as any);
                toast.success("Task updated successfully!");
            } else {
                await addTask(data as any);
                toast.success("Task created successfully!");
            }
            onClose();
        } catch (error) {
            toast.error(task ? "Failed to update task" : "Failed to create task");
            console.error(error);
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] glass p-8 shadow-3xl dark:bg-slate-900 border border-white/20 dark:border-white/10"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black tracking-tight text-foreground dark:text-white">
                                {task ? "Update Task" : "New Task"}
                            </h2>
                            <button
                                onClick={onClose}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Task Title</label>
                                <input
                                    {...register("title")}
                                    type="text"
                                    autoFocus
                                    className={cn(
                                        "w-full rounded-2xl border border-border bg-background/50 px-5 py-4 text-lg font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-slate-800 dark:border-slate-700 dark:text-white",
                                        errors.title && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                                    )}
                                    placeholder="What needs to be done?"
                                />
                                {errors.title && <p className="text-xs font-bold text-rose-500 ml-1">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Description</label>
                                <textarea
                                    {...register("description")}
                                    className="w-full rounded-2xl border border-border bg-background/50 px-5 py-3 text-sm font-medium outline-none transition-all focus:border-primary min-h-[100px] resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    placeholder="Add more details..."
                                />
                                {errors.description && <p className="text-xs font-bold text-rose-500 ml-1">{errors.description.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2">
                                        <Calendar size={14} /> Deadline
                                    </label>
                                    <input
                                        {...register("deadline")}
                                        type="datetime-local"
                                        className={cn(
                                            "w-full rounded-2xl border border-border bg-background/50 px-5 py-3 text-sm font-medium outline-none transition-all focus:border-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white",
                                            errors.deadline && "border-rose-500"
                                        )}
                                    />
                                    {errors.deadline && <p className="text-xs font-bold text-rose-500 ml-1">{errors.deadline.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2">
                                        <Tag size={14} /> Category
                                    </label>
                                    <select
                                        {...register("category")}
                                        className="w-full rounded-2xl border border-border bg-background/50 px-5 py-3 text-sm font-medium outline-none transition-all focus:border-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    >
                                        <option value="General">General</option>
                                        <option value="Work">Work</option>
                                        <option value="Study">Study</option>
                                        <option value="Personal">Personal</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2">
                                        Priority
                                    </label>
                                    <select
                                        {...register("priority")}
                                        className="w-full rounded-2xl border border-border bg-background/50 px-5 py-3 text-sm font-medium outline-none transition-all focus:border-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                {task && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2">
                                            Status
                                        </label>
                                        <select
                                            {...register("status")}
                                            className="w-full rounded-2xl border border-border bg-background/50 px-5 py-3 text-sm font-medium outline-none transition-all focus:border-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="MISSED">Missed</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-2xl bg-primary py-4 text-lg font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                            >
                                {isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
