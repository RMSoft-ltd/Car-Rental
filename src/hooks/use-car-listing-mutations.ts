/**
 * TanStack Query mutation hooks for car listing operations
 * Handles creating, updating, and deleting car listings with proper error handling
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CarListingFormData } from "@/schemas/car-listing.schema";
import {
  createCarListing,
  updateCarListing,
  deleteCarListing,
  deleteCarImage,
  updateCarStatus,
  userChangeCarListingStatus,
} from "@/services/car-listing.service";
import { getErrorMessage } from "@/utils/error-utils";

// ============================================
// Helper: Convert form data to FormData
// ============================================

function convertToFormData(data: CarListingFormData): FormData {
  const formData = new FormData();

  // Fields to exclude from submission (not expected by backend)
  const excludedFields = [
    "existingImages",
    "id",
    "createdAt",
    "updatedAt",
    "userId",
    "user",
    "bookings",
  ];

  // Add all fields to FormData
  Object.entries(data).forEach(([key, value]) => {
    // Skip excluded fields
    if (excludedFields.includes(key)) {
      return;
    }

    if (key === "carImages" && Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          formData.append("carImages", item);
        }
      });

      const existingUrls = value.filter((item) => typeof item === "string");
      if (existingUrls.length > 0) {
        existingUrls.forEach((url) => {
          formData.append("carImages", url);
        });
      }
    } else if (key === "insuranceFile") {
      if (value instanceof File) {
        // New file uploaded
        formData.append("insuranceFile", value);
      } else if (typeof value === "string" && value) {
        // Existing file URL - send it as is
        formData.append("insuranceFile", value);
      }
      // If value is null/undefined, don't send anything
    } else if (key === "customDays" && Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (Array.isArray(value)) {
      // Handle other arrays
      formData.append(key, JSON.stringify(value));
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  return formData;
}

// ============================================
// Create Car Listing Mutation
// ============================================

interface CreateCarListingParams {
  userId: number;
  data: CarListingFormData;
}

export function useCreateCarListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: CreateCarListingParams) => {
      const formData = convertToFormData(data);
      return createCarListing(userId, formData);
    },
    onSuccess: () => {
      // Invalidate and refetch car listings
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["userCars"] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to create car listing");
      console.error("Failed to create car listing:", message, error);
    },
  });
}

// ============================================
// Update Car Listing Mutation
// ============================================

interface UpdateCarListingParams {
  id: number;
  data: Partial<CarListingFormData>;
}

export function useUpdateCarListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateCarListingParams) => {
      const formData = convertToFormData(data as CarListingFormData);
      return updateCarListing(id, formData);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch car listings
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["userCars"] });
      queryClient.invalidateQueries({ queryKey: ["car", variables.id] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to update car listing");
      console.error("Failed to update car listing:", message, error);
    },
  });
}

// ============================================
// Delete Car Listing Mutation
// ============================================

export function useDeleteCarListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCarListing(id),
    onSuccess: () => {
      // Invalidate and refetch car listings
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["userCars"] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to delete car listing");
      console.error("Failed to delete car listing:", message, error);
    },
  });
}

export function useDeleteCarImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, carImageUrl }: { id: number; carImageUrl: string }) =>
      deleteCarImage(id, { carImageUrl }),
    onSuccess: () => {
      // Invalidate and refetch car listings
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["userCars"] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to delete car image");
      console.error("Failed to delete car image:", message, error);
    },
  });
}

type UpdateCarStatusParams = {
  id: number;
  status: "pending" | "changeRequested" | "approved" | "rejected";
  changeStatusDescription?: string;
  userId?: number;
  isAdmin?: boolean;
  isOwner?: boolean;
};

export function useUpdateCarStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      changeStatusDescription = "",
      userId,
      isAdmin,
      isOwner,
    }: UpdateCarStatusParams) => {
      const userRequestsChange =
        status === "changeRequested" && !isAdmin && isOwner;

      if (userRequestsChange) {
        if (!userId) {
          throw new Error("User ID is required to request a status change.");
        }
        return userChangeCarListingStatus({ carId: id, userId });
      }

      // Admin or system-driven status updates
      return updateCarStatus(id, { status, changeStatusDescription });
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch car listings
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["userCars"] });
      queryClient.invalidateQueries({ queryKey: ["car", variables.id] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to update car status");
      console.error("Failed to update car status:", message, error);
    },
  });
}
