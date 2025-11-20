import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { CartItem, CartResponse, PaymentRequest } from "@/types/cart";
import {
  getCart,
  updateCartItem,
  deleteCartItem,
  requestPayment,
  proceedCartToCheckout,
  addToCart,
} from "@/services/cart-service";

/**
 * Query key factory for cart items
 */
export const cartKeys = {
  all: ["cart"] as const,
  lists: () => [...cartKeys.all, "list"] as const,
  list: (userId: number) => [...cartKeys.lists(), userId] as const,
  details: () => [...cartKeys.all, "detail"] as const,
  detail: (id: number) => [...cartKeys.details(), id] as const,
};

/**
 * Query key factory for payments
 */
export const paymentKeys = {
  all: ["payments"] as const,
  details: () => [...paymentKeys.all, "detail"] as const,
  detail: (bookingGroupId: string) =>
    [...paymentKeys.details(), bookingGroupId] as const,
};

/**
 * Configuration for cart queries
 */
const CART_QUERY_CONFIG = {
  staleTime: 2 * 60 * 1000, // 2 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 2,
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

/**
 * Hook for fetching user's cart items
 */
export const useCart = (userId: number): UseQueryResult<CartItem[], Error> => {
  return useQuery<CartItem[], Error>({
    queryKey: cartKeys.list(userId),
    queryFn: async () => {
      const data = await getCart(userId);
      return data.items;
    },
    enabled: !!userId,
    staleTime: CART_QUERY_CONFIG.staleTime,
    gcTime: CART_QUERY_CONFIG.gcTime,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: CART_QUERY_CONFIG.retry,
    retryDelay: CART_QUERY_CONFIG.retryDelay,
  });
};

/**
 * Hook for adding items to cart
 */
export const useAddToCart = (
  userId: number
): UseMutationResult<
  CartResponse,
  Error,
  { carId: number; pickUpDate: string; dropOffDate: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      carId,
      pickUpDate,
      dropOffDate,
    }: {
      carId: number;
      pickUpDate: string;
      dropOffDate: string;
    }) => {
      return await addToCart(userId, carId, { pickUpDate, dropOffDate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartKeys.list(userId),
      });
    },
    onError: (error) => {
      console.error("Add to cart error:", error);
    },
  });
};

/**
 * Hook for updating cart item dates
 */
export const useUpdateCartItem = (
  userId: number
): UseMutationResult<
  CartResponse,
  Error,
  { cartItemId: number; pickUpDate: string; dropOffDate: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cartItemId,
      pickUpDate,
      dropOffDate,
    }: {
      cartItemId: number;
      pickUpDate: string;
      dropOffDate: string;
    }) => {
      return await updateCartItem(cartItemId, { pickUpDate, dropOffDate });
    },

    onMutate: async ({ cartItemId, pickUpDate, dropOffDate }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.list(userId) });

      const previousCart = queryClient.getQueryData<CartItem[]>(
        cartKeys.list(userId)
      );

      if (previousCart) {
        queryClient.setQueryData<CartItem[]>(cartKeys.list(userId), (old) =>
          old
            ? old.map((item) =>
                item.id === cartItemId
                  ? { ...item, pickUpDate, dropOffDate }
                  : item
              )
            : old
        );
      }

      return { previousCart };
    },

    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.list(userId), context.previousCart);
      }
      console.error("Update cart item error:", error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list(userId) });
    },
  });
};

/**
 * Hook for deleting cart items
 */
export const useDeleteCartItem = (
  userId: number
): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItemId: number) => {
      return await deleteCartItem(cartItemId);
    },

    onMutate: async (cartItemId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.list(userId) });

      const previousCart = queryClient.getQueryData<CartItem[]>(
        cartKeys.list(userId)
      );

      if (previousCart) {
        queryClient.setQueryData<CartItem[]>(cartKeys.list(userId), (old) =>
          old ? old.filter((item) => item.id !== cartItemId) : old
        );
      }

      return { previousCart };
    },

    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.list(userId), context.previousCart);
      }
      console.error("Delete cart item error:", error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list(userId) });
    },
  });
};

/**
 * Hook to get cart summary information
 */
export const useCartSummary = (userId: number) => {
  const { data: cartItems, isLoading, error } = useCart(userId);

  const totalItems = cartItems?.length ?? 0;

  const totalPrice =
    cartItems?.reduce((total, item) => {
      const pickUp = new Date(item.pickUpDate);
      const dropOff = new Date(item.dropOffDate);
      const days = Math.ceil(
        (dropOff.getTime() - pickUp.getTime()) / (1000 * 60 * 60 * 24)
      );
      return total + item.car.pricePerDay * Math.max(days, 1);
    }, 0) ?? 0;

  return {
    cartItems,
    totalItems,
    totalPrice,
    isLoading,
    error,
  };
};

/**
 * Hook for processing payment
 */
export const usePayment = (): UseMutationResult<
  PaymentResponse,
  Error,
  { bookingGroupId: string; paymentData: PaymentRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingGroupId,
      paymentData,
    }: {
      bookingGroupId: string;
      paymentData: PaymentRequest;
    }) => {
      return await requestPayment(bookingGroupId, paymentData);
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: paymentKeys.detail(variables.bookingGroupId),
      });
    },

    onError: (error) => {
      console.error("Payment error:", error);
    },
  });
};

// proceed to checkout from cart
export const useProceedCartToCheckout = (
  userId: number
): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await proceedCartToCheckout(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartKeys.list(userId),
      });
    },
    onError: (error) => {
      console.error("Proceed to checkout error:", error);
    },
  });
};
