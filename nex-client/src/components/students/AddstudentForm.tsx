"use client";

import type { ChangeEvent, FormEvent } from "react";

import { UserPlus, UserCheck, X, Layers } from "lucide-react";

import type { StudentFormData, StudentId } from "@/types/student";

interface AddStudentFormProps {
  editingId: StudentId | null;
  resetForm: () => void;

  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;

  formData: StudentFormData;

  handleChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

export default function AddStudentForm({
  editingId,
  resetForm,
  handleSubmit,
  formData,
  handleChange,
}: AddStudentFormProps) {
  const isEditing = editingId !== null;

  const inputClass =
    "w-full rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-zinc-700/60 dark:bg-zinc-950 dark:text-white";

  const labelClass =
    "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400";

  return (
    <div className="h-fit w-full animate-in rounded-3xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-300 slide-in-from-top-4 dark:border-zinc-800/80 dark:bg-zinc-900/80">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-50 pb-4 dark:border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-2xl p-2.5 transition-colors ${
              isEditing
                ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
            }`}
          >
            {isEditing ? <UserCheck size={20} /> : <UserPlus size={20} />}
          </div>

          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              {isEditing ? "Modify Student Profile" : "Onboard Premium Student"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-400 dark:text-zinc-500">
              {isEditing
                ? "Update core student dossier and system credentials below."
                : "Fill in metadata to register a new cohort member."}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Student Name */}
          <div className="sm:col-span-2">
            <label htmlFor="student-name" className={labelClass}>
              Full Name
            </label>

            <input
              id="student-name"
              name="name"
              type="text"
              placeholder="e.g. Alex Mercer"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="student-email" className={labelClass}>
              Email Address
            </label>

            <input
              id="student-email"
              name="email"
              type="email"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="student-phone" className={labelClass}>
              Phone Number
            </label>

            <input
              id="student-phone"
              name="phone"
              type="tel"
              placeholder="e.g. +880 1712-345678"
              value={formData.phone}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Course */}
          <div>
            <label htmlFor="student-course" className={labelClass}>
              Enrolled Course
            </label>

            <input
              id="student-course"
              name="course"
              type="text"
              placeholder="e.g. Next.js Premium Course"
              value={formData.course}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Batch */}
          <div>
            <label
              htmlFor="student-batch"
              className={`${labelClass} flex items-center gap-1`}
            >
              <Layers size={12} className="text-indigo-500" />
              Allocated Batch
            </label>

            <div className="relative ">
              <select
                id="student-batch"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                required
                className={`${inputClass}  cursor-pointer appearance-none pr-10`}
              >
                <option className="dark:text-gray-600 " value="" disabled>
                  Select Target Batch
                </option>

                <option className="dark:text-gray-600 " value="Batch 1">
                  Batch 01 (Core Alpha)
                </option>

                <option className="dark:text-gray-600 " value="Batch 2">
                  Batch 02 (Premium Beta)
                </option>

                <option className="dark:text-gray-600 " value="Batch 3">
                  Batch 03 (Elite Gamma)
                </option>

                <option className="dark:text-gray-600 " value="Batch 4">
                  Batch 04 (Next Gen)
                </option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                <span className="text-[10px]">▼</span>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="student-date" className={labelClass}>
              Enrollment Matriculation Date
            </label>

            <input
              id="student-date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 border-t border-slate-50 pt-4 sm:max-w-md sm:flex-row dark:border-zinc-900/40">
          <button
            type="submit"
            className="flex-1 cursor-pointer rounded-xl bg-slate-900 py-3 text-xs font-black tracking-wide text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-zinc-950 dark:hover:bg-slate-100"
          >
            {isEditing ? "Save Profile Blueprint" : "Publish Enrollment"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X size={14} strokeWidth={2.5} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
