export type CourseId = string | number;

export type CourseLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export type CourseStatus =
  | "Published"
  | "Active"
  | "Draft"
  | "Inactive";

export interface CourseChapter {
  title: string;
  video: string;
}

export interface CourseModule {
  title: string;
  chapters: CourseChapter[];
}

export interface AdminCourse {
  id: CourseId;
  title: string;
  instructor: string;
  category: string;
  price: number;
  duration: string;
  level: CourseLevel;
  language: string;
  description: string;
  thumbnail: string | null;
  modules: CourseModule[];
  status: CourseStatus;
  students?: number;
}

 