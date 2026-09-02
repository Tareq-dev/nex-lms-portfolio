"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import AnalyticsOverview from "@/components/analytics/AnalyticsOverview";

type TimeRange =
  | "Today"
  | "This Week"
  | "This Month"
  | "This Year";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] =
    useState<TimeRange>("This Month");

  const [isRefreshing, setIsRefreshing] =
    useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-100 p-6 dark:bg-zinc-950">
        
        {/* Top Header & Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Platform Analytics
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Monitor your revenue, course enrollments, and student success metrics.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={handleRefresh}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80"
            >
              <RefreshCw
                size={18}
                className={isRefreshing ? "animate-spin" : ""}
              />
            </button>

            <div className="relative flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              <Calendar
                size={16}
                className="mr-2 text-slate-400"
              />

              <select
                value={timeRange}
                onChange={(e) =>
                  setTimeRange(e.target.value as TimeRange)
                }
                className="bg-transparent pr-2 outline-none  cursor-pointer"
              >
                <option className="text-black" value="Today">Today</option>
                <option className="text-black" value="This Week">This Week</option>
                <option className="text-black" value="This Month">This Month</option>
                <option className="text-black" value="This Year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Analytics Main Dashboard View */}
        <AnalyticsOverview timeRange={timeRange} />
      </div>
    </DashboardLayout>
  );
}