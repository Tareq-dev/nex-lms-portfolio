import { Router } from "express";
import authRouter from "../modules/auth/auth.route.js";
import categoryRouter from "../modules/category/category.route.js";
import courseRouter from "../modules/course/course.route.js";
import userRouter from "../modules/user/user.route.js";

import {
  chapterRouter,
  courseCurriculumRouter,
  moduleRouter,
} from "../modules/curriculum/curriculum.route.js";

import {
  adminEnrollmentRouter,
  chapterAccessRouter,
  courseEnrollmentRouter,
  enrollmentRouter,
} from "../modules/enrollment/enrollment.route.js";

import {
  adminPurchaseRouter,
  purchaseRouter,
} from "../modules/purchase/purchase.route.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/categories", categoryRouter);

apiRouter.use("/courses", courseCurriculumRouter);
apiRouter.use("/courses", courseRouter);
apiRouter.use("/modules", moduleRouter);
apiRouter.use("/chapters", chapterRouter);

apiRouter.use("/courses", courseEnrollmentRouter);
apiRouter.use("/enrollments", enrollmentRouter);
apiRouter.use("/admin/enrollments", adminEnrollmentRouter);
apiRouter.use("/chapters", chapterAccessRouter);

apiRouter.use("/purchases", purchaseRouter);
apiRouter.use("/admin/purchases", adminPurchaseRouter);

export default apiRouter;
