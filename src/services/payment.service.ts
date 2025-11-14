import apiClient from "@/lib/api";
import {
  Deposit,
  DepositRequest,
  BookingsPerOwnerList,
  BookingPerOwner,
} from "@/types/payment";

export const paymentService = {
  // Get all unpaid bookings per car owner (admin only)
  async getUnpaidBookingsPerOwner(): Promise<BookingsPerOwnerList> {
    const response = await apiClient.get("/admin-panel");
    return response.data;
  },

  // Get unpaid bookings for a specific car owner
  async getOwnerUnpaidBookings(ownerId: number): Promise<BookingPerOwner> {
    const response = await apiClient.get(`/admin-panel`);
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
};
