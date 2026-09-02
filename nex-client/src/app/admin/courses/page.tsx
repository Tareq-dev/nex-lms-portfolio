"use client";

import { useState } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { ArrowLeft, Plus } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CourseForm from "@/components/courses/CourseForm";
import CourseTable from "@/components/courses/CourseTable";

import { deleteCourse } from "@/redux/features/courses/courseSlice";

import type {
  AdminCourse,
  CourseId,
} from "@/types/adminCourse";

type PageMode = "list" | "form";

interface CoursesRootState {
  courses: {
    courses: AdminCourse[];
  };
}

export default function CoursesPage() {
  const dispatch = useDispatch();

  const courses = useSelector(
    (state: CoursesRootState) =>
      state.courses.courses,
  );

  const [mode, setMode] =
    useState<PageMode>("list");

  const [editing, setEditing] =
    useState<AdminCourse | null>(null);

  const openCreateForm = () => {
    setEditing(null);
    setMode("form");
  };

  const openEditForm = (
    course: AdminCourse,
  ) => {
    setEditing(course);
    setMode("form");
  };

  const closeForm = () => {
    setEditing(null);
    setMode("list");
  };

  const handleDelete = (
    courseId: CourseId,
  ) => {
    dispatch(deleteCourse(courseId));
  };

  return (
    <DashboardLayout>
      <div className="animate-in mx-auto w-full max-w-[1400px] space-y-6 p-1 duration-200 fade-in">
        {mode === "list" && (
          <>
            <div className="flex flex-col gap-4 border-b border-slate-50 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800/50">
              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  Courses Dashboard
                </h1>

                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Manage curriculum, view active
                  enrollments, and update details.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-100 transition-all hover:bg-indigo-500 active:scale-[0.98] dark:shadow-none"
              >
                <Plus
                  aria-hidden="true"
                  size={16}
                />
                Create Course
              </button>
            </div>

            <CourseTable
              courses={courses}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          </>
        )}

        {mode === "form" && (
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center">
              <button
                type="button"
                onClick={closeForm}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              >
                <ArrowLeft
                  aria-hidden="true"
                  size={16}
                />
                Back to courses list
              </button>
            </div>

            <CourseForm
              editing={editing}
              onCancel={closeForm}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}