import { z } from "zod";

const purchaseStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
]);

const pageSchema = z.coerce.number().int().min(1).default(1);

const limitSchema = z.coerce.number().int().min(1).max(100).default(10);

export const createCheckoutSchema = z
  .object({
    courseId: z.string().uuid("Course ID must be a valid UUID."),
  })
  .strict();

export const purchaseParamsSchema = z
  .object({
    purchaseId: z.string().uuid("Purchase ID must be a valid UUID."),
  })
  .strict();

export const mockPaymentSchema = z
  .object({
    result: z.enum(["SUCCESS", "FAILED", "CANCELLED"]),
  })
  .strict();

export const myPurchaseListQuerySchema = z
  .object({
    page: pageSchema,
    limit: limitSchema,
    status: purchaseStatusSchema.optional(),
  })
  .strict();

export const adminPurchaseListQuerySchema = z
  .object({
    page: pageSchema,
    limit: limitSchema,

    search: z.string().trim().min(1).max(100).optional(),

    status: purchaseStatusSchema.optional(),

    studentId: z.string().uuid("Student ID must be a valid UUID.").optional(),

    courseId: z.string().uuid("Course ID must be a valid UUID.").optional(),
  })
  .strict();

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;

export type PurchaseParams = z.infer<typeof purchaseParamsSchema>;

export type MockPaymentInput = z.infer<typeof mockPaymentSchema>;

export type MyPurchaseListQuery = z.infer<typeof myPurchaseListQuerySchema>;

export type AdminPurchaseListQuery = z.infer<
  typeof adminPurchaseListQuerySchema
>;
