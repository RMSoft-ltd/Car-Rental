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
} from "@/services/car-listing-service";

// ============================================
// Helper: Convert form data to FormData
// ============================================

function convertToFormData(data: CarListingFormData): FormData {
  const formData = new FormData();

  // Fields to exclude from submission (not expected by backend)
  const excludedFields = ["pickUpLocation"];

  // Add all fields to FormData
  Object.entries(data).forEach(([key, value]) => {
    // Skip excluded fields
    if (excludedFields.includes(key)) {
      return;
    }

    if (key === "carImages" && Array.isArray(value)) {
      // Handle array of File objects and string URLs
      value.forEach((item) => {
        if (item instanceof File) {
          // Append new files
          formData.append("carImages", item);
        } else if (typeof item === "string") {
          // Append existing image URLs
          formData.append("existingImages", item);
        }
      });
    } else if (key === "insuranceFile" && value instanceof File) {
      // Handle File object for insurance file
      formData.append("insuranceFile", value);
    } else if (key === "customDays" && Array.isArray(value)) {
      // Handle customDays as array of strings: ["Mon", "Tue"]
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
    onError: (error: any) => {
      console.error("Failed to create car listing:", error);
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
    onError: (error: any) => {
      console.error("Failed to update car listing:", error);
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
    onError: (error: any) => {
      console.error("Failed to delete car listing:", error);
    },
  });
}