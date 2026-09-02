"use client";

import {
  type ChangeEvent,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Search,
  Star,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import {
  STUDENT_COURSES,
} from "@/data/studentCourses";

import type {
  CourseCatalogItem,
} from "@/types/studentCourse";

export default function CourseCatalog() {
  const [searchQuery, setSearchQuery] =
    useState<string>("");

  const filteredCourses =
    useMemo<CourseCatalogItem[]>(() => {
      const normalizedQuery =
        searchQuery.trim().toLowerCase();

      if (!normalizedQuery) {
        return [...STUDENT_COURSES];
      }

      return STUDENT_COURSES.filter(
        (course) => {
          const searchableText =
            `${course.title} ${course.instructor} ${course.level}`.toLowerCase();

          return searchableText.includes(
            normalizedQuery,
          );
        },
      );
    }, [searchQuery]);

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchQuery(event.target.value);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-12 animate-in antialiased duration-500 fade-in">
        {/* Header and search */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-zinc-100 pb-8 md:flex-row md:items-center dark:border-zinc-900">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
              Your Academic Vault
            </h1>

            <p className="mt-1 text-xs text-zinc-400">
              Track your synchronized cohorts and
              resume your standard learning modules.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />

            <input
              type="text"
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-4 text-xs text-zinc-900 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />
          </div>
        </div>

        {/* Course grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <article
                key={course.id}
                className="group relative flex h-72 flex-col justify-between rounded-2xl border border-zinc-200/60 bg-white p-5 shadow-2xs transition-all duration-300 hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/20 dark:hover:border-zinc-700"
              >
                {/* Card header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      {course.level}
                    </span>

                    <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star
                        size={12}
                        className="fill-current"
                      />

                      {course.rating}
                    </span>
                  </div>

                  <div>
                    <h2 className="line-clamp-2 text-base font-bold text-zinc-900 transition-colors group-hover:text-indigo-500 dark:text-zinc-100 dark:group-hover:text-indigo-400">
                      {course.title}
                    </h2>

                    <p className="mt-1 text-xs text-zinc-400">
                      by {course.instructor}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="my-2 space-y-2">
                  <div className="flex justify-between font-mono text-[10px] font-bold tracking-wide text-zinc-400">
                    <span>
                      {course.completedModules}/
                      {course.totalModules} MODULES
                    </span>

                    <span>
                      {course.progress}%
                    </span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 p-px dark:bg-zinc-950">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        course.progress === 100
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : "bg-gradient-to-r from-indigo-500 to-violet-500"
                      }`}
                      style={{
                        width: `${course.progress}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-900">
                  <div>
                    <span className="block font-mono text-[9px] font-bold text-zinc-400">
                      VALUE
                    </span>

                    <span className="text-base font-black text-zinc-900 dark:text-white">
                      {course.price}
                    </span>
                  </div>

                  {course.progress === 100 ? (
                    <div className="flex items-center gap-1 rounded-xl border border-emerald-100/50 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:border-emerald-500/10 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <CheckCircle2 size={12} />
                      Completed
                    </div>
                  ) : (
                    <Link
                      href={`/student/courses/${course.id}`}
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                      <PlayCircle size={14} />

                      <span>
                        {course.progress === 0
                          ? "Start Class"
                          : "Resume Class"}
                      </span>

                      <ArrowRight
                        size={12}
                        className="opacity-60 transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 py-20 text-center dark:border-zinc-800">
            <Search
              size={30}
              className="text-zinc-300 dark:text-zinc-600"
            />

            <h2 className="mt-4 font-bold text-zinc-900 dark:text-white">
              No courses found
            </h2>

            <p className="mt-1 text-xs text-zinc-400">
              Try searching by course, instructor
              or level.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}