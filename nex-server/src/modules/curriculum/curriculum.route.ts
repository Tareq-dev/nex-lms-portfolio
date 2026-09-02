import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/authorize.middleware.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  createChapterController,
  createModuleController,
  deleteChapterController,
  deleteModuleController,
  getAdminCurriculumController,
  getPublicCurriculumController,
  reorderChaptersController,
  reorderModulesController,
  updateChapterController,
  updateModuleController,
} from "./curriculum.controller.js";
import {
  chapterIdParamsSchema,
  courseIdParamsSchema,
  courseSlugParamsSchema,
  createChapterSchema,
  createModuleSchema,
  moduleIdParamsSchema,
  reorderChaptersSchema,
  reorderModulesSchema,
  updateChapterSchema,
  updateModuleSchema,
} from "./curriculum.validation.js";

export const courseCurriculumRouter = Router();

export const moduleRouter = Router();

export const chapterRouter = Router();

const adminOnly = [
  asyncHandler(authenticate),

  authorizeRoles("ADMIN", "SUPER_ADMIN"),
];

courseCurriculumRouter.get(
  "/slug/:slug/curriculum",

  validateRequest({
    params: courseSlugParamsSchema,
  }),

  asyncHandler(getPublicCurriculumController),
);

courseCurriculumRouter.get(
  "/:courseId/curriculum",

  ...adminOnly,

  validateRequest({
    params: courseIdParamsSchema,
  }),

  asyncHandler(getAdminCurriculumController),
);

courseCurriculumRouter.post(
  "/:courseId/modules",

  ...adminOnly,

  validateRequest({
    params: courseIdParamsSchema,

    body: createModuleSchema,
  }),

  asyncHandler(createModuleController),
);

courseCurriculumRouter.patch(
  "/:courseId/modules/reorder",

  ...adminOnly,

  validateRequest({
    params: courseIdParamsSchema,

    body: reorderModulesSchema,
  }),

  asyncHandler(reorderModulesController),
);

moduleRouter.post(
  "/:moduleId/chapters",

  ...adminOnly,

  validateRequest({
    params: moduleIdParamsSchema,

    body: createChapterSchema,
  }),

  asyncHandler(createChapterController),
);

moduleRouter.patch(
  "/:moduleId/chapters/reorder",

  ...adminOnly,

  validateRequest({
    params: moduleIdParamsSchema,

    body: reorderChaptersSchema,
  }),

  asyncHandler(reorderChaptersController),
);

moduleRouter.patch(
  "/:moduleId",

  ...adminOnly,

  validateRequest({
    params: moduleIdParamsSchema,

    body: updateModuleSchema,
  }),

  asyncHandler(updateModuleController),
);

moduleRouter.delete(
  "/:moduleId",

  ...adminOnly,

  validateRequest({
    params: moduleIdParamsSchema,
  }),

  asyncHandler(deleteModuleController),
);

chapterRouter.patch(
  "/:chapterId",

  ...adminOnly,

  validateRequest({
    params: chapterIdParamsSchema,

    body: updateChapterSchema,
  }),

  asyncHandler(updateChapterController),
);

chapterRouter.delete(
  "/:chapterId",

  ...adminOnly,

  validateRequest({
    params: chapterIdParamsSchema,
  }),

  asyncHandler(deleteChapterController),
);
