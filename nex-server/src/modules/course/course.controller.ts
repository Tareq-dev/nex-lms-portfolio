import type { Request, Response } from "express";
import { sendSuccess } from "../../common/http/api-response.js";
import { getValidated } from "../../middlewares/validate-request.js";
import {
  archiveCourse,
  createCourse,
  getAdminCourseById,
  getPublicCourseBySlug,
  listAdminCourses,
  listPublicCourses,
  publishCourse,
  assignCourseInstructor,
  removeCourseInstructor,
  restoreCourse,
  updateCourse,
} from "./course.service.js";
import type {
  AdminCourseListQuery,
  CourseIdParams,
  CourseSlugParams,
  CreateCourseInput,
  AssignCourseInstructorInput,
  PublicCourseListQuery,
  UpdateCourseInput,
} from "./course.validation.js";

export async function createCourseController(
  _req: Request,
  res: Response,
): Promise<void> {
  const input = getValidated<CreateCourseInput>(res, "body");

  const course = await createCourse(input);

  sendSuccess(res, {
    statusCode: 201,
    message: "Course created successfully as a draft.",
    data: {
      course,
    },
  });
}

export async function listPublicCoursesController(
  _req: Request,
  res: Response,
): Promise<void> {
  const query = getValidated<PublicCourseListQuery>(res, "query");

  const result = await listPublicCourses(query);

  sendSuccess(res, {
    message: "Courses retrieved successfully.",
    data: {
      courses: result.courses,
    },
    meta: result.pagination,
  });
}

export async function listAdminCoursesController(
  _req: Request,
  res: Response,
): Promise<void> {
  const query = getValidated<AdminCourseListQuery>(res, "query");

  const result = await listAdminCourses(query);

  sendSuccess(res, {
    message: "Admin courses retrieved successfully.",
    data: {
      courses: result.courses,
    },
    meta: result.pagination,
  });
}

export async function getPublicCourseBySlugController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<CourseSlugParams>(res, "params");

  const course = await getPublicCourseBySlug(params.slug);

  sendSuccess(res, {
    message: "Course retrieved successfully.",
    data: {
      course,
    },
  });
}

export async function getAdminCourseByIdController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<CourseIdParams>(res, "params");

  const course = await getAdminCourseById(params.courseId);

  sendSuccess(res, {
    message: "Course retrieved successfully.",
    data: {
      course,
    },
  });
}

export async function updateCourseController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<CourseIdParams>(res, "params");

  const input = getValidated<UpdateCourseInput>(res, "body");

  const course = await updateCourse(params.courseId, input);

  sendSuccess(res, {
    message: "Course updated successfully.",
    data: {
      course,
    },
  });
}

export async function publishCourseController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<CourseIdParams>(res, "params");

  const course = await publishCourse(params.courseId);

  sendSuccess(res, {
    message: "Course published successfully.",
    data: {
      course,
    },
  });
}

export async function archiveCourseController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<CourseIdParams>(res, "params");

  const course = await archiveCourse(params.courseId);

  sendSuccess(res, {
    message: "Course archived successfully.",
    data: {
      course,
    },
  });
}

export async function restoreCourseController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<CourseIdParams>(res, "params");

  const course = await restoreCourse(params.courseId);

  sendSuccess(res, {
    message: "Course restored as a draft.",
    data: {
      course,
    },
  });
}
export async function assignCourseInstructorController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<CourseIdParams>(res, "params");

  const input = getValidated<AssignCourseInstructorInput>(res, "body");

  const course = await assignCourseInstructor(params.courseId, input);

  sendSuccess(res, {
    message: "Instructor assigned successfully.",
    data: {
      course,
    },
  });
}

export async function removeCourseInstructorController(
  _req: Request,
  res: Response,
): Promise<void> {
  const params = getValidated<CourseIdParams>(res, "params");

  const course = await removeCourseInstructor(params.courseId);

  sendSuccess(res, {
    message: "Instructor removed successfully.",
    data: {
      course,
    },
  });
}
