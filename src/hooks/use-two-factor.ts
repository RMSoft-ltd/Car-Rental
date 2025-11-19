import { useMutation } from "@tanstack/react-query";
import authService from "@/services/auth.service";
import { getErrorMessage } from "@/utils/error-utils";
import { AuthResponse } from "@/types/auth";


interface UseTwoFactorOptions {
  onSuccess?: (response: AuthResponse) => void;
  onError?: (message: string, error: unknown) => void;
}

export function useTwoFactorVerification(options?: UseTwoFactorOptions) {
  return useMutation<AuthResponse, unknown, { otp: string }>({
    mutationFn: (variables: { otp: string }) =>
      authService.twoFactorAuthentication({
        otp: variables.otp,
      }),
    onSuccess: (response) => {
      options?.onSuccess?.(response);
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Failed to verify the 2FA token");
      options?.onError?.(message, error);
      console.error("2FA verification failed:", message, error);
    },
  });
}
