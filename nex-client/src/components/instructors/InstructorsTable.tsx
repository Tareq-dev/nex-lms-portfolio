"use client";

import {
  type Dispatch,
  type SetStateAction,
  useMemo,
  useState,
} from "react";
import {
  BookOpen,
  Briefcase,
  Pencil,
  Search,
  Trash2,
  Users,
} from "lucide-react";

import type {
  Instructor,
  InstructorFormData,
  InstructorId,
} from "@/types/instructor";

interface InstructorsTableProps {
  setShowForm: Dispatch<
    SetStateAction<boolean>
  >;
  instructors: Instructor[];
  setInstructors: Dispatch<
    SetStateAction<Instructor[]>
  >;
  setEditingId: Dispatch<
    SetStateAction<InstructorId | null>
  >;
  setFormData: Dispatch<
    SetStateAction<InstructorFormData>
  >;
}

export default function InstructorsTable({
  setShowForm,
  instructors,
  setInstructors,
  setEditingId,
  setFormData,
}: InstructorsTableProps) {
  const [search, setSearch] =
    useState<string>("");

  const filteredInstructors = useMemo(
    () => {
      const searchText =
        search.toLowerCase().trim();

      return instructors.filter(
        (instructor) =>
          `${instructor.name} ${instructor.email} ${instructor.designation} ${instructor.courses}`
            .toLowerCase()
            .includes(searchText),
      );
    },
    [instructors, search],
  );

  const uniqueCompaniesCount = useMemo(
    () => {
      const companies = instructors
        .map((instructor) =>
          instructor.job.toLowerCase().trim(),
        )
        .filter(
          (company) => company.length > 0,
        );

      return new Set(companies).size;
    },
    [instructors],
  );

  const activeInstructorsCount =
    useMemo(
      () =>
        instructors.filter(
          (instructor) =>
            instructor.status === "Active",
        ).length,
      [instructors],
    );

  const handleEdit = (
    instructor: Instructor,
  ) => {
    setEditingId(instructor.id);

    setFormData({
      name: instructor.name,
      email: instructor.email,
      designation:
        instructor.designation,
      education: instructor.education,
      job: instructor.job,
      phone: instructor.phone,
      courses: instructor.courses,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (
    instructorId: InstructorId,
  ) => {
    const shouldDelete = window.confirm(
      "Delete this instructor profile?",
    );

    if (!shouldDelete) return;

    setInstructors(
      (previousInstructors) =>
        previousInstructors.filter(
          (instructor) =>
            instructor.id !== instructorId,
        ),
    );
  };

  return (
    <div className="w-full space-y-6 p-1">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                Total Instructors
              </p>

              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {instructors.length}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400">
              <Users
                aria-hidden="true"
                size={24}
              />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                Partner Companies/Jobs
              </p>

              <h2 className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                {uniqueCompaniesCount}
              </h2>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Briefcase
                aria-hidden="true"
                size={24}
              />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md sm:col-span-2 lg:col-span-1 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                Active Instructors
              </p>

              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {activeInstructorsCount}
              </h2>
            </div>

            <div className="rounded-xl bg-violet-50 p-3 text-violet-600 transition-colors group-hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400">
              <BookOpen
                aria-hidden="true"
                size={24}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-slate-100 p-5 dark:border-zinc-800">
          <div className="relative max-w-md">
            <Search
              aria-hidden="true"
              className="absolute top-3.5 left-4 text-slate-400 dark:text-zinc-500"
              size={18}
            />

            <input
              type="search"
              placeholder="Search by name, designation, or course..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold text-slate-600 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                <th className="p-4 pl-6">
                  Instructor
                </th>
                <th className="p-4">
                  Designation & Job
                </th>
                <th className="p-4">
                  Education
                </th>
                <th className="p-4">
                  Assigned Courses
                </th>
                <th className="p-4">
                  Contact Info
                </th>
                <th className="p-4 pr-6 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-zinc-800 dark:text-zinc-300">
              {filteredInstructors.map(
                (instructor) => (
                  <tr
                    key={instructor.id}
                    className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/30"
                  >
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {instructor.name}
                      </div>

                      <div className="text-xs text-slate-400 dark:text-zinc-500">
                        {instructor.email}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-slate-800 dark:text-zinc-200">
                        {
                          instructor.designation
                        }
                      </div>

                      <div className="text-xs text-slate-500 dark:text-zinc-400">
                        at{" "}
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {instructor.job}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600 dark:text-zinc-400">
                      {instructor.education}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {instructor.courses
                          .split(",")
                          .map(
                            (
                              course,
                              index,
                            ) => {
                              const courseName =
                                course.trim();

                              return (
                                <span
                                  key={`${courseName}-${index}`}
                                  className="inline-flex items-center rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-400"
                                >
                                  {
                                    courseName
                                  }
                                </span>
                              );
                            },
                          )}
                      </div>
                    </td>

                    <td className="p-4 text-slate-500 dark:text-zinc-400">
                      {instructor.phone}
                    </td>

                    <td className="p-4 pr-6">
                      <div className="flex justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              instructor,
                            )
                          }
                          aria-label={`Edit ${instructor.name}`}
                          title="Edit Profile"
                          className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                        >
                          <Pencil
                            aria-hidden="true"
                            size={15}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              instructor.id,
                            )
                          }
                          aria-label={`Delete ${instructor.name}`}
                          title="Delete Profile"
                          className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        >
                          <Trash2
                            aria-hidden="true"
                            size={15}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>

          {filteredInstructors.length ===
            0 && (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="rounded-full bg-slate-50 p-4 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500">
                <Search
                  aria-hidden="true"
                  size={32}
                />
              </div>

              <p className="mt-4 text-base font-medium text-slate-900 dark:text-white">
                No instructors found
              </p>

              <p className="mt-1 text-sm text-slate-400 dark:text-zinc-500">
                Try adjusting your search
                terms or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}