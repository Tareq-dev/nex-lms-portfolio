import type { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../common/errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import { createSlug } from "../../utils/slug.js";
import type {
  CreateChapterInput,
  CreateModuleInput,
  ReorderChaptersInput,
  ReorderModulesInput,
  UpdateChapterInput,
  UpdateModuleInput,
} from "./curriculum.validation.js";

const chapterAdminSelect = {
  id: true,
  title: true,
  description: true,
  videoUrl: true,
  durationSeconds: true,
  isPreview: true,
  position: true,
  createdAt: true,
  updatedAt: true,
} as const;

const moduleAdminSelect = {
  id: true,
  title: true,
  description: true,
  position: true,
  createdAt: true,
  updatedAt: true,

  chapters: {
    orderBy: {
      position: "asc",
    },

    select: chapterAdminSelect,
  },
} as const;

const curriculumSelect = {
  id: true,
  title: true,
  slug: true,
  status: true,

  modules: {
    orderBy: {
      position: "asc",
    },

    select: moduleAdminSelect,
  },
} as const;

function courseNotFound(): AppError {
  return new AppError(404, "COURSE_NOT_FOUND", "Course was not found.");
}

function moduleNotFound(): AppError {
  return new AppError(404, "MODULE_NOT_FOUND", "Course module was not found.");
}

function chapterNotFound(): AppError {
  return new AppError(404, "CHAPTER_NOT_FOUND", "Chapter was not found.");
}

async function findCourseOrThrow(courseId: string) {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },

    select: {
      id: true,
      status: true,
    },
  });

  if (!course) {
    throw courseNotFound();
  }

  return course;
}

async function findModuleOrThrow(moduleId: string) {
  const courseModule = await prisma.courseModule.findUnique({
    where: {
      id: moduleId,
    },

    select: {
      id: true,
      courseId: true,
      position: true,
    },
  });

  if (!courseModule) {
    throw moduleNotFound();
  }

  return courseModule;
}

async function findChapterOrThrow(chapterId: string) {
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
    },

    select: {
      id: true,
      moduleId: true,
      position: true,
    },
  });

  if (!chapter) {
    throw chapterNotFound();
  }

  return chapter;
}

function assertExactOrder(
  receivedIds: string[],
  existingIds: string[],
  resource: "module" | "chapter",
): void {
  const existingSet = new Set(existingIds);

  const receivedSet = new Set(receivedIds);

  const containsExactIds =
    receivedIds.length === existingIds.length &&
    receivedSet.size === existingSet.size &&
    receivedIds.every((id) => existingSet.has(id));

  if (!containsExactIds) {
    const field = resource === "module" ? "moduleIds" : "chapterIds";

    const code =
      resource === "module" ? "INVALID_MODULE_ORDER" : "INVALID_CHAPTER_ORDER";

    throw new AppError(400, code, `The ${resource} order is invalid.`, [
      {
        field,
        message: `Provide every ${resource} ID exactly once.`,
      },
    ]);
  }
}

export async function createCourseModule(
  courseId: string,
  input: CreateModuleInput,
) {
  await findCourseOrThrow(courseId);

  return prisma.$transaction(async (transaction) => {
    const positionResult = await transaction.courseModule.aggregate({
      where: {
        courseId,
      },

      _max: {
        position: true,
      },
    });

    const nextPosition = (positionResult._max.position ?? 0) + 1;

    return transaction.courseModule.create({
      data: {
        courseId,
        title: input.title,
        description: input.description ?? null,
        position: nextPosition,
      },

      select: moduleAdminSelect,
    });
  });
}

export async function updateCourseModule(
  moduleId: string,
  input: UpdateModuleInput,
) {
  await findModuleOrThrow(moduleId);

  const data: Prisma.CourseModuleUpdateInput = {};

  if (input.title !== undefined) {
    data.title = input.title;
  }

  if (input.description !== undefined) {
    data.description = input.description;
  }

  return prisma.courseModule.update({
    where: {
      id: moduleId,
    },

    data,

    select: moduleAdminSelect,
  });
}

export async function deleteCourseModule(moduleId: string) {
  await findModuleOrThrow(moduleId);

  return prisma.courseModule.delete({
    where: {
      id: moduleId,
    },

    select: {
      id: true,
      title: true,
      courseId: true,
      position: true,
    },
  });
}

export async function createChapter(
  moduleId: string,
  input: CreateChapterInput,
) {
  await findModuleOrThrow(moduleId);

  return prisma.$transaction(async (transaction) => {
    const positionResult = await transaction.chapter.aggregate({
      where: {
        moduleId,
      },

      _max: {
        position: true,
      },
    });

    const nextPosition = (positionResult._max.position ?? 0) + 1;

    return transaction.chapter.create({
      data: {
        moduleId,
        title: input.title,
        description: input.description ?? null,
        videoUrl: input.videoUrl,
        durationSeconds: input.durationSeconds ?? null,
        isPreview: input.isPreview,
        position: nextPosition,
      },

      select: chapterAdminSelect,
    });
  });
}

export async function updateChapter(
  chapterId: string,
  input: UpdateChapterInput,
) {
  await findChapterOrThrow(chapterId);

  const data: Prisma.ChapterUpdateInput = {};

  if (input.title !== undefined) {
    data.title = input.title;
  }

  if (input.description !== undefined) {
    data.description = input.description;
  }

  if (input.videoUrl !== undefined) {
    data.videoUrl = input.videoUrl;
  }

  if (input.durationSeconds !== undefined) {
    data.durationSeconds = input.durationSeconds;
  }

  if (input.isPreview !== undefined) {
    data.isPreview = input.isPreview;
  }

  return prisma.chapter.update({
    where: {
      id: chapterId,
    },

    data,

    select: chapterAdminSelect,
  });
}

export async function deleteChapter(chapterId: string) {
  await findChapterOrThrow(chapterId);

  return prisma.chapter.delete({
    where: {
      id: chapterId,
    },

    select: chapterAdminSelect,
  });
}

export async function getAdminCurriculum(courseId: string) {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },

    select: curriculumSelect,
  });

  if (!course) {
    throw courseNotFound();
  }

  return course;
}

export async function getPublicCurriculum(slugInput: string) {
  const course = await prisma.course.findFirst({
    where: {
      slug: createSlug(slugInput),

      status: "PUBLISHED",

      category: {
        is: {
          isActive: true,
        },
      },
    },

    select: curriculumSelect,
  });

  if (!course) {
    throw courseNotFound();
  }

  return {
    ...course,

    modules: course.modules.map((courseModule) => ({
      ...courseModule,

      chapters: courseModule.chapters.map((chapter) => ({
        id: chapter.id,

        title: chapter.title,

        description: chapter.description,

        durationSeconds: chapter.durationSeconds,

        isPreview: chapter.isPreview,

        position: chapter.position,

        videoUrl: chapter.isPreview ? chapter.videoUrl : null,

        isLocked: !chapter.isPreview,

        createdAt: chapter.createdAt,

        updatedAt: chapter.updatedAt,
      })),
    })),
  };
}

export async function reorderCourseModules(
  courseId: string,
  input: ReorderModulesInput,
) {
  await findCourseOrThrow(courseId);

  const existingModules = await prisma.courseModule.findMany({
    where: {
      courseId,
    },

    orderBy: {
      position: "asc",
    },

    select: {
      id: true,
      position: true,
    },
  });

  assertExactOrder(
    input.moduleIds,
    existingModules.map((courseModule) => courseModule.id),
    "module",
  );

  const maximumPosition = Math.max(
    0,
    ...existingModules.map((courseModule) => courseModule.position),
  );

  const temporaryStart = maximumPosition + existingModules.length + 1;

  await prisma.$transaction(async (transaction) => {
    for (let index = 0; index < input.moduleIds.length; index += 1) {
      await transaction.courseModule.update({
        where: {
          id: input.moduleIds[index],
        },

        data: {
          position: temporaryStart + index,
        },
      });
    }

    for (let index = 0; index < input.moduleIds.length; index += 1) {
      await transaction.courseModule.update({
        where: {
          id: input.moduleIds[index],
        },

        data: {
          position: index + 1,
        },
      });
    }
  });

  return prisma.courseModule.findMany({
    where: {
      courseId,
    },

    orderBy: {
      position: "asc",
    },

    select: moduleAdminSelect,
  });
}

export async function reorderModuleChapters(
  moduleId: string,
  input: ReorderChaptersInput,
) {
  await findModuleOrThrow(moduleId);

  const existingChapters = await prisma.chapter.findMany({
    where: {
      moduleId,
    },

    orderBy: {
      position: "asc",
    },

    select: {
      id: true,
      position: true,
    },
  });

  assertExactOrder(
    input.chapterIds,
    existingChapters.map((chapter) => chapter.id),
    "chapter",
  );

  const maximumPosition = Math.max(
    0,
    ...existingChapters.map((chapter) => chapter.position),
  );

  const temporaryStart = maximumPosition + existingChapters.length + 1;

  await prisma.$transaction(async (transaction) => {
    for (let index = 0; index < input.chapterIds.length; index += 1) {
      await transaction.chapter.update({
        where: {
          id: input.chapterIds[index],
        },

        data: {
          position: temporaryStart + index,
        },
      });
    }

    for (let index = 0; index < input.chapterIds.length; index += 1) {
      await transaction.chapter.update({
        where: {
          id: input.chapterIds[index],
        },

        data: {
          position: index + 1,
        },
      });
    }
  });

  return prisma.chapter.findMany({
    where: {
      moduleId,
    },

    orderBy: {
      position: "asc",
    },

    select: chapterAdminSelect,
  });
}
