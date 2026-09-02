export type QuizId = string | number;

export type QuizStatus =
  | "Upcoming"
  | "Live"
  | "Ended";

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
  duration: string | number;
  date: string;
  liveDurationHours?: string | number;
  liveStartedAt?: string | null;
  questions?: QuizQuestion[];
  questionsCount: number;
  totalParticipants?: number;
  status: QuizStatus;
}

export interface QuizFormValues {
  title: string;
  course: string;
  duration: string;
  date: string;
  liveDurationHours: string;
}

export interface QuizPublishPayload
  extends QuizFormValues {
  questions: QuizQuestion[];
  liveStartedAt: string | null;
}