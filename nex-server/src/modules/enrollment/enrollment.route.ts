import { Router } from "express";
import { UserRole } from "../../generated/prisma/enums.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/authorize.middleware.js";
import {
  changeEnrollmentStatus,
  createEnrollmentAsAdmin,
  enrollCourse,
  getEnrollmentsAsAdmin,
  getOwnEnrollment,
  getOwnEnrollments,
  playChapter,
} from "./enrollment.controller.js";
import {
  adminEnrollmentListQuerySchema,
  chapterPlaybackParamsSchema,
  courseEnrollmentParamsSchema,
  createAdminEnrollmentSchema,
  enrollmentParamsSchema,
  myEnrollmentListQuerySchema,
  updateEnrollmentStatusSchema,
} from "./enrollment.validation.js";

export const courseEnrollmentRouter = Router();

export const enrollmentRouter = Router();

export const adminEnrollmentRouter = Router();

export const chapterAccessRouter = Router();

const studentOnly = authorizeRoles(UserRole.STUDENT);

const adminOnly = authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN);

courseEnrollmentRouter.post(
  "/:courseId/enroll",
  asyncHandler(authenticate),
  studentOnly,
  validateRequest({
    params: courseEnrollmentParamsSchema,
  }),
  asyncHandler(enrollCourse),
);

enrollmentRouter.get(
  "/me",
  asyncHandler(authenticate),
  studentOnly,
  validateRequest({
    query: myEnrollmentListQuerySchema,
  }),
  asyncHandler(getOwnEnrollments),
);

enrollmentRouter.get(
  "/me/:courseId",
  asyncHandler(authenticate),
  studentOnly,
  validateRequest({
    params: courseEnrollmentParamsSchema,
  }),
  asyncHandler(getOwnEnrollment),
);

adminEnrollmentRouter.post(
  "/",
  asyncHandler(authenticate),
  adminOnly,
  validateRequest({
    body: createAdminEnrollmentSchema,
  }),
  asyncHandler(createEnrollmentAsAdmin),
);

adminEnrollmentRouter.get(
  "/",
  asyncHandler(authenticate),
  adminOnly,
  validateRequest({
    query: adminEnrollmentListQuerySchema,
  }),
  asyncHandler(getEnrollmentsAsAdmin),
);

adminEnrollmentRouter.patch(
  "/:enrollmentId",
  asyncHandler(authenticate),
  adminOnly,
  validateRequest({
    params: enrollmentParamsSchema,
    body: updateEnrollmentStatusSchema,
  }),
  asyncHandler(changeEnrollmentStatus),
);

chapterAccessRouter.get(
  "/:chapterId/playback",
  asyncHandler(authenticate),
  validateRequest({
    params: chapterPlaybackParamsSchema,
  }),
  asyncHandler(playChapter),
);
