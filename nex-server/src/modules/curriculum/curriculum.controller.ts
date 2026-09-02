import type { Request, Response } from "express";
import { sendSuccess } from "../../common/http/api-response.js";
import { getValidated } from "../../middlewares/validate-request.js";
import {
  createChapter,
  createCourseModule,
  deleteChapter,
  deleteCourseModule,
  getAdminCurriculum,
  getPublicCurriculum,
  reorderCourseModules,
  reorderModuleChapters,
  updateChapter,
  updateCourseModule,
} from "./curriculum.service.js";
import type {
  ChapterIdParams,
  CourseIdParams,
  CourseSlugParams,
  CreateChapterInput,
  CreateModuleInput,
  ModuleIdParams,
  ReorderChaptersInput,
  ReorderModulesInput,
  UpdateChapterInput,
  UpdateModuleInput,
} from "./curriculum.validation.js";

export async function createModuleController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<CourseIdParams>(res, "params");

  const input = getValidated<CreateModuleInput>(res, "body");

  const courseModule = await createCourseModule(params.courseId, input);

  sendSuccess(res, {
    statusCode: 201,
    message: "Course module created successfully.",
    data: {
      module: courseModule,
    },
  });
}

export async function updateModuleController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<ModuleIdParams>(res, "params");

  const input = getValidated<UpdateModuleInput>(res, "body");

  const courseModule = await updateCourseModule(params.moduleId, input);

  sendSuccess(res, {
    message: "Course module updated successfully.",
    data: {
      module: courseModule,
    },
  });
}

export async function deleteModuleController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<ModuleIdParams>(res, "params");

  const courseModule = await deleteCourseModule(params.moduleId);

  sendSuccess(res, {
    message: "Course module deleted successfully.",
    data: {
      module: courseModule,
    },
  });
}

export async function createChapterController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<ModuleIdParams>(res, "params");

  const input = getValidated<CreateChapterInput>(res, "body");

  const chapter = await createChapter(params.moduleId, input);

  sendSuccess(res, {
    statusCode: 201,
    message: "Chapter created successfully.",
    data: {
      chapter,
    },
  });
}

export async function updateChapterController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<ChapterIdParams>(res, "params");

  const input = getValidated<UpdateChapterInput>(res, "body");

  const chapter = await updateChapter(params.chapterId, input);

  sendSuccess(res, {
    message: "Chapter updated successfully.",
    data: {
      chapter,
    },
  });
}

export async function deleteChapterController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<ChapterIdParams>(res, "params");

  const chapter = await deleteChapter(params.chapterId);

  sendSuccess(res, {
    message: "Chapter deleted successfully.",
    data: {
      chapter,
    },
  });
}

export async function getAdminCurriculumController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<CourseIdParams>(res, "params");

  const course = await getAdminCurriculum(params.courseId);

  sendSuccess(res, {
    message: "Course curriculum retrieved successfully.",
    data: {
      course,
    },
  });
}

export async function getPublicCurriculumController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<CourseSlugParams>(res, "params");

  const course = await getPublicCurriculum(params.slug);

  sendSuccess(res, {
    message: "Public course curriculum retrieved successfully.",
    data: {
      course,
    },
  });
}

export async function reorderModulesController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<CourseIdParams>(res, "params");

  const input = getValidated<ReorderModulesInput>(res, "body");

  const modules = await reorderCourseModules(params.courseId, input);

  sendSuccess(res, {
    message: "Course modules reordered successfully.",
    data: {
      modules,
    },
  });
}

export async function reorderChaptersController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<ModuleIdParams>(res, "params");

  const input = getValidated<ReorderChaptersInput>(res, "body");

  const chapters = await reorderModuleChapters(params.moduleId, input);

  sendSuccess(res, {
    message: "Chapters reordered successfully.",
    data: {
      chapters,
    },
  });
}
