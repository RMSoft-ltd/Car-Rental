import { z } from "zod";

/**
 * Zod validation schema for car status update
 */
export const carStatusUpdateSchema = z.object({
  status: z.enum(["pending", "changeRequested", "approved", "rejected"], {
    message: "Please select a status",
  }),
  changeStatusDescription: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
});

export type CarStatusUpdateFormData = z.infer<typeof carStatusUpdateSchema>;

export const defaultCarStatusData: CarStatusUpdateFormData = {
  status: "pending",
  changeStatusDescription: "",
};
