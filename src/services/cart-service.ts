import apiClient from "@/lib/api";
import {
  CartResponse,
  UpdateCartItemDto,
  PaymentRequest,
  BookedItem,
  AddToCartDto,
} from "@/types/cart";

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
 * Add a car to the user's cart
 * @param userId - The user's ID
 * @param carId - The car's ID
 * @param cartData - Cart item data (pickUpDate, dropOffDate)
 * @returns Cart response with updated items
 */
export const addToCart = async (
  userId: number,
  carId: number,
  cartData: Omit<AddToCartDto, "carId">
): Promise<CartResponse> => {
  const { data } = await apiClient.post<CartResponse>(
    `/car-booking/booking-cart/${userId}/${carId}`,
    cartData
  );
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

export interface DirectBookingPayload {
  pickUpDate: string;
  dropOffDate: string;
}

export const bookCarNow = async (
  userId: number,
  carId: number,
  payload: DirectBookingPayload
) => {
  const { data } = await apiClient.post<BookedItem[]>(
    `/car-booking/booking/${userId}/${carId}`,
    payload
  );
  return data;
};
