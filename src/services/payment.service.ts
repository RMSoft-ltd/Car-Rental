import apiClient from "@/lib/api";
import {
  Deposit,
  DepositRequest,
  BookingsPerOwnerList,
  BookingPerOwner,
  BookingHistoryResponse,
  BookingHistoryFilters,
  CarOwnerPaymentFilters,
} from "@/types/payment";

export const paymentService = {
  // Get all unpaid bookings per car owner with filters
  async getUnpaidBookingsPerOwner(
    filters?: CarOwnerPaymentFilters
  ): Promise<BookingsPerOwnerList> {
    const response = await apiClient.get("/admin-panel", { params: filters });
    return response.data;
  },

  // Get unpaid bookings for a specific car owner
  async getOwnerUnpaidBookings(ownerId: number): Promise<BookingPerOwner> {
    const response = await apiClient.get(`/admin-panel`, {
      params: { ownerId },
    });
    return response.data;
  },

  // Initiate deposit to car owner (admin only)
  async initiateDeposit(depositData: DepositRequest): Promise<Deposit> {
    const response = await apiClient.post(
      "/payments/admin/deposit",
      depositData
    );
    return response.data;
  },

  // Get admin balance
  async getAdminBalance(): Promise<any> {
    const response = await apiClient.get("/admin-panel/balance");
    return response.data;
  },

  // Get booking history
  async getBookingHistory(
    filters?: BookingHistoryFilters
  ): Promise<BookingHistoryResponse> {
    const response = await apiClient.get("/car-booking/history", {
      params: filters,
    });
    return response.data;
  },
};
