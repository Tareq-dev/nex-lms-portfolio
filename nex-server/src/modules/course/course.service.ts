import type { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../common/errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import { createSlug } from "../../utils/slug.js";
import type {
  AdminCourseListQuery,
  CreateCourseInput,
  PublicCourseListQuery,
  AssignCourseInstructorInput,
  UpdateCourseInput,
} from "./course.validation.js";

const courseSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  description: true,
  thumbnailUrl: true,
  price: true,
  discountPrice: true,
  level: true,
  status: true,
  isFeatured: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
    },
  },
  instructor: {
    select: {
      id: true,
      name: true,
      avatarUrl: true,
    },
  },
} as const;

function createPagination(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

function courseNotFound(): AppError {
  return new AppError(404, "COURSE_NOT_FOUND", "Course was not found.");
}

function invalidDiscountPrice(): AppError {
  return new AppError(
    400,
    "INVALID_DISCOUNT_PRICE",
    "Discount price must be lower than the regular price.",
    [
      {
        field: "discountPrice",
        message: "Discount price must be lower than the regular price.",
      },
    ],
  );
}

async function assertActiveCategory(categoryId: string) {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!category) {
    throw new AppError(404, "CATEGORY_NOT_FOUND", "Category was not found.", [
      {
        field: "categoryId",
        message: "The selected category does not exist.",
      },
    ]);
  }

  if (!category.isActive) {
    throw new AppError(
      400,
      "CATEGORY_NOT_ACTIVE",
      "The selected category is not active.",
      [
        {
          field: "categoryId",
          message: "Choose an active category.",
        },
      ],
    );
  }

  return category;
}

async function findCourseOrThrow(courseId: string) {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: courseSelect,
  });

  if (!course) {
    throw courseNotFound();
  }

  return course;
}

function buildOrderBy(
  sort: PublicCourseListQuery["sort"],
): Prisma.CourseOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return {
        createdAt: "asc",
      };

    case "price_asc":
      return {
        price: "asc",
      };

    case "price_desc":
      return {
        price: "desc",
      };

    case "title_asc":
      return {
        title: "asc",
      };

    case "newest":
    default:
      return {
        createdAt: "desc",
      };
  }
}

function applyCommonFilters(
  where: Prisma.CourseWhereInput,
  query: PublicCourseListQuery,
): void {
  if (query.search) {
    where.OR = [
      {
        title: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        shortDescription: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (query.level) {
    where.level = query.level;
  }

  if (query.isFeatured !== undefined) {
    where.isFeatured = query.isFeatured;
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {
      ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
      ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
    };
  }
}

export async function createCourse(
  input: CreateCourseInput,
) {
  await assertActiveCategory(
    input.categoryId,
  );

  const slug =
    createSlug(input.title);

  const existingCourse =
    await prisma.course.findFirst({
      where: {
        OR: [
          {
            slug,
          },
          {
            title: {
              equals: input.title,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

  if (existingCourse) {
    throw new AppError(
      409,
      "COURSE_ALREADY_EXISTS",
      "A course with this title already exists.",
      [
        {
          field:
            existingCourse.slug === slug
              ? "slug"
              : "title",
          message:
            "This course already exists.",
        },
      ],
    );
  }

  return prisma.course.create({
    data: {
      categoryId:
        input.categoryId,

      title:
        input.title,

      slug,

      shortDescription:
        input.shortDescription,

      description:
        input.description,

      thumbnailUrl:
        input.thumbnailUrl ?? null,

      price:
        input.price,

      discountPrice:
        input.discountPrice ?? null,

      level:
        input.level,

      isFeatured:
        input.isFeatured,

      status:
        "DRAFT",

      modules:
        input.modules.length > 0
          ? {
              create:
                input.modules.map(
                  (
                    courseModule,
                    moduleIndex,
                  ) => ({
                    title:
                      courseModule.title,

                    description:
                      courseModule.description ??
                      null,

                    position:
                      moduleIndex + 1,

                    chapters: {
                      create:
                        courseModule.chapters.map(
                          (
                            chapter,
                            chapterIndex,
                          ) => ({
                            title:
                              chapter.title,

                            description:
                              chapter.description ??
                              null,

                            videoUrl:
                              chapter.videoUrl,

                            durationSeconds:
                              chapter.durationSeconds ??
                              null,

                            isPreview:
                              chapter.isPreview,

                            position:
                              chapterIndex + 1,
                          }),
                        ),
                    },
                  }),
                ),
            }
          : undefined,
    },

    select: courseSelect,
  });
}

export async function listPublicCourses(query: PublicCourseListQuery) {
  const skip = (query.page - 1) * query.limit;

  const where: Prisma.CourseWhereInput = {
    status: "PUBLISHED",
    category: {
      is: {
        isActive: true,
        ...(query.category
          ? {
              slug: createSlug(query.category),
            }
          : {}),
      },
    },
  };

  applyCommonFilters(where, query);

  const [courses, total] = await prisma.$transaction([
    prisma.course.findMany({
      where,
      skip,
      take: query.limit,
      orderBy: buildOrderBy(query.sort),
      select: courseSelect,
    }),

    prisma.course.count({
      where,
    }),
  ]);

  return {
    courses,
    pagination: createPagination(query.page, query.limit, total),
  };
}

export async function listAdminCourses(
  query: AdminCourseListQuery,
) {
  const skip =
    (query.page - 1) * query.limit;

  const where: Prisma.CourseWhereInput = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.instructorId) {
    where.instructorId =
      query.instructorId;
  }

  if (query.category) {
    where.category = {
      is: {
        slug: createSlug(query.category),
      },
    };
  }

  applyCommonFilters(where, query);

  const [courses, total] =
    await prisma.$transaction([
      prisma.course.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: buildOrderBy(query.sort),
        select: courseSelect,
      }),

      prisma.course.count({
        where,
      }),
    ]);

  return {
    courses,
    pagination: createPagination(
      query.page,
      query.limit,
      total,
    ),
  };
}

export async function getPublicCourseBySlug(slugInput: string) {
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
    select: courseSelect,
  });

  if (!course) {
    throw courseNotFound();
  }

  return course;
}

export async function getAdminCourseById(courseId: string) {
  return findCourseOrThrow(courseId);
}

export async function updateCourse(courseId: string, input: UpdateCourseInput) {
  const currentCourse = await findCourseOrThrow(courseId);

  if (input.categoryId !== undefined) {
    await assertActiveCategory(input.categoryId);
  }

  const nextPrice = input.price ?? Number(currentCourse.price);

  const nextDiscountPrice =
    input.discountPrice !== undefined
      ? input.discountPrice
      : currentCourse.discountPrice === null
        ? null
        : Number(currentCourse.discountPrice);

  if (nextDiscountPrice !== null && nextDiscountPrice >= nextPrice) {
    throw invalidDiscountPrice();
  }

  const nextSlug =
    input.slug !== undefined ? createSlug(input.slug) : undefined;

  const duplicateConditions: Prisma.CourseWhereInput[] = [];

  if (input.title !== undefined) {
    duplicateConditions.push({
      title: {
        equals: input.title,
        mode: "insensitive",
      },
    });
  }

  if (nextSlug !== undefined) {
    duplicateConditions.push({
      slug: nextSlug,
    });
  }

  if (duplicateConditions.length > 0) {
    const duplicateCourse = await prisma.course.findFirst({
      where: {
        id: {
          not: courseId,
        },
        OR: duplicateConditions,
      },
      select: {
        id: true,
      },
    });

    if (duplicateCourse) {
      throw new AppError(
        409,
        "COURSE_ALREADY_EXISTS",
        "Another course already uses this title or slug.",
      );
    }
  }

  const updateData: Prisma.CourseUncheckedUpdateInput = {};

  if (input.categoryId !== undefined) {
    updateData.categoryId = input.categoryId;
  }

  if (input.title !== undefined) {
    updateData.title = input.title;
  }

  if (nextSlug !== undefined) {
    updateData.slug = nextSlug;
  }

  if (input.shortDescription !== undefined) {
    updateData.shortDescription = input.shortDescription;
  }

  if (input.description !== undefined) {
    updateData.description = input.description;
  }

  if (input.thumbnailUrl !== undefined) {
    updateData.thumbnailUrl = input.thumbnailUrl;
  }

  if (input.price !== undefined) {
    updateData.price = input.price;
  }

  if (input.discountPrice !== undefined) {
    updateData.discountPrice = input.discountPrice;
  }

  if (input.level !== undefined) {
    updateData.level = input.level;
  }

  if (input.isFeatured !== undefined) {
    updateData.isFeatured = input.isFeatured;
  }

  return prisma.course.update({
    where: {
      id: courseId,
    },
    data: updateData,
    select: courseSelect,
  });
}

export async function publishCourse(courseId: string) {
  const course = await findCourseOrThrow(courseId);

  if (course.status === "ARCHIVED") {
    throw new AppError(
      409,
      "COURSE_ARCHIVED",
      "Restore the archived course before publishing it.",
    );
  }

  if (!course.category.isActive) {
    throw new AppError(
      400,
      "CATEGORY_NOT_ACTIVE",
      "Activate the course category before publishing this course.",
    );
  }

  if (course.status === "PUBLISHED") {
    return course;
  }

  return prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
    select: courseSelect,
  });
}

export async function archiveCourse(courseId: string) {
  const course = await findCourseOrThrow(courseId);

  if (course.status === "ARCHIVED") {
    return course;
  }

  return prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      status: "ARCHIVED",
    },
    select: courseSelect,
  });
}

export async function restoreCourse(courseId: string) {
  const course = await findCourseOrThrow(courseId);

  if (course.status !== "ARCHIVED") {
    return course;
  }

  await assertActiveCategory(course.category.id);

  return prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      status: "DRAFT",
      publishedAt: null,
    },
    select: courseSelect,
  });
}
export async function assignCourseInstructor(
  courseId: string,
  input: AssignCourseInstructorInput,
) {
  await findCourseOrThrow(courseId);

  const instructor = await prisma.user.findUnique({
    where: {
      id: input.instructorId,
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!instructor) {
    throw new AppError(
      404,
      "INSTRUCTOR_NOT_FOUND",
      "Instructor was not found.",
      [
        {
          field: "instructorId",
          message: "The selected user does not exist.",
        },
      ],
    );
  }

  if (instructor.role !== "INSTRUCTOR") {
    throw new AppError(
      400,
      "USER_NOT_INSTRUCTOR",
      "The selected user is not an instructor.",
      [
        {
          field: "instructorId",
          message: "Choose a user whose role is INSTRUCTOR.",
        },
      ],
    );
  }

  if (instructor.status !== "ACTIVE") {
    throw new AppError(
      400,
      "INSTRUCTOR_NOT_ACTIVE",
      "The selected instructor is not active.",
      [
        {
          field: "instructorId",
          message: "Choose an active instructor.",
        },
      ],
    );
  }

  return prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      instructor: {
        connect: {
          id: instructor.id,
        },
      },
    },
    select: courseSelect,
  });
}
export async function removeCourseInstructor(
  courseId: string,
) {
  const course =
    await findCourseOrThrow(courseId);

  if (!course.instructor) {
    return course;
  }

  return prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      instructor: {
        disconnect: true,
      },
    },
    select: courseSelect,
  });
}