"use client";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <TaskProvider>
                    <Toaster richColors position="bottom-right" />
                    {children}
                </TaskProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
