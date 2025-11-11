import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { CarQueryParams, CarResponse } from "@/types/car-listing";
import {
  createCarListing,
  getCarByUserId,
  getCars,
  updateCarListing,
} from "@/services/car-listing-service";

/** Query key factory for car listings */
export const carKeys = {
  all: ["cars"] as const,
  lists: () => [...carKeys.all, "list"] as const,
  list: (params?: CarQueryParams) => [...carKeys.lists(), params] as const,
  details: () => [...carKeys.all, "detail"] as const,
  detail: (id: number) => [...carKeys.details(), id] as const,
};

/** Configuration for car listing query */
const CAR_QUERY_CONFIG = {
  staleTime: 2 * 60 * 1000, // 2 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  retry: 2,
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

/**
 * Custom hook for fetching and caching car listings
 * @param params - Optional query parameters for filtering and pagination
 * @returns React Query result with car data, loading state, and error handling
 */
export const useCarList = (
  params?: CarQueryParams
): UseQueryResult<CarResponse, Error> => {
  return useQuery<CarResponse, Error>({
    queryKey: carKeys.list(params),
    queryFn: () => getCars(params),

    // Cache configuration
    staleTime: CAR_QUERY_CONFIG.staleTime,
    gcTime: CAR_QUERY_CONFIG.gcTime,

    // Refetch behaviors
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,

    // Performance optimizations
    retry: CAR_QUERY_CONFIG.retry,
    retryDelay: CAR_QUERY_CONFIG.retryDelay,
  });
};

export const useUserCarList = (
  userId: number,
  params?: Pick<CarQueryParams, "search" | "limit" | "skip">
) => {
  return useQuery<CarResponse, Error>({
    queryKey: carKeys.list(params),
    queryFn: () => getCarByUserId(userId, params),

    // Cache configuration
    staleTime: CAR_QUERY_CONFIG.staleTime,
    gcTime: CAR_QUERY_CONFIG.gcTime,

    // Refetch behaviors
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,

    // Performance optimizations
    retry: CAR_QUERY_CONFIG.retry,
    retryDelay: CAR_QUERY_CONFIG.retryDelay,
  });
};

// Hook to create a new scheduled trip
export const useCreateCarListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (carData: FormData) => createCarListing(carData),
    onSuccess: () => {
      // Invalidate and refetch cars list
      queryClient.invalidateQueries({ queryKey: carKeys.lists() });
    },
    onError: () => {},
  });
};

// Hook to update a scheduled trip
export const useUpdateCarListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ carId, carData }: { carId: number; carData: FormData }) =>
      updateCarListing(carId, carData),
    onSuccess: () => {
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: carKeys.lists() });
    },
    onError: () => {},
  });
};
