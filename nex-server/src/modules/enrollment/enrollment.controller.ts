import type { Request, Response } from "express";
import { AppError } from "../../common/errors/app-error.js";
import { getValidated } from "../../middlewares/validate-request.js";
import { sendSuccess } from "../../common/http/api-response.js";
import {
  createAdminEnrollment,
  enrollInFreeCourse,
  getChapterPlayback,
  getMyEnrollment,
  listAdminEnrollments,
  listMyEnrollments,
  updateEnrollmentStatus,
} from "./enrollment.service.js";
import type {
  AdminEnrollmentListQuery,
  ChapterPlaybackParams,
  CourseEnrollmentParams,
  CreateAdminEnrollmentInput,
  EnrollmentParams,
  MyEnrollmentListQuery,
  UpdateEnrollmentStatusInput,
} from "./enrollment.validation.js";

function requireAuthenticatedUser(req: Request) {
  if (!req.user) {
    throw new AppError(401, "UNAUTHENTICATED", "Authentication is required.");
  }

  return req.user;
}

export async function enrollCourse(req: Request, res: Response): Promise<void> {
  const user = requireAuthenticatedUser(req);

  const params = getValidated<CourseEnrollmentParams>(res, "params");

  const result = await enrollInFreeCourse(user.id, params.courseId);

  sendSuccess(res, {
    statusCode: result.created ? 201 : 200,

    message: result.created
      ? "Course enrollment completed successfully."
      : "You are already enrolled in this course.",

    data: {
      enrollment: result.enrollment,
    },
  });
}

export async function getOwnEnrollments(
  req: Request,
  res: Response,
): Promise<void> {
  const user = requireAuthenticatedUser(req);

  const query = getValidated<MyEnrollmentListQuery>(res, "query");

  const result = await listMyEnrollments(user.id, query);

  sendSuccess(res, {
    message: "Enrollments retrieved successfully.",

    data: {
      enrollments: result.enrollments,
    },

    meta: result.pagination,
  });
}

export async function getOwnEnrollment(
  req: Request,
  res: Response,
): Promise<void> {
  const user = requireAuthenticatedUser(req);

  const params = getValidated<CourseEnrollmentParams>(res, "params");

  const enrollment = await getMyEnrollment(user.id, params.courseId);

  sendSuccess(res, {
    message: "Enrollment retrieved successfully.",

    data: {
      enrollment,
    },
  });
}

export async function createEnrollmentAsAdmin(
  _req: Request,
  res: Response,
): Promise<void> {
  const input = getValidated<CreateAdminEnrollmentInput>(res, "body");

  const result = await createAdminEnrollment(input);

  sendSuccess(res, {
    statusCode: result.created ? 201 : 200,

    message: result.created
      ? "Enrollment created successfully."
      : "The student is already enrolled in this course.",

    data: {
      enrollment: result.enrollment,
    },
  });
}

export async function getEnrollmentsAsAdmin(
  _req: Request,
  res: Response,
): Promise<void> {
  const query = getValidated<AdminEnrollmentListQuery>(res, "query");

  const result = await listAdminEnrollments(query);

  sendSuccess(res, {
    message: "Enrollments retrieved successfully.",

    data: {
      enrollments: result.enrollments,
    },

    meta: result.pagination,
  });
}

export async function changeEnrollmentStatus(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<EnrollmentParams>(res, "params");

  const input = getValidated<UpdateEnrollmentStatusInput>(res, "body");

  const enrollment = await updateEnrollmentStatus(params.enrollmentId, input);

  sendSuccess(res, {
    message: "Enrollment status updated successfully.",

    data: {
      enrollment,
    },
  });
}

export async function playChapter(req: Request, res: Response): Promise<void> {
  const user = requireAuthenticatedUser(req);

  const params = getValidated<ChapterPlaybackParams>(res, "params");

  const playback = await getChapterPlayback(params.chapterId, {
    id: user.id,
    role: user.role,
  });

  sendSuccess(res, {
    message: "Chapter playback retrieved successfully.",

    data: playback,
  });
}
