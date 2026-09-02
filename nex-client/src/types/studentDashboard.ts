export type StudentDashboardTab =
  | "routine"
  | "leaderboard";

export interface StudentProfile {
  name: string;
  batch: string;
  avatar: string;
  overallProgress: number;
  rank: number;
  points: number;
}

export interface StudentCourse {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  glowColor: string;
  shadow: string;
  totalModules: number;
  completedModules: number;
}

export type AssignmentStatus =
  | "Pending"
  | "Completed";

export interface StudentAssignment {
  id: number;
  title: string;
  deadline: string;
  status: AssignmentStatus;
  marks: string;
}

export interface RoutineItem {
  id: number;
  topic: string;
  date: string;
  time: string;
  isLive: boolean;
}

export interface LeaderboardStudent {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  isUser?: boolean;
}