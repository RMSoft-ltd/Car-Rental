import apiClient from "@/lib/api";
import { BookingResponse, CartResponse, UpdateCartItemDto, PaymentRequest } from "@/types/cart";

/**
 * Fetch all cart items for a user
 * @param userId - The user's ID
 * @returns Cart response with items
 */
export const getCart = async (userId: number): Promise<CartResponse> => {
  const { data } = await apiClient.get<CartResponse>(`/car-booking/${userId}`);
  return data;
};

/**
 * Update cart item dates by cart item ID
 * @param cartItemId - The cart item ID to update
 * @param updateData - Pick-up and drop-off dates
 * @returns Updated cart response
 */
export const updateCartItem = async (
  cartItemId: number,
  updateData: UpdateCartItemDto
): Promise<CartResponse> => {
  const { data } = await apiClient.patch<CartResponse>(`/car-booking/${cartItemId}`, updateData);
  return data;
};

/**
 * Delete a cart item by ID
 * @param cartItemId - The cart item ID to delete
 */
export const deleteCartItem = async (cartItemId: number): Promise<void> => {
  await apiClient.delete(`/car-booking/${cartItemId}`);
};

/**
 * Checkout a cart item by ID
 * @param userId - The cart item ID to checkout
 */
export const checkout = async (userId: number): Promise<void> => {
  await apiClient.post(`/car-booking/booking/${userId}`);
};



/**
 * Request payment for a booking group
 * @param bookingGroupId - The booking group ID
 * @param paymentData - Payment request with mobile phone number
 * @returns Payment response
 */
export const requestPayment = async (
  bookingGroupId: string,
  paymentData: PaymentRequest
) => {
  const { data } = await apiClient.post(`/payment/pay/${bookingGroupId}`, paymentData);
  return data;
};


export const proceedCartToCheckout = async (userId: number) => {
  const { data } = await apiClient.post(`/car-booking/booking/${userId}`);
  return data;
};
