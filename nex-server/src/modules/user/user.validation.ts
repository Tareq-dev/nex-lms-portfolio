import { z } from "zod";
import {
  UserRole,
  UserStatus,
} from "../../generated/prisma/enums.js";

export const userIdParamSchema = z.object({
  userId: z
    .string()
    .uuid("Please provide a valid user ID."),
});

export const userListQuerySchema = z.object({
  page: z.coerce
    .number()
    .int("Page must be an integer.")
    .min(1, "Page must be at least 1.")
    .default(1),

  limit: z.coerce
    .number()
    .int("Limit must be an integer.")
    .min(1, "Limit must be at least 1.")
    .max(100, "Limit cannot exceed 100.")
    .default(10),

  search: z
    .string()
    .trim()
    .min(1, "Search cannot be empty.")
    .max(100, "Search cannot exceed 100 characters.")
    .optional(),

  role: z.nativeEnum(UserRole).optional(),

  status: z.nativeEnum(UserStatus).optional(),
});

export const updateOwnProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters.")
      .max(100, "Name cannot exceed 100 characters.")
      .optional(),

    avatarUrl: z
      .string()
      .trim()
      .url("Please provide a valid avatar URL.")
      .nullable()
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.avatarUrl !== undefined,
    {
      message:
        "Provide at least one field to update.",
    },
  );

export const adminUpdateUserSchema = z
  .object({
    role: z.nativeEnum(UserRole).optional(),
    status: z.nativeEnum(UserStatus).optional(),
  })
  .refine(
    (data) =>
      data.role !== undefined ||
      data.status !== undefined,
    {
      message:
        "Provide at least one role or status field.",
    },
  );

export type UserListQuery = z.infer<
  typeof userListQuerySchema
>;

export type UpdateOwnProfileInput = z.infer<
  typeof updateOwnProfileSchema
>;

export type AdminUpdateUserInput = z.infer<
  typeof adminUpdateUserSchema
>;