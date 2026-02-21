"use client";

import { useState } from "react";
import { useTasks } from "@/app/context/TaskContext";
import { StatsCards } from "@/app/components/StatsCards";
import { TaskModal } from "@/app/components/TaskModal";
import { TaskCard } from "@/app/components/TaskCard";
import { Category, Status, Task } from "@/app/types";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, Search, Filter, SlidersHorizontal, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/utils/cn";

export default function DashboardPage() {
    const { tasks, reorderTasks, isLoading } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
    const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    // Filter tasks
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || task.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesCategory = categoryFilter === "all" || task.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(tasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        reorderTasks(items);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pt-8 pb-12 text-foreground">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground dark:text-white">Dashboard</h1>
                    <p className="text-muted-foreground dark:text-slate-400 mt-1">Manage your tasks and keep productivity high.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingTask(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-lg font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus size={24} />
                    <span>Add New Task</span>
                </button>
            </div>

            {/* Stats */}
            <StatsCards />

            {/* Filters Bar */}
            <div className="glass rounded-3xl p-4 flex flex-col lg:flex-row gap-4 dark:bg-slate-900/50 border border-white/20 dark:border-white/10">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-2xl border border-border dark:border-slate-700 bg-background/50 dark:bg-slate-800/50 py-3 pl-12 pr-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-foreground dark:text-white transition-all placeholder:text-muted-foreground/50"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 rounded-2xl border border-border dark:border-slate-700 bg-background/50 dark:bg-slate-800/50 px-3 py-2">
                        <Filter size={18} className="text-muted-foreground dark:text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
                            className="bg-transparent text-sm font-medium outline-none text-foreground dark:text-white [&>option]:bg-background dark:[&>option]:bg-slate-900"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="missed">Missed</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border border-border dark:border-slate-700 bg-background/50 dark:bg-slate-800/50 px-3 py-2">
                        <SlidersHorizontal size={18} className="text-muted-foreground dark:text-slate-400" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value as Category | "all")}
                            className="bg-transparent text-sm font-medium outline-none text-foreground dark:text-white [&>option]:bg-background dark:[&>option]:bg-slate-900"
                        >
                            <option value="all">All Categories</option>
                            <option value="General">General</option>
                            <option value="Work">Work</option>
                            <option value="Study">Study</option>
                            <option value="Personal">Personal</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tasks List with DND */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px]"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided) => (
                                                <TaskCard
                                                    task={task}
                                                    provided={provided}
                                                    onEdit={() => handleEditTask(task)}
                                                />
                                            )}
                                        </Draggable>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                                    >
                                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-muted-foreground dark:bg-slate-800 dark:text-slate-400">
                                            <Inbox size={40} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground dark:text-white">No tasks found</h3>
                                        <p className="text-muted-foreground dark:text-slate-400">Try adjusting your filters or create a new task!</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Add Task Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                task={editingTask}
            />
        </div>
    );
}
