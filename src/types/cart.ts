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

export interface AddToCartDto {
  carId: number;
  pickUpDate: string;
  dropOffDate: string;
}


export interface BookingResponse {
  message: string;
  bookedItems: BookedItem[];
  failedItems: FailedItem[];
  bookingGroupId: string;
}

export interface CarDetails {
  make: string;
  model: string;
  year: number;
  plateNumber: string;
}

export interface BookedItem {
  bookingStatus: string;
  paymentStatus: string;
  depositStatus: string;
  isActive: boolean;
  id: number;
  userId: number;
  carDetails: CarDetails;
  bookingGroupId: string;
  carOwnerId: number;
  carId: number;
  pickUpDate: string;      
  dropOffDate: string;     
  totalDays: number;
  totalAmount: number;
  updatedAt: string;      
  createdAt: string;       
}

export interface FailedItem {
  carId: number;
  carDetails: CarDetails;
  pickUpDate: string;   
  dropOffDate: string;    
  totalAmount: number;
  reason: string;
  reasonCode: string;     
  conflictingBookings: number;
}


export interface PaymentRequest {
  mobilephone: string;
}

export interface UnavailableDatesResponse {
  dates: string[];
}
