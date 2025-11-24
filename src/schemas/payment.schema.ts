import { z } from "zod";

// Zod schema for deposit payment form
export const depositPaymentSchema = z.object({
    mobilephone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must not exceed 15 digits")
        .regex(/^[0-9]+$/, "Phone number must contain only digits")
        .refine((val) => val.startsWith("250"), {
            message: "Phone number must start with 250 (Rwanda)",
        }),
    reason: z
        .string()
        .min(5, "Reason must be at least 5 characters")
        .max(200, "Reason must not exceed 200 characters"),
    amount: z
        .number()
        .positive("Amount must be positive")
        .min(1, "Amount must be at least 1 RWF"),
});