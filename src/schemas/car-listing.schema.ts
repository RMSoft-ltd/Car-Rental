import { z } from "zod";

/**
 * Zod validation schemas for car listing forms
 * These schemas provide type-safe validation for creating and updating car listings
 */

// ============================================
// Step 1: Listing Information Schema
// ============================================

export const listingInformationSchema = z.object({
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
    .max(50, "Body type must not exceed 50 characters")
    .optional(),

  seats: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseInt(val) : val))
    .refine((val) => val >= 1 && val <= 12, "Seats must be between 1 and 12"),

  mileage: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => val >= 0, "Mileage must be a positive number")
    .optional(),

  fuelType: z.string().min(2, "Fuel type is required").optional(),

  year: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseInt(val) : val))
    .refine((val) => val >= 1900 && val <= new Date().getFullYear() + 1, {
      message: "Please enter a valid year",
    }),

  transition: z.string().min(2, "Transmission type is required").optional(),

  driverType: z
    .string()
    .min(2, "Driver type is required")
    .max(50, "Driver type must not exceed 50 characters")
    .optional(),

  engineSize: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine(
      (val) => val > 0 && val <= 10,
      "Engine size must be between 0 and 10 liters"
    )
    .optional(),

  doors: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseInt(val) : val))
    .refine((val) => val >= 2 && val <= 6, "Doors must be between 2 and 6")
    .optional(),

  smallBags: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseInt(val) : val))
    .refine(
      (val) => val >= 0 && val <= 10,
      "Small bags must be between 0 and 10"
    )
    .optional(),

  color: z
    .string()
    .min(2, "Color is required")
    .max(30, "Color must not exceed 30 characters")
    .optional(),

  largeBags: z
    .string()
    .or(z.number())
    .transform((val) => (typeof val === "string" ? parseInt(val) : val))
    .refine(
      (val) => val >= 0 && val <= 10,
      "Large bags must be between 0 and 10"
    )
    .optional(),

  inTerminal: z
    .string()
    .min(2, "Terminal location is required")
    .max(200, "Terminal location must not exceed 200 characters")
    .optional(),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),
});

// ============================================
// Step 2: Features Schema
// ============================================

export const featuresSchema = z.object({
  // Comfort
  isPowerSteering: z.boolean().default(false),
  isCruiseControl: z.boolean().default(false),
  isNavigation: z.boolean().default(false),
  isPowerLocks: z.boolean().default(false),
  isVanityMirror: z.boolean().default(false),
  isTrunkLight: z.boolean().default(false),

  // Interior
  isAirConditioner: z.boolean().default(false),
  Techometer: z.boolean().default(false),
  isDigitalOdometer: z.boolean().default(false),
  isLeatherSeats: z.boolean().default(false),
  isHeater: z.boolean().default(false),
  isMemorySeats: z.boolean().default(false),

  // Exterior
  isFogLightsFront: z.boolean().default(false),
  isRainSensingWipe: z.boolean().default(false),
  isRearSpoiler: z.boolean().default(false),
  isSunRoof: z.boolean().default(false),
  isRearWindow: z.boolean().default(false),
  isWindowDefroster: z.boolean().default(false),

  // Safety
  isBreakeAssist: z.boolean().default(false),
  isChildSafetyLocks: z.boolean().default(false),
  isTractionControl: z.boolean().default(false),
  isPowerDoorLocks: z.boolean().default(false),
  isDriverAirBag: z.boolean().default(false),
  isAntiLockBreaks: z.boolean().default(false),
});

// ============================================
// Step 3: Price Schema
// ============================================

export const priceSchema = z.object({
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
});

// ============================================
// Step 4: Info Schema
// ============================================

export const infoSchema = z.object({
  requiredDocs: z
    .string()
    .min(10, "Required documents must be specified")
    .max(500, "Required documents must not exceed 500 characters")
    .optional(),

  securityDeposit: z
    .string()
    .min(2, "Security deposit information is required")
    .max(500, "Security deposit must not exceed 500 characters")
    .optional(),

  securityDepositAmount: z
    .string()
    .or(z.number())
    .transform((val) => {
      if (typeof val === "string") {
        return parseFloat(val.replace(/,/g, ""));
      }
      return val;
    })
    .refine((val) => val >= 0, "Security deposit must be a positive number")
    .optional(),

  damageExcess: z
    .string()
    .min(5, "Damage excess information is required")
    .max(500, "Damage excess must not exceed 500 characters")
    .optional(),

  fuelPolicy: z
    .string()
    .min(5, "Fuel policy is required")
    .max(500, "Fuel policy must not exceed 500 characters")
    .optional(),

  insuranceExpirationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine(
      (val) => new Date(val) > new Date(),
      "Insurance must not be expired"
    )
    .optional(),

  insuranceFile: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .nullable(),

  availabilityType: z
    .enum(["FULL", "WEEKDAYS", "WEEKENDS", "CUSTOM"], {
      message: "Please select availability type",
    })
    .optional(),

  customDays: z.array(z.string()).optional(),

  startDate: z.string().optional(),
  endDate: z.string().optional(),

  pickUpLocation: z.string().optional(),
});

// ============================================
// Step 5: Images Schema
// ============================================

export const imagesSchema = z.object({
  carImages: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(1, "At least one car image is required")
    .max(10, "Maximum 10 images allowed"),
});

// ============================================
// Complete Car Listing Schema (All Steps Combined)
// ============================================

export const carListingSchema = listingInformationSchema
  .merge(featuresSchema)
  .merge(priceSchema)
  .merge(infoSchema)
  .merge(imagesSchema);

// ============================================
// TypeScript Types (Inferred from Schemas)
// ============================================

export type ListingInformationFormData = z.infer<
  typeof listingInformationSchema
>;
export type FeaturesFormData = z.infer<typeof featuresSchema>;
export type PriceFormData = z.infer<typeof priceSchema>;
export type InfoFormData = z.infer<typeof infoSchema>;
export type ImagesFormData = z.infer<typeof imagesSchema>;
export type CarListingFormData = z.infer<typeof carListingSchema>;

// ============================================
// Default Values for Forms
// ============================================

export const defaultListingInformation: Partial<ListingInformationFormData> = {
  title: "",
  make: "",
  model: "",
  plateNumber: "",
  body: "",
  seats: "" as any,
  year: "" as any,
  mileage: "" as any,
  fuelType: "",
  transition: "",
  driverType: "",
  engineSize: "" as any,
  doors: "" as any,
  smallBags: "" as any,
  color: "",
  largeBags: "" as any,
  inTerminal: "",
  description: "",
};

export const defaultFeatures: FeaturesFormData = {
  isPowerSteering: false,
  isCruiseControl: false,
  isNavigation: false,
  isPowerLocks: false,
  isVanityMirror: false,
  isTrunkLight: false,
  isAirConditioner: false,
  Techometer: false,
  isDigitalOdometer: false,
  isLeatherSeats: false,
  isHeater: false,
  isMemorySeats: false,
  isFogLightsFront: false,
  isRainSensingWipe: false,
  isRearSpoiler: false,
  isSunRoof: false,
  isRearWindow: false,
  isWindowDefroster: false,
  isBreakeAssist: false,
  isChildSafetyLocks: false,
  isTractionControl: false,
  isPowerDoorLocks: false,
  isDriverAirBag: false,
  isAntiLockBreaks: false,
};

export const defaultPrice: Partial<PriceFormData> = {
  pricePerDay: "" as any,
  currency: undefined,
};

export const defaultInfo: Partial<InfoFormData> = {
  requiredDocs: "",
  securityDeposit: "",
  securityDepositAmount: "" as any,
  damageExcess: "",
  fuelPolicy: "",
  availabilityType: undefined,
  insuranceExpirationDate: "",
  insuranceFile: null,
  customDays: [],
  pickUpLocation: "",
};

export const defaultImages: ImagesFormData = {
  carImages: [],
};

export const defaultCarListingData: Partial<CarListingFormData> = {
  ...defaultListingInformation,
  ...defaultFeatures,
  ...defaultPrice,
  ...defaultInfo,
  ...defaultImages,
};
