import { z } from "zod";

const enrollmentStatusSchema = z.enum([
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
]);

const pageSchema = z.coerce
  .number()
  .int()
  .min(1)
  .default(1);

const limitSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(100)
  .default(10);

export const courseEnrollmentParamsSchema = z
  .object({
    courseId: z
      .string()
      .uuid("Course ID must be a valid UUID."),
  })
  .strict();

export const enrollmentParamsSchema = z
  .object({
    enrollmentId: z
      .string()
      .uuid("Enrollment ID must be a valid UUID."),
  })
  .strict();

export const chapterPlaybackParamsSchema = z
  .object({
    chapterId: z
      .string()
      .uuid("Chapter ID must be a valid UUID."),
  })
  .strict();

export const createAdminEnrollmentSchema = z
  .object({
    studentId: z
      .string()
      .uuid("Student ID must be a valid UUID."),

    courseId: z
      .string()
      .uuid("Course ID must be a valid UUID."),
  })
  .strict();

export const updateEnrollmentStatusSchema = z
  .object({
    status: enrollmentStatusSchema,
  })
  .strict();

export const myEnrollmentListQuerySchema = z
  .object({
    page: pageSchema,
    limit: limitSchema,
    status: enrollmentStatusSchema.optional(),
  })
  .strict();

export const adminEnrollmentListQuerySchema = z
  .object({
    page: pageSchema,
    limit: limitSchema,

    search: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional(),

    status: enrollmentStatusSchema.optional(),

    studentId: z
      .string()
      .uuid("Student ID must be a valid UUID.")
      .optional(),

    courseId: z
      .string()
      .uuid("Course ID must be a valid UUID.")
      .optional(),
  })
  .strict();

export type CourseEnrollmentParams = z.infer<
  typeof courseEnrollmentParamsSchema
>;

export type EnrollmentParams = z.infer<
  typeof enrollmentParamsSchema
>;

export type ChapterPlaybackParams = z.infer<
  typeof chapterPlaybackParamsSchema
>;

export type CreateAdminEnrollmentInput = z.infer<
  typeof createAdminEnrollmentSchema
>;

export type UpdateEnrollmentStatusInput = z.infer<
  typeof updateEnrollmentStatusSchema
>;

export type MyEnrollmentListQuery = z.infer<
  typeof myEnrollmentListQuerySchema
>;

export type AdminEnrollmentListQuery = z.infer<
  typeof adminEnrollmentListQuerySchema
>;