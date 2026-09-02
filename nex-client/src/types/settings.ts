export type SettingsTab =
  | "profile"
  | "platform"
  | "academic"
  | "notifications"
  | "security"
  | "system";

export type SaveStatus =
  | "idle"
  | "saving"
  | "saved";

export type LmsLanguage =
  | "en"
  | "bn";

export type LmsCurrency =
  | "BDT"
  | "USD";

export type ThemePreference =
  | "system"
  | "light"
  | "dark";

export type EnrollmentMode =
  | "open"
  | "approval"
  | "invite-only";

export type ResultVisibility =
  | "immediately"
  | "after-deadline"
  | "manual";

export type BackupFrequency =
  | "daily"
  | "weekly"
  | "monthly";

export interface LmsSettings {
  // Admin profile
  adminName: string;
  adminEmail: string;
  phone: string;
  designation: string;
  bio: string;

  // Platform
  platformName: string;
  tagline: string;
  websiteUrl: string;
  supportEmail: string;
  senderName: string;
  replyToEmail: string;
  primaryColor: string;
  language: LmsLanguage;
  currency: LmsCurrency;
  timezone: string;
  defaultTheme: ThemePreference;
  publicCatalogEnabled: boolean;

  // Academic
  allowSelfRegistration: boolean;
  requireEmailVerification: boolean;
  enrollmentMode: EnrollmentMode;
  autoEnrollFreeCourses: boolean;
  courseApprovalRequired: boolean;
  certificatesEnabled: boolean;
  maximumUploadSizeMb: number;
  passingScore: number;
  maximumQuizAttempts: number;
  shuffleQuestions: boolean;
  showCorrectAnswers: boolean;
  resultVisibility: ResultVisibility;

  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  newEnrollmentAlerts: boolean;
  orderAlerts: boolean;
  quizReminder: boolean;
  coursePublishedAlert: boolean;
  weeklySummary: boolean;

  // Security
  twoFactorAuthentication: boolean;
  sessionTimeoutMinutes: number;
  maximumLoginAttempts: number;

  // System
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
  automaticBackupEnabled: boolean;
  backupFrequency: BackupFrequency;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}