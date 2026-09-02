import request from "supertest";
import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/utils/password.js";
import { cleanTestDatabase } from "./database.js";

const studentInput = {
  name: "Normal Student",
  email: "student@test.com",
  password: "StudentPassword123!",
};

const adminInput = {
  name: "Test Admin",
  email: "admin@test.com",
  password: "AdminPassword123!",
};

async function createStudent():
  Promise<string> {
  const response =
    await request(app)
      .post("/api/v1/auth/register")
      .send(studentInput);

  return response.body.data.user
    .id as string;
}

async function createAdmin():
  Promise<void> {
  const passwordHash =
    await hashPassword(
      adminInput.password,
    );

  await prisma.user.create({
    data: {
      name: adminInput.name,
      email: adminInput.email,
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
}

async function loginAsStudent() {
  const agent = request.agent(app);

  await agent
    .post("/api/v1/auth/login")
    .send({
      email: studentInput.email,
      password: studentInput.password,
    })
    .expect(200);

  return agent;
}

async function loginAsAdmin() {
  const agent = request.agent(app);

  await agent
    .post("/api/v1/auth/login")
    .send({
      email: adminInput.email,
      password: adminInput.password,
    })
    .expect(200);

  return agent;
}

describe("User API", () => {
  beforeEach(async () => {
    await cleanTestDatabase();
  });

  afterAll(async () => {
    await cleanTestDatabase();
    await prisma.$disconnect();
  });

  it(
    "allows student to update own profile",
    async () => {
      await createStudent();

      const studentAgent =
        await loginAsStudent();

      const response =
        await studentAgent
          .patch(
            "/api/v1/users/me",
          )
          .send({
            name: "Updated Student",
          });

      expect(response.status).toBe(200);

      expect(
        response.body.data.user.name,
      ).toBe("Updated Student");
    },
  );

  it(
    "prevents student from listing users",
    async () => {
      await createStudent();

      const studentAgent =
        await loginAsStudent();

      const response =
        await studentAgent.get(
          "/api/v1/users",
        );

      expect(response.status).toBe(403);
    },
  );

  it(
    "allows admin to list users",
    async () => {
      await createStudent();
      await createAdmin();

      const adminAgent =
        await loginAsAdmin();

      const response =
        await adminAgent.get(
          "/api/v1/users?page=1&limit=10&search=student",
        );

      expect(response.status).toBe(200);

      expect(
        response.body.success,
      ).toBe(true);

      expect(
        Array.isArray(
          response.body.data.users,
        ),
      ).toBe(true);
    },
  );

  it(
    "allows admin to get user by ID",
    async () => {
      const studentId =
        await createStudent();

      await createAdmin();

      const adminAgent =
        await loginAsAdmin();

      const response =
        await adminAgent.get(
          `/api/v1/users/${studentId}`,
        );

      expect(response.status).toBe(200);

      expect(
        response.body.data.user.id,
      ).toBe(studentId);
    },
  );

  it(
    "allows admin to suspend user",
    async () => {
      const studentId =
        await createStudent();

      await createAdmin();

      const adminAgent =
        await loginAsAdmin();

      const response =
        await adminAgent
          .patch(
            `/api/v1/users/${studentId}`,
          )
          .send({
            status: "SUSPENDED",
          });

      expect(response.status).toBe(200);

      expect(
        response.body.data.user
          .status,
      ).toBe("SUSPENDED");

      await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: studentInput.email,
          password:
            studentInput.password,
        })
        .expect(403);
    },
  );
});