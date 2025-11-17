import { useQuery } from "@tanstack/react-query";
import { BookingHistoryFilters, BookingHistoryResponse } from "@/types/payment";
import { paymentService } from "@/services/payment.service";

/**
 * Hook to fetch booking history with filters
 *
 * @param filters - Optional filters for booking history
 * @param filters.userId - Filter by user ID (shows bookings where user is the RENTER)
 * @param filters.bookingStatus - Filter by booking status (CONFIRMED, PENDING, CANCELLED, COMPLETED, PROCESSING)
 * @param filters.paymentStatus - Filter by payment status (PAID, UNPAID, PENDING, FAILED, REFUNDED, PROCESSING)
 * @param filters.page - Page number for pagination
 * @param filters.limit - Number of items per page
 * @param filters.startDate - Filter by start date
 * @param filters.endDate - Filter by end date
 *
 * @returns Query result with booking history data
 *
 * @example
 * // For regular users - show only their bookings
 * const { data, isLoading } = useBookingHistory({ userId: currentUserId });
 *
 * @example
 * // For admins - show all bookings
 * const { data, isLoading } = useBookingHistory();
 */
export function useBookingHistory(filters?: BookingHistoryFilters) {
  return useQuery({
    queryKey: ["booking-history", filters],
    queryFn: () => paymentService.getBookingHistory(filters),
    staleTime: 30000, // 30 seconds
  });
}
