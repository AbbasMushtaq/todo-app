"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Task } from "../types";
import { useAuth } from "./AuthContext";

interface TaskContextType {
    tasks: Task[];
    addTask: (task: Omit<Task, "id" | "status" | "createdAt" | "order">) => Promise<void>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleComplete: (id: string) => Promise<void>;
    reorderTasks: (reorderedTasks: Task[]) => Promise<void>;
    isLoading: boolean;
    refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    const fetchTasks = useCallback(async () => {
        if (!isAuthenticated) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/tasks");
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const addTask = async (taskData: Omit<Task, "id" | "status" | "createdAt" | "order">) => {
        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
            });
            if (res.ok) {
                const newTask = await res.json();
                setTasks((prev) => [newTask, ...prev]);
            }
        } catch (error) {
            console.error("Failed to add task", error);
        }
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const updatedTask = await res.json();
                setTasks((prev) =>
                    prev.map((task) => (task.id === id ? updatedTask : task))
                );
            }
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };

    const deleteTask = async (id: string) => {
        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setTasks((prev) => prev.filter((task) => task.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    const toggleComplete = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const newStatus = task.status.toLowerCase() === "completed" ? "PENDING" : "COMPLETED";
        await updateTask(id, { status: newStatus as any });
    };

    const reorderTasks = async (reorderedTasks: Task[]) => {
        // Optimistic update
        const previousTasks = [...tasks];
        setTasks(reorderedTasks);

        try {
            const res = await fetch("/api/tasks", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tasks: reorderedTasks.map((t, index) => ({ id: t.id, order: index })),
                }),
            });
            if (!res.ok) {
                setTasks(previousTasks);
            }
        } catch (error) {
            console.error("Failed to reorder tasks", error);
            setTasks(previousTasks);
        }
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                addTask,
                updateTask,
                deleteTask,
                toggleComplete,
                reorderTasks,
                isLoading,
                refreshTasks: fetchTasks,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error("useTasks must be used within a TaskProvider");
    }
    return context;
}
