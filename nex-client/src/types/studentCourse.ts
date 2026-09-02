export const COURSE_IDS = [
  "nextjs-14",
  "tailwind-css",
  "prisma-backend",
] as const;

export type CourseId =
  (typeof COURSE_IDS)[number];

export type CourseLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export type CourseBottomTab =
  | "discussion"
  | "notes";

export type NonEmptyReadonlyArray<T> =
  readonly [T, ...T[]];

export interface CourseCatalogItem {
  id: CourseId;
  title: string;
  instructor: string;
  level: CourseLevel;
  rating: number;
  price: string;
  progress: number;
  totalModules: number;
  completedModules: number;
}

export interface CourseVideo {
  id: string;
  title: string;
  duration: string;
  url: string;
}

export interface CourseModule {
  id: number;
  moduleTitle: string;
  videos: NonEmptyReadonlyArray<CourseVideo>;
}

export interface CourseContent {
  courseTitle: string;
  modules: NonEmptyReadonlyArray<CourseModule>;
}

export type CourseContentMap =
  Record<CourseId, CourseContent>;

export function isCourseId(
  value: string,
): value is CourseId {
  return COURSE_IDS.includes(
    value as CourseId,
  );
}