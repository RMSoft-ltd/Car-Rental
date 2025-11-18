// Payment and Booking Types

export type PaymentStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "REFUNDED"
  | "PROCESSING";
export type BookingStatus =
  | "CONFIRMED"
  | "PENDING"
  | "CANCELLED"
  | "COMPLETED"
  | "PROCESSING";
export type DepositStatus =
  | "PENDING"
  | "PARTIALLY_DEPOSITED"
  | "DEPOSITED"
  | "REFUNDED"
  | "FAILED";

export interface CarOwnerDetails {
  id: number;
  fname: string;
  lname: string;
  email: string;
}

// User details in booking response
export interface BookingUser {
  id: number;
  fName: string;
  lName: string;
  email: string;
  phone: string | null;
  picture: string | null;
}

// Car owner details in booking response
export interface BookingCarOwner {
  id: number;
  fName: string;
  lName: string;
  phone: string | null;
  email: string;
  picture: string | null;
}

// Car details in booking response
export interface BookingCar {
  id: number;
  title: string;
  pricePerDay: number;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
  carImages: string[];
  owner: BookingCarOwner;
}

export interface BookingDetail {
  id: number;
  userId: number;
  carId: number;
  bookingGroupId: string;
  pickUpDate: string;
  dropOffDate: string;
  expiresAt: string | null;
  totalDays: number;
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  depositStatus: DepositStatus;
  isActive: boolean;
  carOwnerId: number;
  createdAt: string;
  updatedAt: string;
  // Nested objects from API response
  user?: BookingUser;
  car?: BookingCar;
}

export interface BookingPerOwner {
  carOwnerId: number;
  totalBookings: number;
  totalAmountOwed: number;
  carOwnerDetails: CarOwnerDetails;
  details: BookingDetail[];
}

export type BookingsPerOwnerList = BookingPerOwner[];

// Deposit Types
export interface DepositRequest {
  carOwnerId: number;
  amount: number;
  bookingIds: number[];
  paymentMethod: "BANK_TRANSFER" | "MOBILE_MONEY";
  notes?: string;
}

export interface Deposit {
  id: number;
  carOwnerId: number;
  amount: number;
  bookingIds: number[];
  paymentMethod: string;
  status: DepositStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Booking History Types
export interface BookingHistoryFilters {
  // Pagination
  skip?: number; // Page number (starts from 1)
  limit?: number; // Number of items per page

  // ID Filters
  bookingGroupId?: string; // Filter by booking group ID
  userId?: number; // Filter by user ID (renter)
  ownerId?: number; // Filter by car owner user ID
  carId?: number; // Filter by car ID

  // Date Range Filters (Frontend-friendly)
  pickUpDate?: string; // Filter by exact pick up date (YYYY-MM-DD)
  pickUpDateFrom?: string; // Filter bookings with pick up date from this date
  pickUpDateTo?: string; // Filter bookings with pick up date until this date
  dropOffDate?: string; // Filter by exact drop off date (YYYY-MM-DD)
  dropOffDateFrom?: string; // Filter bookings with drop off date from this date
  dropOffDateTo?: string; // Filter bookings with drop off date until this date

  // Status Filters
  bookingStatus?: BookingStatus; // Filter by single booking status
  bookingStatuses?: BookingStatus[]; // Filter by multiple booking statuses
  paymentStatus?: PaymentStatus; // Filter by payment status

  // Other Filters
  isUpcoming?: boolean; // Filter bookings that are upcoming (pick up date > today)
  totalDays?: number; // Filter by exact total days (rarely used in UI)
  totalAmount?: number; // Filter by exact total amount (rarely used in UI)
  search?: string;
}

export interface BookingHistoryResponse {
  count: number; // Total count of bookings (matches API response)
  rows: BookingDetail[]; // Array of booking details (matches API response)
}

// Car Owner Payment List Filters (Exact API specification)
export interface CarOwnerPaymentFilters {
  skip?: number; // Page number (default: 0)
  limit?: number; // Number of items per page (default: 10)
  bookingGroupId?: string; // Filter by booking group ID
  userId?: number; // Filter by user ID
  ownerId?: number; // Filter by car owner user ID
  carId?: number; // Filter by car ID
  depositStatus?: DepositStatus; // Filter by deposit status (default: PENDING)
  totalDays?: number; // Filter by exact total days
  totalAmount?: number; // Filter by exact total amount
}

// Statistics Types
export interface PaymentStatistics {
  totalOwners: number;
  totalBookings: number;
  totalAmountOwed: number;
  pendingDeposits: number;
}

// Get Balance Response
export interface BalanceResponse {
  success: boolean;
  balance: number;
  currency: string;
  timestamp: string;
  rawResponse: {
    balance: number;
    success: boolean;
  };
}

// Make Deposit To Car Owner Request
export interface MakeDepositRequest {
  carOwnerId: number;
  bookingIds: number[];
  amount: number;
  reason: string;
  mobilephone: string;
}
