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

//  Configuration for cart queries
 
const CART_QUERY_CONFIG = {
  staleTime: 2 * 60 * 1000, 
  gcTime: 10 * 60 * 1000, 
  retry: 2,
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

//  Hook for fetching user's cart items
 
export const useCart = (userId: number): UseQueryResult<CartItem[], Error> => {
  return useQuery<CartItem[], Error>({
    queryKey: cartKeys.list(userId),
    queryFn: async () => {
      const data = await getCart(userId);
      
      // Validate and return items with backend-calculated values
      return data.items.map((item: CartItem) => ({
        ...item,
        // Ensure dates are properly formatted
        pickUpDate: new Date(item.pickUpDate).toISOString().split('T')[0],
        dropOffDate: new Date(item.dropOffDate).toISOString().split('T')[0],
        // Use backend-calculated values as source of truth
        totalDays: item.totalDays,
        totalAmount: item.totalAmount,
      }));
    },
    enabled: !!userId && userId > 0,
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

  // Total number of items in cart
  const totalItems = cartItems?.length ?? 0;

  const totalPrice = cartItems?.reduce((total, item) => {
    return total + (item.totalAmount || 0);
  }, 0) ?? 0;

  // Total number of rental days across all items
  const totalDays = cartItems?.reduce((total, item) => {
    return total + (item.totalDays || 0);
  }, 0) ?? 0;

  return {
    cartItems,
    totalItems,
    totalPrice,
    totalDays,
    isLoading,
    error,
  };
};

export const calculateRentalDays = (pickUpDate: string, dropOffDate: string): number => {
  const [pickYear, pickMonth, pickDay] = pickUpDate.split('-').map(Number);
  const [dropYear, dropMonth, dropDay] = dropOffDate.split('-').map(Number);
  
  const pickUp = new Date(pickYear, pickMonth - 1, pickDay);
  const dropOff = new Date(dropYear, dropMonth - 1, dropDay);
  
  const timeDiff = dropOff.getTime() - pickUp.getTime();
  const days = Math.round(timeDiff / (1000 * 60 * 60 * 24));
  
 
  return Math.max(days + 1, 1);
};

export const calculatePreviewPrice = (
  pricePerDay: number, 
  pickUpDate: string, 
  dropOffDate: string
): { days: number; total: number } => {
  const days = calculateRentalDays(pickUpDate, dropOffDate);
  const total = pricePerDay * days;
  
  return { days, total };
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
