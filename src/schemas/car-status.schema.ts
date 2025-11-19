import { z } from "zod";

/**
 * Zod validation schema for car status update
 */
export const carStatusUpdateSchema = z.object({
  status: z.enum(["pending", "changeRequested", "approved", "rejected"], {
    message: "Please select a status",
  }),
  changeStatusDescription: z.string().optional(),
});

export type CarStatusUpdateFormData = z.infer<typeof carStatusUpdateSchema>;

export const defaultCarStatusData: CarStatusUpdateFormData = {
  status: "pending",
  changeStatusDescription: "",
};
