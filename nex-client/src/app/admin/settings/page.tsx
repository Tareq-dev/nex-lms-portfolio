"use client";

import {
  type FormEvent,
  type ReactNode,
  useState,
} from "react";

import {
  type LucideIcon,
  Bell,
  CheckCircle2,
  DatabaseBackup,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  LockKeyhole,
  Palette,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import type {
  BackupFrequency,
  EnrollmentMode,
  LmsCurrency,
  LmsLanguage,
  LmsSettings,
  PasswordFormData,
  ResultVisibility,
  SaveStatus,
  SettingsTab,
  ThemePreference,
} from "@/types/settings";

const INITIAL_SETTINGS: LmsSettings = {
  adminName: "Alex Mercer",
  adminEmail: "admin@nex.com",
  phone: "+880 1712-345678",
  designation: "System Administrator",
  bio: "Managing NEX-LMS courses, instructors, students and platform operations.",

  platformName: "NEX-LMS",
  tagline: "The Future of Digital Learning",
  websiteUrl: "https://nex-lms.com",
  supportEmail: "support@nex-lms.com",
  senderName: "NEX-LMS Support",
  replyToEmail: "support@nex-lms.com",
  primaryColor: "#4f46e5",
  language: "en",
  currency: "BDT",
  timezone: "Asia/Dhaka",
  defaultTheme: "system",
  publicCatalogEnabled: true,

  allowSelfRegistration: true,
  requireEmailVerification: true,
  enrollmentMode: "approval",
  autoEnrollFreeCourses: true,
  courseApprovalRequired: true,
  certificatesEnabled: true,
  maximumUploadSizeMb: 250,
  passingScore: 60,
  maximumQuizAttempts: 3,
  shuffleQuestions: true,
  showCorrectAnswers: true,
  resultVisibility: "immediately",

  emailNotifications: true,
  pushNotifications: false,
  newEnrollmentAlerts: true,
  orderAlerts: true,
  quizReminder: true,
  coursePublishedAlert: true,
  weeklySummary: true,

  twoFactorAuthentication: false,
  sessionTimeoutMinutes: 60,
  maximumLoginAttempts: 5,

  maintenanceMode: false,
  analyticsEnabled: true,
  automaticBackupEnabled: true,
  backupFrequency: "daily",
};

const INITIAL_PASSWORD_FORM: PasswordFormData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

interface NavigationItem {
  id: SettingsTab;
  label: string;
  description: string;
  icon: LucideIcon;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: "profile",
    label: "Profile",
    description: "Name and personal details",
    icon: UserRound,
  },
  {
    id: "platform",
    label: "Platform",
    description: "Branding and localization",
    icon: Palette,
  },
  {
    id: "academic",
    label: "Academic",
    description: "Courses, enrollment and exams",
    icon: GraduationCap,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Email and alert preferences",
    icon: Bell,
  },
  {
    id: "security",
    label: "Security",
    description: "Password and login protection",
    icon: ShieldCheck,
  },
  {
    id: "system",
    label: "System",
    description: "Maintenance and backups",
    icon: Wrench,
  },
];

interface SectionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: SectionCardProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex items-center gap-3 border-b border-slate-100 p-5 dark:border-zinc-800">
        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="font-black text-slate-900 dark:text-white">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-slate-400 dark:text-zinc-500">
            {description}
          </p>
        </div>
      </div>

      <div className="p-5 md:p-6">
        {children}
      </div>
    </section>
  );
}

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-slate-100 py-4 last:border-b-0 dark:border-zinc-800">
      <div>
        <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
          {label}
        </p>

        <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-400 dark:text-zinc-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
          checked
            ? "bg-indigo-600"
            : "bg-slate-200 dark:bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked
              ? "translate-x-6"
              : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-500";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] =
    useState<SettingsTab>("profile");

  const [settings, setSettings] =
    useState<LmsSettings>(INITIAL_SETTINGS);

  const [passwordForm, setPasswordForm] =
    useState<PasswordFormData>(
      INITIAL_PASSWORD_FORM,
    );

  const [showPasswords, setShowPasswords] =
    useState<boolean>(false);

  const [saveStatus, setSaveStatus] =
    useState<SaveStatus>("idle");

  const [
    passwordFeedback,
    setPasswordFeedback,
  ] = useState<string>("");

  function updateSetting<
    K extends keyof LmsSettings,
  >(
    field: K,
    value: LmsSettings[K],
  ): void {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [field]: value,
    }));

    setSaveStatus("idle");
  }

  const handleSaveSettings = (): void => {
    setSaveStatus("saving");

    /*
     * TODO:
     * এখানে backend settings API call করতে হবে।
     *
     * await fetch("/api/admin/settings", ...)
     */
    window.setTimeout(() => {
      setSaveStatus("saved");
    }, 700);
  };

  const handleResetSettings = (): void => {
    const confirmed = window.confirm(
      "Reset all settings to their default values?",
    );

    if (!confirmed) return;

    setSettings(INITIAL_SETTINGS);
    setSaveStatus("idle");
  };

  const handlePasswordSubmit = (
    event: FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();
    setPasswordFeedback("");

    const currentPassword =
      passwordForm.currentPassword.trim();

    const newPassword =
      passwordForm.newPassword.trim();

    const confirmPassword =
      passwordForm.confirmPassword.trim();

    if (!currentPassword) {
      setPasswordFeedback(
        "Current password is required.",
      );

      return;
    }

    if (newPassword.length < 8) {
      setPasswordFeedback(
        "New password must contain at least 8 characters.",
      );

      return;
    }

    if (newPassword === currentPassword) {
      setPasswordFeedback(
        "New password must be different from the current password.",
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback(
        "New password and confirmation password do not match.",
      );

      return;
    }

    /*
     * এখানে password সরাসরি browser-এ save করা যাবে না।
     * Secure backend API দিয়ে current password verify
     * এবং নতুন password hash করতে হবে।
     */
    setPasswordFeedback(
      "Validation passed. Connect the password API to complete the update.",
    );

    setPasswordForm(INITIAL_PASSWORD_FORM);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/70 p-4 transition-colors md:p-6 lg:p-8 dark:bg-zinc-950">
        <div className="mx-auto max-w-[1400px] space-y-7">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                <Settings2
                  size={28}
                  className="text-indigo-500"
                />

                LMS Settings
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                Manage platform identity, academic
                rules, notifications and security.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleResetSettings}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <RotateCcw size={14} />
                Reset Defaults
              </button>

              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={saveStatus === "saving"}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveStatus === "saving" ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : saveStatus === "saved" ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Save size={15} />
                )}

                {saveStatus === "saving"
                  ? "Saving..."
                  : saveStatus === "saved"
                    ? "Current Session Updated"
                    : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            {/* Navigation */}
            <aside className="h-fit overflow-x-auto rounded-3xl border border-slate-100 bg-white p-3 shadow-sm lg:sticky lg:top-5 dark:border-zinc-800 dark:bg-zinc-900/70">
              <div className="flex min-w-max gap-2 lg:min-w-0 lg:flex-col">
                {NAVIGATION_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setActiveTab(item.id)
                      }
                      className={`flex min-w-[160px] cursor-pointer items-center gap-3 rounded-2xl p-3 text-left transition lg:min-w-0 ${
                        isActive
                          ? "bg-slate-900 text-white dark:bg-white dark:text-zinc-950"
                          : "text-slate-500 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <Icon size={18} />

                      <div>
                        <p className="text-sm font-bold">
                          {item.label}
                        </p>

                        <p
                          className={`mt-0.5 hidden text-[10px] lg:block ${
                            isActive
                              ? "text-white/60 dark:text-zinc-500"
                              : "text-slate-400 dark:text-zinc-500"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Settings Content */}
            <main className="min-w-0 space-y-6">
              {activeTab === "profile" && (
                <SectionCard
                  title="Administrator Profile"
                  description="Update the name and contact information shown across the admin panel."
                  icon={UserRound}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Full Name
                      </label>

                      <input
                        type="text"
                        value={settings.adminName}
                        onChange={(event) =>
                          updateSetting(
                            "adminName",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Email Address
                      </label>

                      <input
                        type="email"
                        value={settings.adminEmail}
                        onChange={(event) =>
                          updateSetting(
                            "adminEmail",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(event) =>
                          updateSetting(
                            "phone",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Designation
                      </label>

                      <input
                        type="text"
                        value={settings.designation}
                        onChange={(event) =>
                          updateSetting(
                            "designation",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClass}>
                        Profile Bio
                      </label>

                      <textarea
                        value={settings.bio}
                        onChange={(event) =>
                          updateSetting(
                            "bio",
                            event.target.value,
                          )
                        }
                        className={`${inputClass} h-28 resize-none`}
                      />
                    </div>
                  </div>
                </SectionCard>
              )}

              {activeTab === "platform" && (
                <>
                  <SectionCard
                    title="Platform Identity"
                    description="Configure the public name, branding and support information."
                    icon={Palette}
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>
                          LMS Name
                        </label>

                        <input
                          type="text"
                          value={settings.platformName}
                          onChange={(event) =>
                            updateSetting(
                              "platformName",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Website URL
                        </label>

                        <input
                          type="url"
                          value={settings.websiteUrl}
                          onChange={(event) =>
                            updateSetting(
                              "websiteUrl",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className={labelClass}>
                          Platform Tagline
                        </label>

                        <input
                          type="text"
                          value={settings.tagline}
                          onChange={(event) =>
                            updateSetting(
                              "tagline",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Support Email
                        </label>

                        <input
                          type="email"
                          value={settings.supportEmail}
                          onChange={(event) =>
                            updateSetting(
                              "supportEmail",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Reply-to Email
                        </label>

                        <input
                          type="email"
                          value={settings.replyToEmail}
                          onChange={(event) =>
                            updateSetting(
                              "replyToEmail",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Email Sender Name
                        </label>

                        <input
                          type="text"
                          value={settings.senderName}
                          onChange={(event) =>
                            updateSetting(
                              "senderName",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Primary Brand Color
                        </label>

                        <div className="flex gap-3">
                          <input
                            type="color"
                            value={settings.primaryColor}
                            onChange={(event) =>
                              updateSetting(
                                "primaryColor",
                                event.target.value,
                              )
                            }
                            className="h-12 w-16 cursor-pointer rounded-xl border border-slate-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-950"
                          />

                          <input
                            type="text"
                            value={settings.primaryColor}
                            onChange={(event) =>
                              updateSetting(
                                "primaryColor",
                                event.target.value,
                              )
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard
                    title="Localization"
                    description="Set language, timezone, currency and default appearance."
                    icon={Settings2}
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>
                          Default Language
                        </label>

                        <select
                          value={settings.language}
                          onChange={(event) =>
                            updateSetting(
                              "language",
                              event.target
                                .value as LmsLanguage,
                            )
                          }
                          className={inputClass}
                        >
                          <option value="en">
                            English
                          </option>

                          <option value="bn">
                            বাংলা
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>
                          Currency
                        </label>

                        <select
                          value={settings.currency}
                          onChange={(event) =>
                            updateSetting(
                              "currency",
                              event.target
                                .value as LmsCurrency,
                            )
                          }
                          className={inputClass}
                        >
                          <option value="BDT">
                            BDT — Bangladeshi Taka
                          </option>

                          <option value="USD">
                            USD — US Dollar
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>
                          Timezone
                        </label>

                        <select
                          value={settings.timezone}
                          onChange={(event) =>
                            updateSetting(
                              "timezone",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                        >
                          <option value="Asia/Dhaka">
                            Asia/Dhaka
                          </option>

                          <option value="UTC">
                            UTC
                          </option>

                          <option value="Asia/Kolkata">
                            Asia/Kolkata
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>
                          Default Theme
                        </label>

                        <select
                          value={settings.defaultTheme}
                          onChange={(event) =>
                            updateSetting(
                              "defaultTheme",
                              event.target
                                .value as ThemePreference,
                            )
                          }
                          className={inputClass}
                        >
                          <option value="system">
                            Follow System
                          </option>

                          <option value="light">
                            Light Mode
                          </option>

                          <option value="dark">
                            Dark Mode
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-slate-100 dark:border-zinc-800">
                      <Toggle
                        label="Public Course Catalog"
                        description="Allow visitors to browse published courses without signing in."
                        checked={
                          settings.publicCatalogEnabled
                        }
                        onChange={(value) =>
                          updateSetting(
                            "publicCatalogEnabled",
                            value,
                          )
                        }
                      />
                    </div>
                  </SectionCard>
                </>
              )}

              {activeTab === "academic" && (
                <>
                  <SectionCard
                    title="Enrollment and Course Rules"
                    description="Control student registration, enrollment and course publishing."
                    icon={GraduationCap}
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>
                          Enrollment Mode
                        </label>

                        <select
                          value={settings.enrollmentMode}
                          onChange={(event) =>
                            updateSetting(
                              "enrollmentMode",
                              event.target
                                .value as EnrollmentMode,
                            )
                          }
                          className={inputClass}
                        >
                          <option value="open">
                            Open Enrollment
                          </option>

                          <option value="approval">
                            Admin Approval Required
                          </option>

                          <option value="invite-only">
                            Invitation Only
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>
                          Maximum Upload Size
                        </label>

                        <input
                          type="number"
                          min={1}
                          value={
                            settings.maximumUploadSizeMb
                          }
                          onChange={(event) =>
                            updateSetting(
                              "maximumUploadSizeMb",
                              Number(
                                event.target.value,
                              ),
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Toggle
                        label="Allow Student Registration"
                        description="Allow new students to create their own LMS accounts."
                        checked={
                          settings.allowSelfRegistration
                        }
                        onChange={(value) =>
                          updateSetting(
                            "allowSelfRegistration",
                            value,
                          )
                        }
                      />

                      <Toggle
                        label="Require Email Verification"
                        description="Students must verify their email address before accessing courses."
                        checked={
                          settings.requireEmailVerification
                        }
                        onChange={(value) =>
                          updateSetting(
                            "requireEmailVerification",
                            value,
                          )
                        }
                      />

                      <Toggle
                        label="Auto-enroll Free Courses"
                        description="Immediately enroll students into free courses without order approval."
                        checked={
                          settings.autoEnrollFreeCourses
                        }
                        onChange={(value) =>
                          updateSetting(
                            "autoEnrollFreeCourses",
                            value,
                          )
                        }
                      />

                      <Toggle
                        label="Course Publishing Approval"
                        description="Instructor-created courses require admin approval before publication."
                        checked={
                          settings.courseApprovalRequired
                        }
                        onChange={(value) =>
                          updateSetting(
                            "courseApprovalRequired",
                            value,
                          )
                        }
                      />

                      <Toggle
                        label="Course Certificates"
                        description="Allow eligible students to generate certificates after completion."
                        checked={
                          settings.certificatesEnabled
                        }
                        onChange={(value) =>
                          updateSetting(
                            "certificatesEnabled",
                            value,
                          )
                        }
                      />
                    </div>
                  </SectionCard>

                  <SectionCard
                    title="Quiz and Examination Rules"
                    description="Configure passing marks, attempts and result behavior."
                    icon={ShieldCheck}
                  >
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className={labelClass}>
                          Passing Score (%)
                        </label>

                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={settings.passingScore}
                          onChange={(event) =>
                            updateSetting(
                              "passingScore",
                              Number(
                                event.target.value,
                              ),
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Maximum Attempts
                        </label>

                        <input
                          type="number"
                          min={1}
                          value={
                            settings.maximumQuizAttempts
                          }
                          onChange={(event) =>
                            updateSetting(
                              "maximumQuizAttempts",
                              Number(
                                event.target.value,
                              ),
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Result Visibility
                        </label>

                        <select
                          value={
                            settings.resultVisibility
                          }
                          onChange={(event) =>
                            updateSetting(
                              "resultVisibility",
                              event.target
                                .value as ResultVisibility,
                            )
                          }
                          className={inputClass}
                        >
                          <option value="immediately">
                            Immediately
                          </option>

                          <option value="after-deadline">
                            After Deadline
                          </option>

                          <option value="manual">
                            Manual Release
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Toggle
                        label="Shuffle Questions"
                        description="Display quiz questions in a different order for each student."
                        checked={
                          settings.shuffleQuestions
                        }
                        onChange={(value) =>
                          updateSetting(
                            "shuffleQuestions",
                            value,
                          )
                        }
                      />

                      <Toggle
                        label="Show Correct Answers"
                        description="Show correct answers after the result becomes available."
                        checked={
                          settings.showCorrectAnswers
                        }
                        onChange={(value) =>
                          updateSetting(
                            "showCorrectAnswers",
                            value,
                          )
                        }
                      />
                    </div>
                  </SectionCard>
                </>
              )}

              {activeTab === "notifications" && (
                <SectionCard
                  title="Notification Preferences"
                  description="Choose which platform events will generate alerts."
                  icon={Bell}
                >
                  <Toggle
                    label="Email Notifications"
                    description="Allow the LMS to send transactional and academic emails."
                    checked={
                      settings.emailNotifications
                    }
                    onChange={(value) =>
                      updateSetting(
                        "emailNotifications",
                        value,
                      )
                    }
                  />

                  <Toggle
                    label="Push Notifications"
                    description="Send browser or mobile application notifications."
                    checked={
                      settings.pushNotifications
                    }
                    onChange={(value) =>
                      updateSetting(
                        "pushNotifications",
                        value,
                      )
                    }
                  />

                  <Toggle
                    label="New Enrollment Alerts"
                    description="Notify administrators whenever a student enrolls."
                    checked={
                      settings.newEnrollmentAlerts
                    }
                    onChange={(value) =>
                      updateSetting(
                        "newEnrollmentAlerts",
                        value,
                      )
                    }
                  />

                  <Toggle
                    label="New Order Alerts"
                    description="Notify administrators when a new course payment is submitted."
                    checked={settings.orderAlerts}
                    onChange={(value) =>
                      updateSetting(
                        "orderAlerts",
                        value,
                      )
                    }
                  />

                  <Toggle
                    label="Quiz Reminders"
                    description="Remind students before scheduled quizzes and examinations."
                    checked={settings.quizReminder}
                    onChange={(value) =>
                      updateSetting(
                        "quizReminder",
                        value,
                      )
                    }
                  />

                  <Toggle
                    label="Course Published Alert"
                    description="Notify enrolled students when a new course or module is published."
                    checked={
                      settings.coursePublishedAlert
                    }
                    onChange={(value) =>
                      updateSetting(
                        "coursePublishedAlert",
                        value,
                      )
                    }
                  />

                  <Toggle
                    label="Weekly Admin Summary"
                    description="Receive weekly reports about enrollments, orders and course activity."
                    checked={settings.weeklySummary}
                    onChange={(value) =>
                      updateSetting(
                        "weeklySummary",
                        value,
                      )
                    }
                  />
                </SectionCard>
              )}

              {activeTab === "security" && (
                <>
                  <SectionCard
                    title="Change Password"
                    description="A backend API is required to verify and update the real password."
                    icon={LockKeyhole}
                  >
                    <form
                      onSubmit={handlePasswordSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className={labelClass}>
                          Current Password
                        </label>

                        <input
                          type={
                            showPasswords
                              ? "text"
                              : "password"
                          }
                          value={
                            passwordForm.currentPassword
                          }
                          onChange={(event) =>
                            setPasswordForm(
                              (previousForm) => ({
                                ...previousForm,
                                currentPassword:
                                  event.target.value,
                              }),
                            )
                          }
                          required
                          className={inputClass}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>
                            New Password
                          </label>

                          <input
                            type={
                              showPasswords
                                ? "text"
                                : "password"
                            }
                            value={
                              passwordForm.newPassword
                            }
                            onChange={(event) =>
                              setPasswordForm(
                                (previousForm) => ({
                                  ...previousForm,
                                  newPassword:
                                    event.target.value,
                                }),
                              )
                            }
                            required
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>
                            Confirm New Password
                          </label>

                          <input
                            type={
                              showPasswords
                                ? "text"
                                : "password"
                            }
                            value={
                              passwordForm.confirmPassword
                            }
                            onChange={(event) =>
                              setPasswordForm(
                                (previousForm) => ({
                                  ...previousForm,
                                  confirmPassword:
                                    event.target.value,
                                }),
                              )
                            }
                            required
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords(
                              (previousValue) =>
                                !previousValue,
                            )
                          }
                          className="flex w-fit cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-zinc-400"
                        >
                          {showPasswords ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}

                          {showPasswords
                            ? "Hide Passwords"
                            : "Show Passwords"}
                        </button>

                        <button
                          type="submit"
                          className="cursor-pointer rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-zinc-950"
                        >
                          Update Password
                        </button>
                      </div>

                      {passwordFeedback && (
                        <p className="rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                          {passwordFeedback}
                        </p>
                      )}
                    </form>
                  </SectionCard>

                  <SectionCard
                    title="Login Security"
                    description="Configure account protection and session behavior."
                    icon={ShieldCheck}
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>
                          Session Timeout (Minutes)
                        </label>

                        <input
                          type="number"
                          min={5}
                          value={
                            settings.sessionTimeoutMinutes
                          }
                          onChange={(event) =>
                            updateSetting(
                              "sessionTimeoutMinutes",
                              Number(
                                event.target.value,
                              ),
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Maximum Login Attempts
                        </label>

                        <input
                          type="number"
                          min={1}
                          value={
                            settings.maximumLoginAttempts
                          }
                          onChange={(event) =>
                            updateSetting(
                              "maximumLoginAttempts",
                              Number(
                                event.target.value,
                              ),
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Toggle
                        label="Two-Factor Authentication"
                        description="Require an additional verification code during administrator login."
                        checked={
                          settings.twoFactorAuthentication
                        }
                        onChange={(value) =>
                          updateSetting(
                            "twoFactorAuthentication",
                            value,
                          )
                        }
                      />
                    </div>
                  </SectionCard>
                </>
              )}

              {activeTab === "system" && (
                <>
                  <SectionCard
                    title="System Operations"
                    description="Control maintenance access and platform monitoring."
                    icon={Wrench}
                  >
                    <Toggle
                      label="Maintenance Mode"
                      description="Temporarily prevent students and instructors from accessing the LMS."
                      checked={
                        settings.maintenanceMode
                      }
                      onChange={(value) =>
                        updateSetting(
                          "maintenanceMode",
                          value,
                        )
                      }
                    />

                    <Toggle
                      label="Platform Analytics"
                      description="Collect course, enrollment and engagement statistics."
                      checked={
                        settings.analyticsEnabled
                      }
                      onChange={(value) =>
                        updateSetting(
                          "analyticsEnabled",
                          value,
                        )
                      }
                    />
                  </SectionCard>

                  <SectionCard
                    title="Backup Configuration"
                    description="Configure how frequently server-side LMS data should be backed up."
                    icon={DatabaseBackup}
                  >
                    <Toggle
                      label="Automatic Backup"
                      description="Automatically create backups of courses, users, orders and assessments."
                      checked={
                        settings.automaticBackupEnabled
                      }
                      onChange={(value) =>
                        updateSetting(
                          "automaticBackupEnabled",
                          value,
                        )
                      }
                    />

                    <div className="mt-5 max-w-sm">
                      <label className={labelClass}>
                        Backup Frequency
                      </label>

                      <select
                        value={
                          settings.backupFrequency
                        }
                        disabled={
                          !settings.automaticBackupEnabled
                        }
                        onChange={(event) =>
                          updateSetting(
                            "backupFrequency",
                            event.target
                              .value as BackupFrequency,
                          )
                        }
                        className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <option value="daily">
                          Daily
                        </option>

                        <option value="weekly">
                          Weekly
                        </option>

                        <option value="monthly">
                          Monthly
                        </option>
                      </select>
                    </div>

                    <p className="mt-4 rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                      Actual backup creation must run
                      securely on the server. A browser
                      page cannot back up the database.
                    </p>
                  </SectionCard>
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}