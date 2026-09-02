"use client";

import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 antialiased selection:bg-indigo-500 selection:text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-slate-200 dark:bg-zinc-950 no-scrollbar">
        <Navbar />

        <div className="p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in-50 slide-in-from-bottom-3 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}