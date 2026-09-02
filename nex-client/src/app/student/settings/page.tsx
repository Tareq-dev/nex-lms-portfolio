"use client";

import { Bell, Camera, Lock, Sparkles } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

interface InputFieldProps {
  label: string;
  placeholder: string;
  disabled?: boolean;
  type?: "text" | "email";
}

interface NotificationRowProps {
  title: string;
  desc: string;
}

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <main className="mx-auto max-w-4xl space-y-12 p-6 lg:p-10">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">
            Account Settings
            <Sparkles size={20} className="text-amber-500" />
          </h1>

          <p className="text-zinc-500 dark:text-zinc-400">
            Personalize your EduPulse experience and manage your security.
          </p>
        </div>

        {/* Profile Section */}
        <section className="space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-6">
            <div className="group relative">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                alt="Alex Mercer avatar"
                className="h-24 w-24 rounded-3xl border-2 border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-700 dark:bg-zinc-800"
              />

              <button
                type="button"
                aria-label="Change profile picture"
                className="absolute right-0 bottom-0 cursor-pointer rounded-xl bg-indigo-600 p-2 text-white shadow-lg transition-transform hover:scale-105"
              >
                <Camera size={14} />
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold">Alex Mercer</h2>

              <p className="font-mono text-xs font-bold tracking-widest text-indigo-500 uppercase">
                Owner Account
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InputField label="Full Name" placeholder="Alex Mercer" />

            <InputField
              label="Email Address"
              placeholder="alex@edupulse.com"
              type="email"
              disabled
            />
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
            <Lock size={20} className="text-indigo-500" />

            <h2 className="text-xl font-black">Security & Credentials</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              autoComplete="current-password"
              className="col-span-1 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm outline-none ring-indigo-500/20 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900"
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              autoComplete="new-password"
              className="col-span-1 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm outline-none ring-indigo-500/20 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900"
            />

            <button
              type="button"
              className="col-span-1 cursor-pointer rounded-2xl bg-zinc-900 px-4 py-3 font-bold text-white transition-all hover:opacity-90 dark:bg-white dark:text-zinc-900"
            >
              Change Password
            </button>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <Bell size={20} className="text-amber-500" />
            Notification Preferences
          </h2>

          <div className="divide-y divide-zinc-200 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/50">
            <NotificationRow
              title="Email Notifications"
              desc="Get course updates and reports via email."
            />

            <NotificationRow
              title="Security Alerts"
              desc="Receive login and account security logs."
            />

            <NotificationRow
              title="Instructor Messages"
              desc="Stay connected with your mentors."
            />
          </div>
        </section>

        {/* Action Bar */}
        <div className="flex justify-end gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <button
            type="button"
            className="cursor-pointer px-8 py-3 text-sm font-bold text-zinc-500"
          >
            Reset
          </button>

          <button
            type="button"
            className="cursor-pointer rounded-2xl bg-indigo-600 px-8 py-3 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </main>
    </DashboardLayout>
  );
}

function InputField({
  label,
  placeholder,
  disabled = false,
  type = "text",
}: InputFieldProps) {
  return (
    <div>
      <label className="ml-1 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`mt-2 w-full rounded-2xl border bg-zinc-50 p-4 text-sm outline-none ring-indigo-500/20 focus:ring-2 dark:bg-zinc-900 ${
          disabled
            ? "cursor-not-allowed border-zinc-200 opacity-50 dark:border-zinc-800"
            : "border-zinc-200 dark:border-zinc-800"
        }`}
      />
    </div>
  );
}

function NotificationRow({ title, desc }: NotificationRowProps) {
  return (
    <div className="flex items-center justify-between p-6 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      <div>
        <h3 className="text-sm font-bold">{title}</h3>

        <p className="text-xs text-zinc-500">{desc}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked="true"
        aria-label={`Toggle ${title}`}
        className="flex h-6 w-11 cursor-pointer items-center rounded-full bg-indigo-600 p-1"
      >
        <span className="ml-auto h-4 w-4 rounded-full bg-white" />
      </button>
    </div>
  );
}
