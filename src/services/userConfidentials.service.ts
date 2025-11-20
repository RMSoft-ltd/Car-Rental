import apiClient from "@/lib/api";
import {
  ConfidentialInfoPayload,
  PaymentChannel,
  PaymentChannelPayload,
  UserDetailsPayload,
  UserDetailsResponse,
} from "@/types/user";
import { AxiosError } from "axios";
import { ApiError } from "@/types/Api";

const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    if (error.response) {
      const errorData = error.response.data as ApiError;
      return {
        message:
          errorData?.message ||
          errorData?.errors?.[0] ||
          "An error occurred while processing your request.",
        status: error.response.status,
        errors: errorData?.errors,
      };
    }

    if (error.request) {
      return {
        message: "Network error. Please check your internet connection.",
        status: 0,
      };
    }
  } else if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "An unexpected error occurred." };
};

const buildConfidentialInfoFormData = (
  payload: ConfidentialInfoPayload
): FormData => {
  const formData = new FormData();
  formData.append("isCompany", String(payload.isCompany));

  const optionalFields: Array<
    keyof Omit<ConfidentialInfoPayload, "isCompany" | "registrationCert">
  > = [
    "companyName",
    "dob",
    "nid",
    "passport",
    "driverLicense",
    "tin",
    "addressCountry",
    "addressProvince",
    "addressDistrict",
    "addressSector",
    "addressCell",
  ];

  optionalFields.forEach((field) => {
    const value = payload[field];
    if (typeof value === "string" && value.trim() !== "") {
      formData.append(field, value);
    }
  });

  if (payload.registrationCert) {
    formData.append("registrationCert", payload.registrationCert);
  }

  return formData;
};

export const userService = {
  async submitConfidentialInfo(
    userId: number,
    payload: ConfidentialInfoPayload
  ) {
    try {
      const formData = buildConfidentialInfoFormData(payload);

      const response = await apiClient.post(
        `/users/confidential-info/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateConfidentialInfo(
    userId: number,
    payload: ConfidentialInfoPayload
  ) {
    try {
      const formData = buildConfidentialInfoFormData(payload);
      const response = await apiClient.patch(
        `/users/confidential-info/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async addPaymentChannel(
    userId: number,
    payload: PaymentChannelPayload
  ) {
    try {
      const response = await apiClient.post(
        `/users/payment-channel/${userId}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updatePaymentChannel(
    channelId: number,
    payload: PaymentChannelPayload
  ) {
    try {
      const response = await apiClient.patch(
        `/users/payment-channel/${channelId}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getPaymentChannels(userId: number): Promise<PaymentChannel[]> {
    try {
      const response = await apiClient.get(
        `/users/payment-channel/${userId}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getUserDetails(userId: number): Promise<UserDetailsResponse> {
    try {
      const response = await apiClient.get<UserDetailsResponse>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateUserDetails(
    userId: number,
    payload: UserDetailsPayload
  ): Promise<UserDetailsResponse> {
    try {
      const response = await apiClient.patch<UserDetailsResponse>(
        `/users/${userId}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default userService;

