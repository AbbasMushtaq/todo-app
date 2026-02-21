"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, AuthState } from "../types";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType extends AuthState {
    login: (user: User) => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });
    const router = useRouter();
    const pathname = usePathname();

    const checkAuth = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const user = await res.json();
                setState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                setState({ user: null, isAuthenticated: false, isLoading: false });
            }
        } catch (error) {
            console.error("Auth check failed", error);
            setState({ user: null, isAuthenticated: false, isLoading: false });
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Protected route check
    useEffect(() => {
        if (!state.isLoading) {
            const publicRoutes = ["/login", "/signup", "/"];
            // If not authenticated and trying to access protected route
            if (!state.isAuthenticated && !publicRoutes.includes(pathname)) {
                router.push("/login");
            }
            // If authenticated and trying to access login/signup
            if (state.isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
                router.push("/dashboard");
            }
        }
    }, [state.isAuthenticated, state.isLoading, pathname, router]);

    const login = (user: User) => {
        setState({
            user,
            isAuthenticated: true,
            isLoading: false,
        });
        router.push("/dashboard");
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
            router.push("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
