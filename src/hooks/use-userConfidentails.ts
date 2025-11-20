import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ChangePasswordPayload,
  ChangePasswordResponse,
  ConfidentialInfoPayload,
  PaymentChannel,
  PaymentChannelPayload,
  UserDetailsPayload,
  UserDetailsResponse,
} from "@/types/user";
import { getErrorMessage } from "@/utils/error-utils";
import { ApiError } from "@/types/Api";
import userService from "@/services/userConfidentials.service";
import { changePassword } from "@/services/users.service";

interface MutationOptions<TData = unknown> {
  onSuccess?: (data: TData) => void;
  onError?: (message: string, error: unknown) => void;
}

type ConfidentialInfoMutationInput = ConfidentialInfoPayload & {
  recordId?: number;
};

export function useConfidentialInfoMutation(
  userId?: number,
  options?: MutationOptions
) {
  return useMutation({
    mutationFn: async (variables: ConfidentialInfoMutationInput) => {
      const { recordId, ...payload } = variables;
      if (recordId) {
        return await userService.updateConfidentialInfo(recordId, payload);
      }
      if (!userId) {
        throw new Error("Missing user id. Please sign in and try again.");
      }
      return await userService.submitConfidentialInfo(userId, payload);
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      const message = getErrorMessage(
        error,
        "Failed to update confidential information."
      );
      options?.onError?.(message, error);
    },
  });
}

export function useAddPaymentChannelMutation(
  userId?: number,
  options?: MutationOptions
) {
  return useMutation({
    mutationFn: async (payload: PaymentChannelPayload) => {
      if (!userId) {
        throw new Error("Missing user id. Please sign in and try again.");
      }
      return await userService.addPaymentChannel(userId, payload);
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      const message = getErrorMessage(
        error,
        "Failed to add payment channel."
      );
      options?.onError?.(message, error);
    },
  });
}

interface UpdatePaymentChannelVariables {
  id: number;
  payload: PaymentChannelPayload;
}

export function useUpdatePaymentChannelMutation(
  options?: MutationOptions
) {
  return useMutation({
    mutationFn: async (variables: UpdatePaymentChannelVariables) => {
      return await userService.updatePaymentChannel(
        variables.id,
        variables.payload
      );
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      const message = getErrorMessage(
        error,
        "Failed to update payment channel."
      );
      options?.onError?.(message, error);
    },
  });
}

export function useUpdateUserDetailsMutation(
  userId?: number,
  options?: MutationOptions
) {
  return useMutation({
    mutationFn: async (payload: UserDetailsPayload) => {
      if (!userId) {
        throw new Error("Missing user id. Please sign in and try again.");
      }
      return await userService.updateUserDetails(userId, payload);
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to update profile.");
      options?.onError?.(message, error);
    },
  });
}

export function useChangePasswordMutation(
  userId?: number,
  options?: MutationOptions<ChangePasswordResponse>
) {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      if (!userId) {
        throw new Error("Missing user id. Please sign in and try again.");
      }
      return await changePassword(userId, payload);
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to update password.");
      options?.onError?.(message, error);
    },
  });
}

interface QueryOptions<TData = unknown> {
  enabled?: boolean;
  onSuccess?: (data: TData) => void;
  onError?: (message: string, error: unknown) => void;
}

export function usePaymentChannelsQuery(
  userId?: number,
  options?: QueryOptions<PaymentChannel[]>
) {
  const query = useQuery<PaymentChannel[], ApiError>({
    queryKey: ["paymentChannels", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("Missing user id. Please sign in and try again.");
      }
      return await userService.getPaymentChannels(userId);
    },
    enabled: options?.enabled ?? Boolean(userId),
  });

  useEffect(() => {
    if (query.data) {
      options?.onSuccess?.(query.data);
    }
  }, [query.data, options]);

  useEffect(() => {
    if (query.error) {
      const message = getErrorMessage(
        query.error,
        "Failed to load payment channels."
      );
      options?.onError?.(message, query.error);
    }
  }, [query.error, options]);

  return query;
}

export function useUserDetailsQuery(
  userId?: number,
  options?: QueryOptions<UserDetailsResponse>
) {
  const query = useQuery<UserDetailsResponse, ApiError>({
    queryKey: ["userDetails", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("Missing user id. Please sign in and try again.");
      }
      return await userService.getUserDetails(userId);
    },
    enabled: options?.enabled ?? Boolean(userId),
  });

  useEffect(() => {
    if (query.data) {
      options?.onSuccess?.(query.data);
    }
  }, [query.data, options]);

  useEffect(() => {
    if (query.error) {
      const message = getErrorMessage(
        query.error,
        "Failed to load user information."
      );
      options?.onError?.(message, query.error);
    }
  }, [query.error, options]);

  return query;
}

