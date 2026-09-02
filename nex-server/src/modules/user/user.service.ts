import type { Prisma } from "../../generated/prisma/client.js";
import { UserRole } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import type {
  AdminUpdateUserInput,
  UpdateOwnProfileInput,
  UserListQuery,
} from "./user.validation.js";

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  avatarUrl: true,
  emailVerifiedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type UserManagementErrorCode =
  | "USER_NOT_FOUND"
  | "FORBIDDEN"
  | "CANNOT_UPDATE_SELF"
  | "CANNOT_MANAGE_PRIVILEGED_USER"
  | "CANNOT_ASSIGN_PRIVILEGED_ROLE";

export class UserManagementError extends Error {
  constructor(
    public readonly code: UserManagementErrorCode,
  ) {
    super(code);
    this.name = "UserManagementError";
  }
}

interface ActingUser {
  id: string;
  role: string;
}

export async function listUsers(
  query: UserListQuery,
) {
  const skip = (query.page - 1) * query.limit;

  const where: Prisma.UserWhereInput = {
    ...(query.search
      ? {
          OR: [
            {
              name: {
                contains: query.search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: query.search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),

    ...(query.role
      ? {
          role: query.role,
        }
      : {}),

    ...(query.status
      ? {
          status: query.status,
        }
      : {}),
  };

  const [total, users] = await prisma.$transaction([
    prisma.user.count({
      where,
    }),

    prisma.user.findMany({
      where,
      select: safeUserSelect,
      skip,
      take: query.limit,
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "asc",
        },
      ],
    }),
  ]);

  const totalPages = Math.ceil(total / query.limit);

  return {
    users,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    },
  };
}

export async function findUserById(
  userId: string,
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: safeUserSelect,
  });

  return user;
}

export async function updateOwnProfile(
  userId: string,
  input: UpdateOwnProfileInput,
) {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(input.name !== undefined
        ? {
            name: input.name,
          }
        : {}),

      ...(input.avatarUrl !== undefined
        ? {
            avatarUrl: input.avatarUrl,
          }
        : {}),
    },
    select: safeUserSelect,
  });

  return updatedUser;
}

export async function updateUserAsAdmin(
  actingUser: ActingUser,
  targetUserId: string,
  input: AdminUpdateUserInput,
) {
  const isAdmin =
    actingUser.role === UserRole.ADMIN;

  const isSuperAdmin =
    actingUser.role === UserRole.SUPER_ADMIN;

  if (!isAdmin && !isSuperAdmin) {
    throw new UserManagementError("FORBIDDEN");
  }

  if (actingUser.id === targetUserId) {
    throw new UserManagementError(
      "CANNOT_UPDATE_SELF",
    );
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: targetUserId,
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!targetUser) {
    throw new UserManagementError(
      "USER_NOT_FOUND",
    );
  }

  if (isAdmin) {
    const targetIsPrivileged =
      targetUser.role === UserRole.ADMIN ||
      targetUser.role === UserRole.SUPER_ADMIN;

    if (targetIsPrivileged) {
      throw new UserManagementError(
        "CANNOT_MANAGE_PRIVILEGED_USER",
      );
    }

    const assigningPrivilegedRole =
      input.role === UserRole.ADMIN ||
      input.role === UserRole.SUPER_ADMIN;

    if (assigningPrivilegedRole) {
      throw new UserManagementError(
        "CANNOT_ASSIGN_PRIVILEGED_ROLE",
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: targetUserId,
    },
    data: {
      ...(input.role !== undefined
        ? {
            role: input.role,
          }
        : {}),

      ...(input.status !== undefined
        ? {
            status: input.status,
          }
        : {}),
    },
    select: safeUserSelect,
  });

  return updatedUser;
}