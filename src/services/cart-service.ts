import apiClient from "@/lib/api";
import { CartResponse, UpdateCartItemDto } from "@/types/cart";



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