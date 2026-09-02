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

export interface Course {
  id: CourseId;
  title: string;
  instructor: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  level: CourseLevel;
  students: number;
  status: CourseStatus;
  thumbnail: string;
  language?: string;
  modules: CourseModule[];
}

export interface CoursesState {
  courses: Course[];
}