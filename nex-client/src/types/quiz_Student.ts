export type QuizId = string | number;

export type QuizStatus = "Upcoming" | "Live" | "Ended";

export interface QuizQuestion {
  id: QuizId;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: QuizId;
  title: string;
  course: string;
  date: string;
  duration: string;
  liveDurationHours: string;
  liveStartedAt?: string | null;
  questionsCount: number;
  totalParticipants: number;
  status: QuizStatus;
  questions: QuizQuestion[];
}

export interface QuizPublishPayload {
  title: string;
  course: string;
  date: string;
  duration: string;
  liveDurationHours: string;
  liveStartedAt?: string | null;
  questions: QuizQuestion[];
}