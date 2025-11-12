import { Car } from "./car-listing";

export interface CartResponse {
  cart: Cart;
  items: CartItem[];
}

export interface Cart {
  id: number;
  userId: number;
}

export interface CartItem {
  id: number;
  userId: number | null;
  cartId: number;
  carId: number;
  pickUpDate: string; 
  dropOffDate: string; 
  totalDays: number;
  amount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  car: Car;
}


export interface UpdateCartItemDto {
  pickUpDate: string; 
  dropOffDate: string; 
}