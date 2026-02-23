"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, ExternalLink, Heart, Code2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-20 pb-10 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="glass rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative"
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                        {/* Developer Profile Section */}
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative group"
                            >
                                <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative h-24 w-24 rounded-2xl overflow-hidden glass border-2 border-white/20 shadow-2xl">
                                    <Image
                                        src="/Abbas-dp.jpeg"
                                        alt="Abbas Mushtaq"
                                        fill
                                        className="object-cover z-20"
                                        priority
                                    />
                                    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 z-10">
                                        <Code2 size={40} className="text-primary/50" />
                                    </div>
                                </div>
                            </motion.div>

                            <div>
                                <h3 className="text-2xl font-black tracking-tight text-foreground dark:text-white mb-2">
                                    Abbas Mushtaq
                                </h3>
                                <p className="text-muted-foreground dark:text-slate-400 font-medium mb-4 max-w-md">
                                    Full Stack Developer & Designer. Building refined digital experiences with modern technology.
                                </p>
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <Link
                                        href="https://github.com/AbbasMushtaq"
                                        target="_blank"
                                        className="p-3 rounded-xl glass hover:bg-primary hover:text-white transition-all duration-300 group"
                                    >
                                        <Github size={20} className="group-hover:scale-110 transition-transform" />
                                    </Link>
                                    <Link
                                        href="https://linkedin.com/in/abbasmushtaq"
                                        target="_blank"
                                        className="p-3 rounded-xl glass hover:bg-primary hover:text-white transition-all duration-300 group"
                                    >
                                        <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                                    </Link>
                                    <Link
                                        href="https://abbasmushtaq.me"
                                        target="_blank"
                                        className="p-3 rounded-xl glass hover:bg-primary hover:text-white transition-all duration-300 group"
                                    >
                                        <ExternalLink size={20} className="group-hover:scale-110 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Credits / Navigation Section */}
                        <div className="flex flex-col items-center md:items-end gap-6 text-center md:text-right">
                            <div className="space-y-2">
                                <p className="text-sm font-bold uppercase tracking-widest text-primary/60">
                                    Developed With
                                </p>
                                <div className="flex items-center gap-4 text-muted-foreground dark:text-slate-400 font-bold">
                                    <span>Next.js 15</span>
                                    <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                    <span>Tailwind CSS</span>
                                    <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                    <span>Prisma</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border/50 w-full md:w-auto">
                                <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-end gap-1.5">
                                    © {currentYear} TaskMaster. Made with
                                    <Heart size={14} className="text-rose-500 fill-rose-500" />
                                    by Abbas Mushtaq
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
