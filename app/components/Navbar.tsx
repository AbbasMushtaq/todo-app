"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";
import {
    LayoutDashboard,
    User as UserIcon,
    LogOut,
    Sun,
    Moon,
    Menu,
    X,
    CheckSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/utils/cn";

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Profile", href: "/profile", icon: UserIcon },
    ];

    if (!isAuthenticated) return null;

    return (
        <nav className="sticky top-0 z-50 w-full px-4 py-3 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="glass rounded-2xl px-4 py-3 md:px-6">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-110">
                                <CheckSquare size={24} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                Task<span className="text-primary">Master</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center gap-1 md:flex">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={cn(
                                            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <Icon size={18} />
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="hidden items-center gap-2 md:flex border-l border-border pl-4">
                            <button
                                onClick={toggleTheme}
                                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center gap-2 md:hidden">
                            <button
                                onClick={toggleTheme}
                                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground"
                            >
                                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Content */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute left-4 right-4 mt-2 overflow-hidden rounded-2xl glass p-4 shadow-2xl md:hidden"
                        >
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={cn(
                                                "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all",
                                                isActive
                                                    ? "bg-primary text-white"
                                                    : "text-muted-foreground hover:bg-muted"
                                            )}
                                        >
                                            <Icon size={20} />
                                            {link.name}
                                        </Link>
                                    );
                                })}
                                <hr className="my-2 border-border" />
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-destructive hover:bg-destructive/10 transition-all"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
