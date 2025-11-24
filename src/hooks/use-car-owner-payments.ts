import { useMutation, useQuery } from "@tanstack/react-query";
import { CarOwnerPaymentFilters, BookingsPerOwnerList, InitiateDepositRequest } from "@/types/payment";
import { paymentService } from "@/services/payment.service";
import { getErrorMessage } from "@/utils/error-utils";

interface CarOwnerPaymentsResponse {
  data: BookingsPerOwnerList;
  total: number;
  totalPages: number;
  currentPage: number;
}

export const paymentKeys = {
  all: ["car-owner-payments"] as const,
  balanceKey: ["account-balance"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (filters: CarOwnerPaymentFilters) =>
    [...paymentKeys.lists(), filters] as const,
  balance: () => [...paymentKeys.balanceKey, "account-balance"] as const,
};

async function fetchCarOwnerPayments(
  filters: CarOwnerPaymentFilters
): Promise<CarOwnerPaymentsResponse> {
  const response = await paymentService.getUnpaidBookingsPerOwner(filters);

  // Calculate pagination info (adjust based on your actual API response structure)
  const total = response.length;
  const limit = filters.limit || 10;
  const currentPage = filters.skip || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: response,
    total,
    totalPages,
    currentPage,
  };
}

export function useCarOwnerPayments(filters: CarOwnerPaymentFilters) {
  return useQuery({
    queryKey: paymentKeys.list(filters),
    queryFn: () => fetchCarOwnerPayments(filters),
    staleTime: 30000,
  });
}

export function useAccoutBalance() {
  return useQuery({
    queryKey: paymentKeys.balance(),
    queryFn: () => paymentService.getAdminBalance(),
    staleTime: 30000,
  });
}

// Initiate Deposit
export function useInitiateDeposit() {
  return useMutation({
    mutationFn: (depositData: InitiateDepositRequest) => paymentService.initiateDeposit(depositData),
    onSuccess: (data) => {
      console.log("Initiate deposit successful:", data);
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to initiate deposit.");
      console.error("Failed to initiate deposit:", message, error);
    },
  });
}
