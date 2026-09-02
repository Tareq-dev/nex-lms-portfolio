"use client";

import {
  DollarSign,
  GraduationCap,
  Pencil,
  Trash2,
} from "lucide-react";

import type {
  AdminCourse,
  CourseId,
} from "@/types/adminCourse";

interface CourseTableProps {
  courses?: AdminCourse[];
  onEdit: (course: AdminCourse) => void;
  onDelete: (courseId: CourseId) => void;
}

export default function CourseTable({
  courses = [],
  onEdit,
  onDelete,
}: CourseTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold text-slate-600 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
              <th className="w-16 p-4 pl-6">SL</th>
              <th className="min-w-[200px] p-4">
                Course Title
              </th>
              <th className="p-4">Instructor</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">
                Enrolled Students
              </th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-zinc-800 dark:text-zinc-300">
            {courses.map((course, index) => {
              const isPublished =
                course.status === "Published" ||
                course.status === "Active";

              return (
                <tr
                  key={course.id}
                  className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/30"
                >
                  <td className="p-4 pl-6 font-medium text-slate-400 dark:text-zinc-500">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td className="p-4 font-semibold text-slate-900 dark:text-white">
                    {course.title}
                  </td>

                  <td className="p-4 text-slate-600 dark:text-zinc-400">
                    {course.instructor}
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                      {course.category}
                    </span>
                  </td>

                  <td className="p-4 font-semibold text-slate-900 dark:text-white">
                    <span className="inline-flex items-center gap-0.5">
                      <DollarSign
                        aria-hidden="true"
                        size={14}
                        className="text-slate-400"
                      />
                      {course.price}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                      <GraduationCap
                        aria-hidden="true"
                        size={16}
                        className="text-slate-400"
                      />

                      <span className="font-medium text-slate-700 dark:text-zinc-300">
                        {course.students ?? 0}
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        isPublished
                          ? "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
                      }`}
                    >
                      <span
                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                          isPublished
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />

                      {course.status}
                    </span>
                  </td>

                  <td className="p-4 pr-6">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(course)}
                        aria-label={`Edit ${course.title}`}
                        title="Edit Course"
                        className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                      >
                        <Pencil
                          aria-hidden="true"
                          size={14}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(course.id)
                        }
                        aria-label={`Delete ${course.title}`}
                        title="Delete Course"
                        className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        <Trash2
                          aria-hidden="true"
                          size={14}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {courses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="rounded-full bg-slate-50 p-4 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500">
              <GraduationCap
                aria-hidden="true"
                size={32}
              />
            </div>

            <p className="mt-4 text-base font-medium text-slate-900 dark:text-white">
              No courses available
            </p>

            <p className="mt-1 text-sm text-slate-400 dark:text-zinc-500">
              Click on &apos;Create Course&apos; to add
              your first curriculum.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}