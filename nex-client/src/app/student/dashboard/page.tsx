"use client";

import { useState } from "react";

import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  FileText,
  Sparkles,
  Trophy,
  Video,
  Zap,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import type {
  LeaderboardStudent,
  RoutineItem,
  StudentAssignment,
  StudentCourse,
  StudentDashboardTab,
  StudentProfile,
} from "@/types/studentDashboard";

const STUDENT_PROFILE: StudentProfile = {
  name: "Alex Mercer",
  batch: "Cohort 02 (Premium Alpha)",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  overallProgress: 68,
  rank: 4,
  points: 2450,
};

const MY_COURSES: readonly StudentCourse[] = [
  {
    id: 1,
    title: "Next.js 14 Ultra-Posh Development",
    instructor: "Jhankar Mahbub",
    progress: 71,
    glowColor: "from-indigo-500 to-violet-500",
    shadow: "shadow-indigo-500/10",
    totalModules: 45,
    completedModules: 32,
  },
  {
    id: 2,
    title: "Tailwind CSS Advanced Mechanics",
    instructor: "Sumit Saha",
    progress: 90,
    glowColor: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/10",
    totalModules: 20,
    completedModules: 18,
  },
];

const ASSIGNMENTS: readonly StudentAssignment[] = [
  {
    id: 1,
    title: "Build a Glassmorphic SaaS Dashboard",
    deadline: "June 20",
    status: "Pending",
    marks: "Pending",
  },
  {
    id: 2,
    title: "Multi-Layer Context API Filter Integration",
    deadline: "Passed",
    status: "Completed",
    marks: "95/100",
  },
  {
    id: 3,
    title: "Prisma Orchestration & Schema Design",
    deadline: "Passed",
    status: "Completed",
    marks: "88/100",
  },
];

const CLASS_ROUTINE: readonly RoutineItem[] = [
  {
    id: 1,
    topic: "Next.js Server Actions & Optimistic Updates",
    date: "Tonight",
    time: "09:00 PM",
    isLive: true,
  },
  {
    id: 2,
    topic: "Advanced Framer Motion & Layout Animations",
    date: "June 16",
    time: "09:00 PM",
    isLive: false,
  },
];

const LEADERBOARD: readonly LeaderboardStudent[] = [
  {
    rank: 1,
    name: "Naimur Rahman",
    points: 2900,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Naimur",
  },
  {
    rank: 2,
    name: "Sadia Afrin",
    points: 2750,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sadia",
  },
  {
    rank: 3,
    name: "Tanvir Hossain",
    points: 2600,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir",
  },
  {
    rank: 4,
    name: "Alex Mercer (You)",
    points: 2450,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    isUser: true,
  },
];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<StudentDashboardTab>("routine");

  const pendingAssignmentCount = ASSIGNMENTS.filter(
    (assignment) => assignment.status === "Pending",
  ).length;

  const handleTabChange = (tab: StudentDashboardTab): void => {
    setActiveTab(tab);
  };

  return (
    <DashboardLayout>
      <div className="relative mx-auto w-full max-w-7xl space-y-8 animate-in antialiased duration-500 fade-in zoom-in-98">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute left-[10%] top-[-5%] h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] dark:bg-indigo-500/10" />

        <div className="pointer-events-none absolute bottom-[10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[120px] dark:bg-purple-500/10" />

        {/* Student profile */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-xs backdrop-blur-md dark:border-zinc-800/80 dark:from-zinc-900/40 dark:to-zinc-950/60">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 opacity-40 blur-md" />

                <img
                  src={STUDENT_PROFILE.avatar}
                  alt={`${STUDENT_PROFILE.name}'s avatar`}
                  className="relative z-10 h-14 w-14 rounded-2xl border bg-white p-0.5 dark:border-zinc-700 dark:bg-zinc-900"
                />

                <span className="absolute -bottom-1 -right-1 z-20 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-900" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-slate-900 dark:text-white">
                    Hi, {STUDENT_PROFILE.name}
                  </h1>

                  <Sparkles
                    size={16}
                    className="animate-pulse text-amber-500"
                  />
                </div>

                <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  {STUDENT_PROFILE.batch}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-wrap gap-4 md:w-auto">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/40 bg-white/80 px-4 py-2.5 shadow-2xs dark:border-zinc-800/60 dark:bg-zinc-950/60">
                <div className="space-y-0.5">
                  <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Leaderboard
                  </span>

                  <span className="text-base font-black text-slate-900 dark:text-white">
                    Rank #{STUDENT_PROFILE.rank}
                  </span>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <Trophy size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Progress */}
          <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-2xs dark:border-zinc-800/60 dark:bg-zinc-900/20">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Syllabus Sync
              </span>

              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <Zap size={16} className="fill-current" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {STUDENT_PROFILE.overallProgress}%
              </h2>

              <span className="text-xs font-medium text-emerald-500">
                On Track
              </span>
            </div>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-950">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                style={{
                  width: `${STUDENT_PROFILE.overallProgress}%`,
                }}
              />
            </div>
          </div>

          {/* Active courses */}
          <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-2xs dark:border-zinc-800/60 dark:bg-zinc-900/20">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Active Cohorts
              </span>

              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <BookOpen size={16} />
              </div>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {MY_COURSES.length} Courses
            </h2>

            <p className="mt-2 text-xs font-medium text-slate-400 dark:text-zinc-500">
              Access unlocked to premium masterclasses
            </p>
          </div>

          {/* Pending assignments */}
          <div className="rounded-3xl border border-slate-200/50 bg-white p-6 shadow-2xs sm:col-span-2 lg:col-span-1 dark:border-zinc-800/60 dark:bg-zinc-900/20">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Pending Desk
              </span>

              <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                <Clock size={16} />
              </div>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-rose-500 dark:text-rose-400">
              {pendingAssignmentCount} Tasks
            </h2>

            <p className="mt-2 text-xs font-medium text-slate-400 dark:text-zinc-500">
              Action required before token expiration
            </p>
          </div>
        </div>

        {/* Main dashboard grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left section */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center gap-2 px-1 text-slate-400">
              <Compass size={14} className="text-indigo-500" />

              <h3 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">
                Enrolled Courses
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {MY_COURSES.map((course) => (
                <div
                  key={course.id}
                  className={`group relative flex h-48 flex-col justify-between rounded-2xl border border-slate-200/50 bg-white p-5 shadow-xs transition-all duration-300 hover:scale-[1.01] dark:border-zinc-800/60 dark:bg-zinc-900/20 ${course.shadow}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="line-clamp-2 text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-500 dark:text-zinc-100 dark:group-hover:text-indigo-400">
                        {course.title}
                      </h4>

                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-slate-50 text-slate-400 dark:border-zinc-800 dark:bg-zinc-950">
                        <ArrowUpRight size={12} />
                      </div>
                    </div>

                    <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
                      by {course.instructor}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px] font-bold text-slate-400">
                      <span>
                        {course.completedModules}/{course.totalModules} MODS
                      </span>

                      <span>{course.progress}%</span>
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 p-px dark:bg-zinc-950">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${course.glowColor}`}
                        style={{
                          width: `${course.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Assignments */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 px-1 text-slate-400">
                <FileText size={14} className="text-purple-500" />

                <h3 className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">
                  My Assignment Desk
                </h3>
              </div>

              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/50 bg-white p-5 shadow-2xs dark:divide-zinc-800/60 dark:border-zinc-800/60 dark:bg-zinc-900/10">
                {ASSIGNMENTS.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="space-y-0.5">
                      <p className="line-clamp-1 text-xs font-bold text-slate-800 dark:text-zinc-200">
                        {assignment.title}
                      </p>

                      <p className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                        Due Date: {assignment.deadline} • Grade:{" "}
                        <span className="font-bold text-slate-600 dark:text-zinc-300">
                          {assignment.marks}
                        </span>
                      </p>
                    </div>

                    <div className="shrink-0">
                      {assignment.status === "Pending" ? (
                        <span className="animate-pulse rounded-md border border-rose-100/50 bg-rose-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-rose-600 dark:border-rose-500/10 dark:bg-rose-500/10 dark:text-rose-400">
                          Pending
                        </span>
                      ) : (
                        <span className="rounded-md border border-emerald-100/50 bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:border-emerald-500/10 dark:bg-emerald-500/10 dark:text-emerald-400">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right tabbed section */}
          <div className="space-y-4">
            <div className="flex rounded-xl border bg-slate-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => handleTabChange("routine")}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                  activeTab === "routine"
                    ? "bg-white text-slate-900 shadow-xs dark:bg-zinc-800 dark:text-white"
                    : "text-slate-400 hover:text-slate-600 dark:text-zinc-500"
                }`}
              >
                <Calendar size={12} />
                Routine
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("leaderboard")}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                  activeTab === "leaderboard"
                    ? "bg-white text-slate-900 shadow-xs dark:bg-zinc-800 dark:text-white"
                    : "text-slate-400 hover:text-slate-600 dark:text-zinc-500"
                }`}
              >
                <Trophy size={12} />
                Leaderboard
              </button>
            </div>

            {/* Routine */}
            {activeTab === "routine" && (
              <div className="space-y-4 rounded-2xl border border-slate-200/50 bg-white p-5 shadow-2xs animate-in duration-200 fade-in dark:border-zinc-800/80 dark:bg-zinc-900/20">
                {CLASS_ROUTINE.map((slot) => (
                  <div
                    key={slot.id}
                    className="group relative flex items-start justify-between gap-4 border-b border-slate-100 pb-3.5 last:border-0 last:pb-0 dark:border-zinc-800/60"
                  >
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-indigo-500">
                        <Clock size={10} />
                        {slot.date} • {slot.time}
                      </span>

                      <p className="line-clamp-2 text-xs font-bold text-slate-800 dark:text-zinc-200">
                        {slot.topic}
                      </p>
                    </div>

                    {slot.isLive && (
                      <button
                        type="button"
                        className="flex shrink-0 cursor-pointer animate-bounce items-center gap-1 rounded-md bg-rose-500 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-rose-600"
                      >
                        <Video size={10} />
                        Live
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Leaderboard */}
            {activeTab === "leaderboard" && (
              <div className="space-y-3 rounded-2xl border border-slate-200/50 bg-white p-4 shadow-2xs animate-in duration-200 fade-in dark:border-zinc-800/80 dark:bg-zinc-900/20">
                {LEADERBOARD.map((student) => (
                  <div
                    key={student.rank}
                    className={`flex items-center justify-between rounded-xl p-2 transition ${
                      student.isUser
                        ? "border border-indigo-500/20 bg-indigo-500/10"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-4 text-center font-mono text-xs font-bold ${
                          student.rank === 1
                            ? "text-amber-500"
                            : "text-slate-400"
                        }`}
                      >
                        #{student.rank}
                      </span>

                      <img
                        src={student.avatar}
                        alt={`${student.name}'s avatar`}
                        className="h-7 w-7 rounded-lg border bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800"
                      />

                      <span
                        className={`text-xs ${
                          student.isUser
                            ? "font-bold text-indigo-600 dark:text-indigo-400"
                            : "font-medium text-slate-700 dark:text-zinc-300"
                        }`}
                      >
                        {student.name}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                      {student.points} XP
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
