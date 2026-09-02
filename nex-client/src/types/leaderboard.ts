export type LeaderboardBadge =
  | "Grandmaster"
  | "Elite"
  | "Pro"
  | "Rising Star";

export interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  avatarSeed: string;
  badge: LeaderboardBadge;
}