import { Router } from "express";
import { UserRole } from "../../generated/prisma/enums.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/authorize.middleware.js";
import {
  getUserById,
  getUsers,
  updateMyProfile,
  updateUserByAdmin,
} from "./user.controller.js";

const userRouter = Router();

// এর নিচের সব route authenticated
userRouter.use(authenticate);

// যেকোনো authenticated user নিজের profile update করবে
userRouter.patch("/me", updateMyProfile);

// এর নিচের সব route শুধু Admin/Super Admin
userRouter.use(
  authorizeRoles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ),
);

userRouter.get("/", getUsers);

userRouter.get("/:userId", getUserById);

userRouter.patch("/:userId", updateUserByAdmin);

export default userRouter;