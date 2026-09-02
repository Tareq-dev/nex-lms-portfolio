import request from "supertest";
import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import app from "../src/app.js";
import {
  UserRole,
  UserStatus,
} from "../src/generated/prisma/enums.js";
import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/utils/password.js";
import { cleanTestDatabase } from "./database.js";

const testPassword =
  "TestPassword123!";

type CreateUserOptions = {
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
};

async function createUser(
  options: CreateUserOptions,
) {
  const passwordHash =
    await hashPassword(
      testPassword,
    );

  return prisma.user.create({
    data: {
      name: options.name,
      email: options.email,
      passwordHash,
      role: options.role,
      status:
        options.status ??
        UserStatus.ACTIVE,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
}

async function createLoggedInAgent(
  options: CreateUserOptions,
) {
  const user =
    await createUser(options);

  const agent = request.agent(app);

  await agent
    .post("/api/v1/auth/login")
    .send({
      email: options.email,
      password: testPassword,
    })
    .expect(200);

  return {
    agent,
    user,
  };
}

async function createAdminAgent() {
  return createLoggedInAgent({
    name: "Instructor Admin",
    email:
      "instructor-admin@test.com",
    role: UserRole.ADMIN,
  });
}

async function createTestCourse(
  adminAgent: ReturnType<
    typeof request.agent
  >,
) {
  const categoryResponse =
    await adminAgent
      .post("/api/v1/categories")
      .send({
        name: "Programming",
        description:
          "Programming related courses.",
      })
      .expect(201);

  const categoryId =
    categoryResponse.body.data
      .category.id as string;

  const courseResponse =
    await adminAgent
      .post("/api/v1/courses")
      .send({
        categoryId,
        title:
          "TypeScript Fundamentals",
        shortDescription:
          "Learn TypeScript fundamentals with practical examples.",
        description:
          "Learn TypeScript fundamentals, type safety and application development with practical examples.",
        price: 4000,
        discountPrice: 3000,
        level: "BEGINNER",
        isFeatured: true,
      })
      .expect(201);

  return courseResponse.body.data
    .course as {
    id: string;
    slug: string;
  };
}

describe(
  "Course Instructor API",
  () => {
    beforeEach(async () => {
      await cleanTestDatabase();
    });

    afterAll(async () => {
      await cleanTestDatabase();
      await prisma.$disconnect();
    });

    it(
      "allows admin to assign an active instructor",
      async () => {
        const { agent: adminAgent } =
          await createAdminAgent();

        const instructor =
          await createUser({
            name: "Active Instructor",
            email:
              "active-instructor@test.com",
            role:
              UserRole.INSTRUCTOR,
          });

        const course =
          await createTestCourse(
            adminAgent,
          );

        const response =
          await adminAgent
            .patch(
              `/api/v1/courses/${course.id}/instructor`,
            )
            .send({
              instructorId:
                instructor.id,
            });

        expect(
          response.status,
        ).toBe(200);

        expect(
          response.body.success,
        ).toBe(true);

        expect(
          response.body.data.course
            .instructor.id,
        ).toBe(instructor.id);

        expect(
          response.body.data.course
            .instructor.name,
        ).toBe(
          "Active Instructor",
        );

        expect(
          response.body.data.course
            .instructor.email,
        ).toBeUndefined();
      },
    );

    it(
      "rejects a student as course instructor",
      async () => {
        const { agent: adminAgent } =
          await createAdminAgent();

        const student =
          await createUser({
            name: "Normal Student",
            email:
              "normal-student@test.com",
            role: UserRole.STUDENT,
          });

        const course =
          await createTestCourse(
            adminAgent,
          );

        const response =
          await adminAgent
            .patch(
              `/api/v1/courses/${course.id}/instructor`,
            )
            .send({
              instructorId:
                student.id,
            });

        expect(
          response.status,
        ).toBe(400);

        expect(
          response.body.code,
        ).toBe(
          "USER_NOT_INSTRUCTOR",
        );
      },
    );

    it(
      "rejects a suspended instructor",
      async () => {
        const { agent: adminAgent } =
          await createAdminAgent();

        const instructor =
          await createUser({
            name:
              "Suspended Instructor",
            email:
              "suspended-instructor@test.com",
            role:
              UserRole.INSTRUCTOR,
            status:
              UserStatus.SUSPENDED,
          });

        const course =
          await createTestCourse(
            adminAgent,
          );

        const response =
          await adminAgent
            .patch(
              `/api/v1/courses/${course.id}/instructor`,
            )
            .send({
              instructorId:
                instructor.id,
            });

        expect(
          response.status,
        ).toBe(400);

        expect(
          response.body.code,
        ).toBe(
          "INSTRUCTOR_NOT_ACTIVE",
        );
      },
    );

    it(
      "allows admin to reassign instructor",
      async () => {
        const { agent: adminAgent } =
          await createAdminAgent();

        const firstInstructor =
          await createUser({
            name: "First Instructor",
            email:
              "first-instructor@test.com",
            role:
              UserRole.INSTRUCTOR,
          });

        const secondInstructor =
          await createUser({
            name: "Second Instructor",
            email:
              "second-instructor@test.com",
            role:
              UserRole.INSTRUCTOR,
          });

        const course =
          await createTestCourse(
            adminAgent,
          );

        await adminAgent
          .patch(
            `/api/v1/courses/${course.id}/instructor`,
          )
          .send({
            instructorId:
              firstInstructor.id,
          })
          .expect(200);

        const response =
          await adminAgent
            .patch(
              `/api/v1/courses/${course.id}/instructor`,
            )
            .send({
              instructorId:
                secondInstructor.id,
            });

        expect(
          response.status,
        ).toBe(200);

        expect(
          response.body.data.course
            .instructor.id,
        ).toBe(
          secondInstructor.id,
        );
      },
    );

    it(
      "allows admin to remove instructor",
      async () => {
        const { agent: adminAgent } =
          await createAdminAgent();

        const instructor =
          await createUser({
            name:
              "Removable Instructor",
            email:
              "removable-instructor@test.com",
            role:
              UserRole.INSTRUCTOR,
          });

        const course =
          await createTestCourse(
            adminAgent,
          );

        await adminAgent
          .patch(
            `/api/v1/courses/${course.id}/instructor`,
          )
          .send({
            instructorId:
              instructor.id,
          })
          .expect(200);

        const response =
          await adminAgent.delete(
            `/api/v1/courses/${course.id}/instructor`,
          );

        expect(
          response.status,
        ).toBe(200);

        expect(
          response.body.data.course
            .instructor,
        ).toBeNull();
      },
    );

    it(
      "prevents instructor from assigning course instructor",
      async () => {
        const { agent: adminAgent } =
          await createAdminAgent();

        const {
          agent: instructorAgent,
          user: instructor,
        } =
          await createLoggedInAgent({
            name: "Course Instructor",
            email:
              "course-instructor@test.com",
            role:
              UserRole.INSTRUCTOR,
          });

        const course =
          await createTestCourse(
            adminAgent,
          );

        const response =
          await instructorAgent
            .patch(
              `/api/v1/courses/${course.id}/instructor`,
            )
            .send({
              instructorId:
                instructor.id,
            });

        expect(
          response.status,
        ).toBe(403);

        expect(
          response.body.code,
        ).toBe("FORBIDDEN");
      },
    );

    it(
      "returns safe instructor data in public course",
      async () => {
        const { agent: adminAgent } =
          await createAdminAgent();

        const instructor =
          await createUser({
            name: "Public Instructor",
            email:
              "public-instructor@test.com",
            role:
              UserRole.INSTRUCTOR,
          });

        const course =
          await createTestCourse(
            adminAgent,
          );

        await adminAgent
          .patch(
            `/api/v1/courses/${course.id}/instructor`,
          )
          .send({
            instructorId:
              instructor.id,
          })
          .expect(200);

        await adminAgent
          .post(
            `/api/v1/courses/${course.id}/publish`,
          )
          .expect(200);

        const response =
          await request(app).get(
            `/api/v1/courses/slug/${course.slug}`,
          );

        expect(
          response.status,
        ).toBe(200);

        expect(
          response.body.data.course
            .instructor.id,
        ).toBe(instructor.id);

        expect(
          response.body.data.course
            .instructor.name,
        ).toBe(
          "Public Instructor",
        );

        expect(
          response.body.data.course
            .instructor.email,
        ).toBeUndefined();

        expect(
          response.body.data.course
            .instructor.status,
        ).toBeUndefined();
      },
    );

    it(
      "filters admin courses by instructor ID",
      async () => {
        const { agent: adminAgent } =
          await createAdminAgent();

        const instructor =
          await createUser({
            name: "Filter Instructor",
            email:
              "filter-instructor@test.com",
            role:
              UserRole.INSTRUCTOR,
          });

        const course =
          await createTestCourse(
            adminAgent,
          );

        await adminAgent
          .patch(
            `/api/v1/courses/${course.id}/instructor`,
          )
          .send({
            instructorId:
              instructor.id,
          })
          .expect(200);

        const response =
          await adminAgent.get(
            `/api/v1/courses/admin?instructorId=${instructor.id}`,
          );

        expect(
          response.status,
        ).toBe(200);

        expect(
          response.body.data.courses,
        ).toHaveLength(1);

        expect(
          response.body.data.courses[0]
            .id,
        ).toBe(course.id);
      },
    );
  },
);