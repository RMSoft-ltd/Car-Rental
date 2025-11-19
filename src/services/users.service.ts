import apiClient from "@/lib/api";
import { User } from "@/types/auth";
import { ChangePasswordPayload, ChangePasswordResponse, ConfidentialInfo, Enable2FAPayload, Enable2FAResponse, PaymentChannel, PaymentChannelPayload, SingleUserResponse, ToggleStatusResponse, UpdatePaymentChannelPayload, UpdateUserPayload, UsersFilterParams, UsersResponse, VerifyEmailResponse } from "@/types/user";




export const UserService = {
  /**
   * Get all users with optional filtering and pagination
   */
  getUsers: async (params: UsersFilterParams = {}): Promise<UsersResponse> => {
    const { data } = await apiClient.get<UsersResponse>("/users", { params });
    return data;
  },

  /**
   * Get a specific user by ID
   */
  getUserById: async (id: number): Promise<SingleUserResponse> => {
    const { data } = await apiClient.get<SingleUserResponse>(`/users/${id}`);
    return data;
  },

  

  /**
   * Verify user email with token
   */
  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    const { data } = await apiClient.post<VerifyEmailResponse>(`/users/verify-email/${token}`);
    return data;
  },

  /**
   * Update user by ID
   */
  updateUser: async (id: number, payload: UpdateUserPayload): Promise<User> => {
    const { data } = await apiClient.patch<User>(`/users/${id}`, payload);
    return data;
  },

  /**
   * Toggle user active status
   */
  toggleUserStatus: async (id: number): Promise<ToggleStatusResponse> => {
    const { data } = await apiClient.put<ToggleStatusResponse>(`/users/${id}`);
    return data;
  },

  /**
   * Enable two-factor authentication
   */
  enable2FA: async (payload: Enable2FAPayload): Promise<Enable2FAResponse> => {
    const { data } = await apiClient.patch<Enable2FAResponse>(`/users/enable-2fa`, payload);
    return data;
  },

  /**
   * Get confidential information for a user
   */
  getConfidentialInfo: async (userId: number): Promise<ConfidentialInfo> => {
    const { data } = await apiClient.get<ConfidentialInfo>(`/users/confidential-info/${userId}`);
    return data;
  },

  /**
   * Update confidential information
   */
  updateConfidentialInfo: async (id: number, payload: Partial<ConfidentialInfo>): Promise<ConfidentialInfo> => {
    const { data } = await apiClient.patch<ConfidentialInfo>(`/users/confidential-info/${id}`, payload);
    return data;
  },

  /**
   * Change user password
   */
  changePassword: async (id: number, payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
    const { data } = await apiClient.put<ChangePasswordResponse>(`/users/change-password/${id}`, payload);
    return data;
  },

  /**
   * Add payment channel for a user
   */
  addPaymentChannel: async (userId: number, payload: PaymentChannelPayload): Promise<PaymentChannel> => {
    const { data } = await apiClient.post<PaymentChannel>(`/users/payment-channel/${userId}`, payload);
    return data;
  },

  /**
   * Get all payment channels for a user
   */
  getPaymentChannels: async (userId: number): Promise<PaymentChannel[]> => {
    const { data } = await apiClient.get<PaymentChannel[]>(`/users/payment-channel/${userId}`);
    return data;
  },

  /**
   * Update payment channel by ID
   */
  updatePaymentChannel: async (id: number, payload: UpdatePaymentChannelPayload): Promise<PaymentChannel> => {
    const { data } = await apiClient.patch<PaymentChannel>(`/users/payment-channel/${id}`, payload);
    return data;
  },
};


export const {
  getUsers,
  getUserById,
  verifyEmail,
  updateUser,
  toggleUserStatus,
  enable2FA,
  getConfidentialInfo,
  updateConfidentialInfo,
  changePassword,
  addPaymentChannel,
  getPaymentChannels,
  updatePaymentChannel,
} = UserService;