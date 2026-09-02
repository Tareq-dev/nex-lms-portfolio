"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import ActivityTable from "@/components/dashboard/ActivityTable";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  TrendingUp,
  Users,
  GraduationCap,
  DollarSign,
  Activity,
} from "lucide-react";

// Analytics data structure
interface AnalyticsData {
  name: string;
  Revenue: number;
  Enrollments: number;
}

 
const analyticsData: AnalyticsData[] = [
  { name: "Jan", Revenue: 4000, Enrollments: 240 },
  { name: "Feb", Revenue: 7000, Enrollments: 398 },
  { name: "Mar", Revenue: 5000, Enrollments: 500 },
  { name: "Apr", Revenue: 12000, Enrollments: 780 },
  { name: "May", Revenue: 18000, Enrollments: 1020 },
  { name: "Jun", Revenue: 24000, Enrollments: 1245 },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/60 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 space-y-8 transition-colors duration-300">
        
        
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 dark:border-zinc-800/60 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-white dark:via-zinc-200 dark:to-zinc-500 bg-clip-text">
              Instructor Intelligence Studio
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
              Real-time LMS performance, financial metrics, and student cognitive tracking.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-slate-200/80 dark:border-zinc-800 px-3 py-2 rounded-xl shadow-xs shrink-0 self-start sm:self-center">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live System Pulse
          </div>
        </div>

         
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value="1,245"
            change="+12.3%"
            icon={<Users size={20} />}
            trend="up"
          />

          <StatCard
            title="Total Courses"
            value="32"
            change="+4 new"
            icon={<GraduationCap size={20} />}
            trend="up"
          />

          <StatCard
            title="Revenue Stream"
            value="$24,000"
            change="+28.4%"
            icon={<DollarSign size={20} />}
            trend="up"
          />

          <StatCard
            title="Active Retention"
            value="845"
            change="-2.1%"
            icon={<Activity size={20} />}
            trend="down"
          />
        </div>

     
        <div className="bg-white dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl p-5 sm:p-6 shadow-xs backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-500" />
                Platform Growth Core
              </h3>

              <p className="text-xs text-slate-400 mt-0.5">
                Gross revenue mapped against student enrollment index.
              </p>
            </div>
          </div>

          <div className="h-[300px] w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analyticsData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#4f46e5"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="#4f46e5"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient
                    id="colorEnrollments"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#06b6d4"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="#06b6d4"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                  className="dark:stroke-zinc-800/40"
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tickLine={false}
                />

                <YAxis
                  stroke="#94a3b8"
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderRadius: "16px",
                    border: "none",
                    color: "#fff",
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />

                <Area
                  type="monotone"
                  dataKey="Enrollments"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorEnrollments)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

       
        <div className="animate-in fade-in duration-300">
          <ActivityTable />
        </div>
      </div>
    </DashboardLayout>
  );
}