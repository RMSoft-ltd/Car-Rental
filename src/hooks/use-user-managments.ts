import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryResult,
    UseMutationResult,
} from "@tanstack/react-query";
import { User } from "@/types/auth";
import {
    ConfidentialInfo,
    PaymentChannel,
    UpdateUserPayload,
    ChangePasswordPayload,
    Enable2FAPayload,
    PaymentChannelPayload,
    UpdatePaymentChannelPayload,
    UsersFilterParams,
    UsersResponse,
    SignupResponse,
    VerifyEmailResponse,
    ToggleStatusResponse,
    Enable2FAResponse,
    ChangePasswordResponse,
    SingleUserResponse
} from "@/types/user";
import {
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
} from "@/services/users.service";

/**
 * Query key factory for users
 */
export const userKeys = {
    all: ["users"] as const,
    lists: () => [...userKeys.all, "list"] as const,
    list: (filters: UsersFilterParams) => [...userKeys.lists(), filters] as const,
    details: () => [...userKeys.all, "detail"] as const,
    detail: (id: number) => [...userKeys.details(), id] as const,
    confidentialInfo: (userId: number) => [...userKeys.detail(userId), "confidential"] as const,
    paymentChannels: (userId: number) => [...userKeys.detail(userId), "payment-channels"] as const,
};

/**
 * Configuration for user queries
 */
const USER_QUERY_CONFIG = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

/**
 * Hook for fetching users with filters
 */
export const useUsers = (
    filters: UsersFilterParams = {}
): UseQueryResult<UsersResponse, Error> => {
    return useQuery<UsersResponse, Error>({
        queryKey: userKeys.list(filters),
        queryFn: () => getUsers(filters),
        staleTime: USER_QUERY_CONFIG.staleTime,
        gcTime: USER_QUERY_CONFIG.gcTime,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: USER_QUERY_CONFIG.retry,
        retryDelay: USER_QUERY_CONFIG.retryDelay,
    });
};

/**
 * Hook for fetching a specific user by ID
 */
export const useUser = (
id: number, p0: { enabled: boolean; }): UseQueryResult<SingleUserResponse, Error> => {
    return useQuery<SingleUserResponse, Error>({
        queryKey: userKeys.detail(id),
        queryFn: () => getUserById(id),
        enabled: !!id,
        staleTime: USER_QUERY_CONFIG.staleTime,
        gcTime: USER_QUERY_CONFIG.gcTime,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        retry: USER_QUERY_CONFIG.retry,
        retryDelay: USER_QUERY_CONFIG.retryDelay,
    });
};



/**
 * Hook for email verification
 */
export const useVerifyEmail = (): UseMutationResult<
    VerifyEmailResponse,
    Error,
    string
> => {
    return useMutation({
        mutationFn: verifyEmail,
        onError: (error) => {
            console.error("Email verification error:", error);
        },
    });
};

/**
 * Hook for updating user profile
 */
export const useUpdateUser = (): UseMutationResult<
    User,
    Error,
    { id: number; payload: UpdateUserPayload }
> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }) => updateUser(id, payload),
        onSuccess: (data, variables) => {
            // Update the specific user cache
            queryClient.setQueryData(userKeys.detail(variables.id), data);

            // Invalidate users list to reflect changes
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
        onError: (error) => {
            console.error("Update user error:", error);
        },
    });
};

/**
 * Hook for toggling user active status
 */
export const useToggleUserStatus = (): UseMutationResult<
    ToggleStatusResponse,
    Error,
    number
> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleUserStatus,
        onSuccess: (data, userId) => {
            // Update the specific user cache
            queryClient.setQueryData(userKeys.detail(userId), data.user);

            // Invalidate users list to reflect status change
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
        onError: (error) => {
            console.error("Toggle user status error:", error);
        },
    });
};

/**
 * Hook for enabling/disabling 2FA
 */
export const useEnable2FA = (): UseMutationResult<
    Enable2FAResponse,
    Error,
    Enable2FAPayload
> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: enable2FA,
        onSuccess: () => {
            // Invalidate user-related queries to reflect 2FA status
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
        onError: (error) => {
            console.error("Enable 2FA error:", error);
        },
    });
};

/**
 * Hook for fetching confidential information
 */
export const useConfidentialInfo = (
    userId: number
): UseQueryResult<ConfidentialInfo, Error> => {
    return useQuery<ConfidentialInfo, Error>({
        queryKey: userKeys.confidentialInfo(userId),
        queryFn: () => getConfidentialInfo(userId),
        enabled: !!userId,
        staleTime: 2 * 60 * 1000, // 2 minutes for sensitive data
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1, // Less retries for sensitive data
    });
};

/**
 * Hook for updating confidential information
 */
export const useUpdateConfidentialInfo = (): UseMutationResult<
    ConfidentialInfo,
    Error,
    { id: number; payload: Partial<ConfidentialInfo> }
> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }) => updateConfidentialInfo(id, payload),
        onSuccess: (data, variables) => {
            // Update confidential info cache
            queryClient.setQueryData(
                userKeys.confidentialInfo(variables.id),
                data
            );
        },
        onError: (error) => {
            console.error("Update confidential info error:", error);
        },
    });
};

/**
 * Hook for changing user password
 */
export const useChangePassword = (): UseMutationResult<
    ChangePasswordResponse,
    Error,
    { id: number; payload: ChangePasswordPayload }
> => {
    return useMutation({
        mutationFn: ({ id, payload }) => changePassword(id, payload),
        onError: (error) => {
            console.error("Change password error:", error);
        },
    });
};

/**
 * Hook for fetching user payment channels
 */
export const usePaymentChannels = (
    userId: number
): UseQueryResult<PaymentChannel[], Error> => {
    return useQuery<PaymentChannel[], Error>({
        queryKey: userKeys.paymentChannels(userId),
        queryFn: () => getPaymentChannels(userId),
        enabled: !!userId,
        staleTime: USER_QUERY_CONFIG.staleTime,
        gcTime: USER_QUERY_CONFIG.gcTime,
        refetchOnWindowFocus: false,
        retry: USER_QUERY_CONFIG.retry,
    });
};

/**
 * Hook for adding payment channel
 */
export const useAddPaymentChannel = (): UseMutationResult<
    PaymentChannel,
    Error,
    { userId: number; payload: PaymentChannelPayload }
> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, payload }) => addPaymentChannel(userId, payload),
        onSuccess: (data, variables) => {
            // Invalidate payment channels list
            queryClient.invalidateQueries({
                queryKey: userKeys.paymentChannels(variables.userId)
            });
        },
        onError: (error) => {
            console.error("Add payment channel error:", error);
        },
    });
};

/**
 * Hook for updating payment channel
 */
export const useUpdatePaymentChannel = (): UseMutationResult<
    PaymentChannel,
    Error,
    { id: number; payload: UpdatePaymentChannelPayload }
> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }) => updatePaymentChannel(id, payload),
        onSuccess: () => {
            // Invalidate payment channels queries
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
        onError: (error) => {
            console.error("Update payment channel error:", error);
        },
    });
};

/**
 * Hook for user search with debouncing
 */
export const useUserSearch = (
    searchTerm: string,
    filters: Omit<UsersFilterParams, 'search'> = {}
) => {
    return useUsers({
        ...filters,
        search: searchTerm || undefined,
    });
};

/**
 * Hook for paginated users with search
 */
export const usePaginatedUsers = (
    page: number,
    limit: number = 25,
    filters: Omit<UsersFilterParams, 'limit' | 'skip'> = {}
) => {
    const skip = (page - 1) * limit;

    return useUsers({
        ...filters,
        limit,
        skip,
    });
};

/**
 * Hook for admin users only
 */
export const useAdminUsers = (filters: Omit<UsersFilterParams, 'role'> = {}) => {
    return useUsers({
        ...filters,
        role: 'admin',
    });
};

/**
 * Hook for active users only
 */
export const useActiveUsers = (filters: Omit<UsersFilterParams, 'isActive'> = {}) => {
    return useUsers({
        ...filters,
        isActive: true,
    });
};