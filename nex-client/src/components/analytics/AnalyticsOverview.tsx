"use client";

import {
  TrendingUp,
  DollarSign,
  Users,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Award,
} from "lucide-react";

type TimeRange = "Today" | "This Week" | "This Month" | "This Year";

interface AnalyticsOverviewProps {
  timeRange: TimeRange;
}

interface TopCourse {
  title: string;
  sales: number;
  revenue: string;
  rate: number;
}

function AnalyticsOverview({ timeRange }: AnalyticsOverviewProps) {
  
  const topCourses: TopCourse[] = [
    {
      title: "Next.js Premium Course",
      sales: 148,
      revenue: "৳740,000",
      rate: 85,
    },
    {
      title: "MERN Stack Web Development",
      sales: 122,
      revenue: "৳549,000",
      rate: 72,
    },
    {
      title: "UI/UX Design with Figma",
      sales: 64,
      revenue: "৳192,000",
      rate: 40,
    },
    {
      title: "Python & Machine Learning",
      sales: 41,
      revenue: "৳164,000",
      rate: 28,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Core Financial & Traffic Metrics Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>

            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <DollarSign size={18} />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              ৳1,645,000
            </span>

            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight size={14} className="mr-0.5" /> +12.5%
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            vs previous {timeRange.toLowerCase()}
          </p>
        </div>

        {/* Total Enrollments */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Course Sold
            </span>

            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <BookOpen size={18} />
            </div>
          </div>

          <div className="mt-4 items-baseline flex gap-2">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              375
            </span>

            <span className="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400">
              <ArrowUpRight size={14} className="mr-0.5" /> +8.2%
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            New premium users joined
          </p>
        </div>

        {/* Active Students Online */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Learners
            </span>

            <div className="rounded-xl bg-violet-50 p-2 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              <Users size={18} />
            </div>
          </div>

          <div className="mt-4 items-baseline flex gap-2">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              2,840
            </span>

            <span className="inline-flex items-center text-xs font-semibold text-rose-600 dark:text-rose-400">
              <ArrowDownRight size={14} className="mr-0.5" /> -1.4%
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Daily active system users
          </p>
        </div>

        {/* Conversion Rate */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Conversion Rate
            </span>

            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <TrendingUp size={18} />
            </div>
          </div>

          <div className="mt-4 items-baseline flex gap-2">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              4.8%
            </span>

            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight size={14} className="mr-0.5" /> +0.6%
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Visitors to premium conversion
          </p>
        </div>
      </div>

      {/* 2. Graphical Presentation Mock & Leaderboard row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Performance Monthly Analytics Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Sales Overview
              </h3>

              <p className="text-xs text-slate-400">
                Visual growth of previous months sales revenue
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                Sales
              </div>
            </div>
          </div>

          {/* Bar Diagram Visualized using pure CSS/Tailwind */}
          <div className="mt-8 flex h-48 items-end gap-3 px-2 border-b border-slate-100 dark:border-zinc-800 pb-1">
            {[
              { label: "Jan", height: "h-[30%]" },
              { label: "Feb", height: "h-[45%]" },
              { label: "Mar", height: "h-[40%]" },
              { label: "Apr", height: "h-[65%]" },
              { label: "May", height: "h-[85%]" },
              { label: "Jun", height: "h-[95%]", active: true },
            ].map((bar, index) => (
              <div
                key={index}
                className="group flex flex-1 flex-col items-center gap-2 h-full justify-end"
              >
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80 ${
                    bar.active
                      ? "bg-gradient-to-t from-blue-600 to-indigo-500"
                      : "bg-slate-200 dark:bg-zinc-800"
                  } ${bar.height}`}
                ></div>

                <span className="text-xs font-semibold text-slate-400">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Courses Ranking Board */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-5 flex items-center gap-2">
            <Award size={18} className="text-amber-500" />

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Top Selling Courses
            </h3>
          </div>

          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-zinc-300 max-w-[180px] truncate">
                    {index + 1}. {course.title}
                  </span>

                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {course.revenue}
                  </span>
                </div>

                {/* Custom Tailwind Progress Bar */}
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${course.rate}%` }}
                  ></div>
                </div>

                <div className="text-[10px] text-slate-400 text-right">
                  {course.sales} enrollments
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsOverview;
