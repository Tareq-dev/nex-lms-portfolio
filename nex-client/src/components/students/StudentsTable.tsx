"use client";

import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Pencil,
  Trash2,
  Users,
  GraduationCap,
  BookOpen,
  Filter,
  RefreshCw,
} from "lucide-react";

import Pagination from "@/components/common/Pagination";

import type { Student, StudentFormData, StudentId } from "@/types/student";

const ITEMS_PER_PAGE = 5;

interface StudentsTableProps {
  setShowForm: Dispatch<SetStateAction<boolean>>;
  students: Student[];
  setStudents: Dispatch<SetStateAction<Student[]>>;
  setEditingId: Dispatch<SetStateAction<StudentId | null>>;
  setFormData: Dispatch<SetStateAction<StudentFormData>>;
}

export default function StudentsTable({
  setShowForm,
  students,
  setStudents,
  setEditingId,
  setFormData,
}: StudentsTableProps) {
  const [search, setSearch] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const [selectedBatch, setSelectedBatch] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // সব students থেকে unique course list তৈরি করা হচ্ছে
  const availableCourses = useMemo<string[]>(() => {
    const courses = students
      .map((student) => student.course.trim())
      .filter((course) => course.length > 0);

    return Array.from(new Set(courses));
  }, [students]);

  // Optional batch value থেকে শুধু valid string নেওয়া হচ্ছে
  const availableBatches = useMemo<string[]>(() => {
    const batches = students
      .map((student) => student.batch)
      .filter(
        (batch): batch is string =>
          typeof batch === "string" && batch.trim().length > 0,
      )
      .map((batch) => batch.trim());

    return Array.from(new Set(batches));
  }, [students]);

  // Search + Course + Batch filtering
  const filteredStudents = useMemo<Student[]>(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return students.filter((student) => {
      const searchableText =
        `${student.name} ${student.email} ${student.course} ${student.phone} ${student.batch ?? ""}`.toLowerCase();

      const matchesSearch =
        normalizedSearch === "" || searchableText.includes(normalizedSearch);

      const matchesCourse =
        selectedCourse === "All" || student.course === selectedCourse;

      const matchesBatch =
        selectedBatch === "All" || student.batch === selectedBatch;

      return matchesSearch && matchesCourse && matchesBatch;
    });
  }, [students, search, selectedCourse, selectedBatch]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / ITEMS_PER_PAGE),
  );

  // Filter অথবা delete-এর পরে current page আর না থাকলে
  // last available page-এ নিয়ে যাবে
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Filtered students থেকে শুধু current page-এর data নেওয়া হচ্ছে
  const paginatedStudents = useMemo<Student[]>(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleCourseChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedCourse(event.target.value);
    setCurrentPage(1);
  };

  const handleBatchChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedBatch(event.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = (): void => {
    setSearch("");
    setSelectedCourse("All");
    setSelectedBatch("All");
    setCurrentPage(1);
  };

  const handleEdit = (student: Student): void => {
    setEditingId(student.id);

    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
      phone: student.phone,
      date: student.date,
      batch: student.batch ?? "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (id: StudentId): void => {
    const shouldDelete = window.confirm("Delete this student?");

    if (!shouldDelete) return;

    setStudents((previousStudents) =>
      previousStudents.filter((student) => student.id !== id),
    );
  };

  return (
    <div className="w-full space-y-8 p-1">
      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900/40">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Total Matrix
              </p>

              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {students.length}
              </h2>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600 transition-transform group-hover:scale-105 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900/40">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Active Pulse
              </p>

              <h2 className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                {
                  students.filter((student) => student.status === "Active")
                    .length
                }
              </h2>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 transition-transform group-hover:scale-105 dark:bg-emerald-500/10 dark:text-emerald-400">
              <GraduationCap size={22} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900/40 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Cohorts Enrolled
              </p>

              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {filteredStudents.length}

                <span className="ml-2 text-xs font-medium text-slate-400">
                  filtered
                </span>
              </h2>
            </div>

            <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600 transition-transform group-hover:scale-105 dark:bg-cyan-500/10 dark:text-cyan-400">
              <BookOpen size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xs backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
        {/* Filters */}
        <div className="border-b border-slate-50 bg-slate-50/20 p-5 dark:border-zinc-800/60 dark:bg-zinc-900/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search
                className="absolute left-4 top-3.5 text-slate-400 dark:text-zinc-500"
                size={16}
              />

              <input
                type="text"
                placeholder="Search dossiers by name, email..."
                value={search}
                onChange={handleSearchChange}
                className="w-full rounded-xl border border-slate-200/70 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 dark:border-zinc-700/60 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Course Filter */}
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/70 bg-white px-3 py-1.5 shadow-2xs dark:border-zinc-700/60 dark:bg-zinc-950">
                <Filter size={14} className="text-slate-400" />

                <select
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  className="cursor-pointer bg-transparent pr-2 text-xs font-semibold text-slate-700 outline-none dark:text-zinc-300"
                >
                  <option value="All">All Courses</option>

                  {availableCourses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Filter */}
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/70 bg-white px-3 py-1.5 shadow-2xs dark:border-zinc-700/60 dark:bg-zinc-950">
                <Filter size={14} className="text-slate-400" />

                <select
                  value={selectedBatch}
                  onChange={handleBatchChange}
                  className="cursor-pointer bg-transparent pr-2 text-xs font-semibold text-slate-700 outline-none dark:text-zinc-300"
                >
                  <option value="All">All Batches</option>

                  {availableBatches.map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filter */}
              {(search ||
                selectedCourse !== "All" ||
                selectedBatch !== "All") && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600 transition hover:opacity-90 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  <RefreshCw size={12} />
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/40 font-bold text-slate-500 dark:border-zinc-800/60 dark:bg-zinc-800/20 dark:text-zinc-400">
                <th className="p-4 pl-6">Student Info</th>

                <th className="p-4">Syllabus Cohort</th>

                <th className="p-4">Batch Index</th>

                <th className="p-4">Contact Matrix</th>

                <th className="p-4">Matriculation Date</th>

                <th className="p-4 pr-6 text-center">Operational Trigger</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100/70 text-slate-700 dark:divide-zinc-800/50 dark:text-zinc-300">
              {paginatedStudents.map((student) => (
                <tr
                  key={student.id}
                  className="group transition-colors hover:bg-slate-50/30 dark:hover:bg-zinc-800/10"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/40 bg-slate-100 text-xs font-bold text-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-indigo-400">
                        {student.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                          {student.name}
                        </div>

                        <div className="mt-0.5 text-[11px] font-mono text-slate-400">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center rounded-lg bg-indigo-50/60 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                      {student.course}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-xs font-bold text-slate-500 dark:text-zinc-400">
                    {student.batch ?? "N/A"}
                  </td>

                  <td className="p-4 font-mono text-xs text-slate-500 dark:text-zinc-400">
                    {student.phone}
                  </td>

                  <td className="p-4 text-slate-500 dark:text-zinc-400">
                    {student.date}
                  </td>

                  <td className="p-4 pr-6">
                    <div className="flex justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(student)}
                        className="cursor-pointer rounded-xl border border-slate-200 p-2 text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                        title="Edit Student"
                        aria-label={`Edit ${student.name}`}
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(student.id)}
                        className="cursor-pointer rounded-xl border border-slate-200 p-2 text-slate-400 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                        title="Delete Student"
                        aria-label={`Delete ${student.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="flex animate-in flex-col items-center justify-center py-16 text-center duration-300 fade-in">
              <div className="rounded-2xl bg-slate-50 p-4 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500">
                <Search size={28} />
              </div>

              <p className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                No matching student dossiers found
              </p>

              <p className="mt-1 max-w-xs text-xs text-slate-400 dark:text-zinc-500">
                We couldn&apos;t find anything matching your search query or
                filter combination.
              </p>

              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:opacity-90 active:scale-95 dark:bg-white dark:text-zinc-950"
              >
                Reset System Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Pagination */}
      {filteredStudents.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredStudents.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
