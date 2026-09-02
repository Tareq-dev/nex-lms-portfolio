export type BroadcastAudience =
  | "all-active"
  | "trial-users"
  | "premium-subscribers"
  | "course-cohort";

export type BroadcastChannel =
  | "email"
  | "push";

export interface BroadcastFormData {
  audience: BroadcastAudience;
  channel: BroadcastChannel;
  subject: string;
  message: string;
}