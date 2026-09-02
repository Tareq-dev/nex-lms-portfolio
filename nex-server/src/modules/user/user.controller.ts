import type { Request, Response } from "express";
import {
  UserManagementError,
  findUserById,
  listUsers,
  updateOwnProfile,
  updateUserAsAdmin,
} from "./user.service.js";
import {
  adminUpdateUserSchema,
  updateOwnProfileSchema,
  userIdParamSchema,
  userListQuerySchema,
} from "./user.validation.js";

function handleUserManagementError(
  error: unknown,
  res: Response,
): boolean {
  if (!(error instanceof UserManagementError)) {
    return false;
  }

  const errorResponses: Record<
    string,
    {
      status: number;
      message: string;
    }
  > = {
    USER_NOT_FOUND: {
      status: 404,
      message: "User not found.",
    },

    FORBIDDEN: {
      status: 403,
      message:
        "You do not have permission to perform this action.",
    },

    CANNOT_UPDATE_SELF: {
      status: 403,
      message:
        "You cannot change your own role or status.",
    },

    CANNOT_MANAGE_PRIVILEGED_USER: {
      status: 403,
      message:
        "An admin cannot manage another admin or super admin.",
    },

    CANNOT_ASSIGN_PRIVILEGED_ROLE: {
      status: 403,
      message:
        "Only a super admin can assign admin or super admin roles.",
    },
  };

  const errorResponse = errorResponses[error.code];

  if (!errorResponse) {
    return false;
  }

  res.status(errorResponse.status).json({
    success: false,
    message: errorResponse.message,
  });

  return true;
}

export async function getUsers(
  req: Request,
  res: Response,
): Promise<void> {
  const validationResult =
    userListQuerySchema.safeParse(req.query);

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: "Query validation failed.",
      errors: validationResult.error.issues.map(
        (issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }),
      ),
    });

    return;
  }

  try {
    const result = await listUsers(
      validationResult.data,
    );

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully.",
      data: result,
    });
  } catch (error: unknown) {
    console.error("Failed to retrieve users:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getUserById(
  req: Request,
  res: Response,
): Promise<void> {
  const validationResult =
    userIdParamSchema.safeParse(req.params);

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: "Parameter validation failed.",
      errors: validationResult.error.issues.map(
        (issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }),
      ),
    });

    return;
  }

  try {
    const user = await findUserById(
      validationResult.data.userId,
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully.",
      data: {
        user,
      },
    });
  } catch (error: unknown) {
    console.error("Failed to retrieve user:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function updateMyProfile(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });

    return;
  }

  const validationResult =
    updateOwnProfileSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validationResult.error.issues.map(
        (issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }),
      ),
    });

    return;
  }

  try {
    const updatedUser = await updateOwnProfile(
      req.user.id,
      validationResult.data,
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        user: updatedUser,
      },
    });
  } catch (error: unknown) {
    console.error("Profile update failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function updateUserByAdmin(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });

    return;
  }

  const paramValidationResult =
    userIdParamSchema.safeParse(req.params);

  if (!paramValidationResult.success) {
    res.status(400).json({
      success: false,
      message: "Parameter validation failed.",
      errors:
        paramValidationResult.error.issues.map(
          (issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          }),
        ),
    });

    return;
  }

  const bodyValidationResult =
    adminUpdateUserSchema.safeParse(req.body);

  if (!bodyValidationResult.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors:
        bodyValidationResult.error.issues.map(
          (issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          }),
        ),
    });

    return;
  }

  try {
    const updatedUser = await updateUserAsAdmin(
      {
        id: req.user.id,
        role: req.user.role,
      },
      paramValidationResult.data.userId,
      bodyValidationResult.data,
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: {
        user: updatedUser,
      },
    });
  } catch (error: unknown) {
    if (handleUserManagementError(error, res)) {
      return;
    }

    console.error("Admin user update failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}