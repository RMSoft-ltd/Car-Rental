import { z } from "zod";

/**
 * Zod validation schema for car listing forms
 * Provides type-safe validation for creating and updating car listings
 */

// ============================================
// Car Listing Schema
// ============================================

export const carListingSchema = z.object({
  // Listing Information
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters"),

  make: z
    .string()
    .min(2, "Make is required")
    .max(50, "Make must not exceed 50 characters"),

  model: z
    .string()
    .min(1, "Model is required")
    .max(50, "Model must not exceed 50 characters"),

  plateNumber: z
    .string()
    .min(3, "Plate number is required")
    .max(20, "Plate number must not exceed 20 characters")
    .regex(
      /^[A-Z0-9-]+$/i,
      "Plate number can only contain letters, numbers, and hyphens"
    ),

  body: z
    .string()
    .min(2, "Body type is required")
    .max(50, "Body type must not exceed 50 characters"),

  seats: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseInt(val) : val))
    .refine((val) => val >= 1, "Seats must be atleast 1"),

  mileage: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .optional(),

  fuelType: z.string().optional(),

  year: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseInt(val) : val))
    .refine((val) => val >= 1900 && val <= new Date().getFullYear() + 1, {
      message: "Please enter a valid year",
    }),

  transition: z.string().optional(),

  driverType: z.string().optional(),

  engineSize: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .optional(),

  doors: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseInt(val) : val))
    .refine((val) => val >= 1, "Doors must be at least 1"),

  smallBags: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseInt(val) : val))
    .optional(),

  color: z.string().optional(),

  largeBags: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseInt(val) : val))
    .optional(),

  pickUpLocation: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),

  description: z.string().optional(),

  // Features - Comfort
  isPowerSteering: z.boolean().default(false),
  isCruiseControl: z.boolean().default(false),
  isNavigation: z.boolean().default(false),
  isPowerLocks: z.boolean().default(false),
  isVanityMirror: z.boolean().default(false),
  isTrunkLight: z.boolean().default(false),

  // Features - Interior
  isAirConditioner: z.boolean().default(false),
  isLeatherSeats: z.boolean().default(false),
  isMemorySeats: z.boolean().default(false),
  isHeatedSeatEquipped: z.boolean().default(false),
  isRadioEquipped: z.boolean().default(false),
  isRadioBluetoothEnabled: z.boolean().default(false),
  isKeyLess: z.boolean().default(false),

  // Features - Exterior
  isFogLightsFront: z.boolean().default(false),
  isRainSensingWipe: z.boolean().default(false),
  isRearSpoiler: z.boolean().default(false),
  isSunRoof: z.boolean().default(false),
  isRearWindow: z.boolean().default(false),

  // Features - Safety & Equipment
  isBreakeAssist: z.boolean().default(false),
  isChildSafetyLocks: z.boolean().default(false),
  isTractionControl: z.boolean().default(false),
  isPowerDoorLocks: z.boolean().default(false),
  isDriverAirBag: z.boolean().default(false),
  isAntiLockBreaks: z.boolean().default(false),
  isAirbagEquipped: z.boolean().default(false),
  isBackCameraEquipped: z.boolean().default(false),
  isSpareTireIncluded: z.boolean().default(false),
  isJackIncluded: z.boolean().default(false),
  isWheelSpannerIncluded: z.boolean().default(false),

  // Features - Drive Type
  isRightHandDrive: z.boolean().default(false),
  isLeftHandDrive: z.boolean().default(false),

  // Pricing
  pricePerDay: z
    .string()
    .or(z.number())
    .transform((val) => {
      if (typeof val === "string") {
        // Remove commas and parse
        return parseFloat(val.replace(/,/g, ""));
      }
      return val;
    })
    .refine((val) => val > 0, "Price must be greater than 0"),

  currency: z.enum(["RWF", "USD", "EUR", "NGN"], {
    message: "Please select a valid currency",
  }),

  // Important Information
  requiredDocs: z
    .string()
    .min(10, "Required documents must be specified")
    .max(500, "Required documents must not exceed 500 characters")
    .optional(),

  securityDeposit: z.string().optional(),

  securityDepositAmount: z
    .string()
    .or(z.number())
    .transform((val) => {
      if (typeof val === "string") {
        return parseFloat(val.replace(/,/g, ""));
      }
      return val;
    })
    .refine((val) => val >= 0, "Security deposit must be a positive number"),

  fuelPolicy: z
    .string()
    .min(5, "Fuel policy is required")
    .max(500, "Fuel policy must not exceed 500 characters"),

  availabilityType: z.enum(["FULL", "WEEKDAYS", "WEEKENDS", "CUSTOM"], {
    message: "Please select availability type",
  }),
  customDays: z.array(z.string()).optional(),

  // Images
  carImages: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(1, "At least one car image is required")
    .max(10, "Maximum 10 images allowed"),
});

// ============================================
// TypeScript Type
// ============================================

export type CarListingFormData = z.infer<typeof carListingSchema>;

// ============================================
// Default Values
// ============================================

export const defaultCarListingData: Partial<CarListingFormData> = {
  // Listing Information
  title: "",
  make: "",
  model: "",
  plateNumber: "",
  body: "",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  seats: "" as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  year: "" as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mileage: "" as any,
  fuelType: "",
  transition: "",
  driverType: "",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  engineSize: "" as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doors: "" as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  smallBags: "" as any,
  color: "",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  largeBags: "" as any,
  pickUpLocation: "",
  latitude: undefined,
  longitude: undefined,
  description: "",

  // Features
  isPowerSteering: false,
  isCruiseControl: false,
  isNavigation: false,
  isPowerLocks: false,
  isVanityMirror: false,
  isTrunkLight: false,
  isAirConditioner: false,
  isLeatherSeats: false,
  isMemorySeats: false,
  isHeatedSeatEquipped: false,
  isRadioEquipped: false,
  isRadioBluetoothEnabled: false,
  isKeyLess: false,
  isFogLightsFront: false,
  isRainSensingWipe: false,
  isRearSpoiler: false,
  isSunRoof: false,
  isRearWindow: false,
  isBreakeAssist: false,
  isChildSafetyLocks: false,
  isTractionControl: false,
  isPowerDoorLocks: false,
  isDriverAirBag: false,
  isAntiLockBreaks: false,
  isAirbagEquipped: false,
  isBackCameraEquipped: false,
  isSpareTireIncluded: false,
  isJackIncluded: false,
  isWheelSpannerIncluded: false,
  isRightHandDrive: false,
  isLeftHandDrive: false,

  // Pricing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pricePerDay: "" as any,
  currency: undefined,

  // Important Information
  requiredDocs: "",
  securityDeposit: "",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  securityDepositAmount: "" as any,
  fuelPolicy: "",
  availabilityType: undefined,
  customDays: [],

  // Images
  carImages: [],
};
