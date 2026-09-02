import { z } from "zod";

const moduleTitleSchema = z
  .string()
  .trim()
  .min(
    2,
    "Module title must contain at least 2 characters.",
  )
  .max(
    200,
    "Module title cannot exceed 200 characters.",
  );

const chapterTitleSchema = z
  .string()
  .trim()
  .min(
    2,
    "Chapter title must contain at least 2 characters.",
  )
  .max(
    200,
    "Chapter title cannot exceed 200 characters.",
  );

const descriptionSchema = z
  .string()
  .trim()
  .max(
    2000,
    "Description cannot exceed 2000 characters.",
  );

const videoUrlSchema = z
  .string()
  .trim()
  .url("Video URL must be a valid URL.")
  .max(
    2048,
    "Video URL cannot exceed 2048 characters.",
  );

const durationSecondsSchema = z
  .number()
  .int(
    "Video duration must be a whole number.",
  )
  .min(
    1,
    "Video duration must be at least 1 second.",
  )
  .max(
    86400,
    "Video duration cannot exceed 24 hours.",
  );

const courseIdSchema = z
  .string()
  .uuid(
    "Course ID must be a valid UUID.",
  );

const moduleIdSchema = z
  .string()
  .uuid(
    "Module ID must be a valid UUID.",
  );

const chapterIdSchema = z
  .string()
  .uuid(
    "Chapter ID must be a valid UUID.",
  );

export const nestedChapterSchema =
  z.object({
    title: chapterTitleSchema,

    description:
      descriptionSchema.optional(),

    videoUrl: videoUrlSchema,

    durationSeconds:
      durationSecondsSchema.optional(),

    isPreview:
      z.boolean().default(false),
  });

export const nestedCourseModuleSchema =
  z.object({
    title: moduleTitleSchema,

    description:
      descriptionSchema.optional(),

    chapters: z
      .array(nestedChapterSchema)
      .min(
        1,
        "A module must contain at least one chapter.",
      )
      .max(
        100,
        "A module cannot contain more than 100 chapters.",
      ),
  });

export const createModuleSchema =
  z.object({
    title: moduleTitleSchema,

    description:
      descriptionSchema.optional(),
  });

export const updateModuleSchema =
  z
    .object({
      title:
        moduleTitleSchema.optional(),

      description:
        descriptionSchema
          .nullable()
          .optional(),
    })
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          "At least one field must be provided.",
      },
    );

export const createChapterSchema =
  z.object({
    title: chapterTitleSchema,

    description:
      descriptionSchema.optional(),

    videoUrl: videoUrlSchema,

    durationSeconds:
      durationSecondsSchema.optional(),

    isPreview:
      z.boolean().default(false),
  });

export const updateChapterSchema =
  z
    .object({
      title:
        chapterTitleSchema.optional(),

      description:
        descriptionSchema
          .nullable()
          .optional(),

      videoUrl:
        videoUrlSchema.optional(),

      durationSeconds:
        durationSecondsSchema
          .nullable()
          .optional(),

      isPreview:
        z.boolean().optional(),
    })
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          "At least one field must be provided.",
      },
    );

export const courseIdParamsSchema =
  z.object({
    courseId: courseIdSchema,
  });

export const moduleIdParamsSchema =
  z.object({
    moduleId: moduleIdSchema,
  });

export const chapterIdParamsSchema =
  z.object({
    chapterId: chapterIdSchema,
  });

export const courseSlugParamsSchema =
  z.object({
    slug: z
      .string()
      .trim()
      .min(
        2,
        "Course slug is required.",
      )
      .max(220),
  });

export const reorderModulesSchema =
  z
    .object({
      moduleIds: z
        .array(moduleIdSchema)
        .min(
          1,
          "At least one Module ID is required.",
        ),
    })
    .refine(
      (data) =>
        new Set(data.moduleIds).size ===
        data.moduleIds.length,
      {
        path: ["moduleIds"],
        message:
          "Module IDs cannot contain duplicates.",
      },
    );

export const reorderChaptersSchema =
  z
    .object({
      chapterIds: z
        .array(chapterIdSchema)
        .min(
          1,
          "At least one Chapter ID is required.",
        ),
    })
    .refine(
      (data) =>
        new Set(data.chapterIds).size ===
        data.chapterIds.length,
      {
        path: ["chapterIds"],
        message:
          "Chapter IDs cannot contain duplicates.",
      },
    );

export type NestedCourseModuleInput =
  z.infer<
    typeof nestedCourseModuleSchema
  >;

export type CreateModuleInput =
  z.infer<typeof createModuleSchema>;

export type UpdateModuleInput =
  z.infer<typeof updateModuleSchema>;

export type CreateChapterInput =
  z.infer<typeof createChapterSchema>;

export type UpdateChapterInput =
  z.infer<typeof updateChapterSchema>;

export type CourseIdParams =
  z.infer<typeof courseIdParamsSchema>;

export type ModuleIdParams =
  z.infer<typeof moduleIdParamsSchema>;

export type ChapterIdParams =
  z.infer<typeof chapterIdParamsSchema>;

export type CourseSlugParams =
  z.infer<typeof courseSlugParamsSchema>;

export type ReorderModulesInput =
  z.infer<typeof reorderModulesSchema>;

export type ReorderChaptersInput =
  z.infer<typeof reorderChaptersSchema>;