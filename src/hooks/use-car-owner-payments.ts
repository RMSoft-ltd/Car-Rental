import { useQuery } from "@tanstack/react-query";
import { CarOwnerPaymentFilters, BookingsPerOwnerList } from "@/types/payment";
import { paymentService } from "@/services/payment.service";

interface CarOwnerPaymentsResponse {
  data: BookingsPerOwnerList;
  total: number;
  totalPages: number;
  currentPage: number;
}

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
    queryKey: ["car-owner-payments", filters],
    queryFn: () => fetchCarOwnerPayments(filters),
    staleTime: 30000, // 30 seconds
  });
}
