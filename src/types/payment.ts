// Deposit interface - used for deposit operations
export interface Deposit {
  id: string;
  carOwnerId: string;
  carOwnerName: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  initiatedBy: string;
  initiatedDate: string;
  completedDate?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  momoDetails?: {
    phoneNumber: string;
    provider: "MTN" | "Airtel";
  };
  notes?: string;
}

// Deposit request interface - used for initiating deposits
export interface DepositRequest {
  carOwnerId: string;
  amount: number;
  paymentMethod: "bank" | "momo";
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  momoDetails?: {
    phoneNumber: string;
    provider: "MTN" | "Airtel";
  };
  notes?: string;
}

// Booking detail interface - individual booking information
export interface BookingDetail {
  id: number;
  userId: number;
  carId: number;
  bookingGroupId: string;
  pickUpDate: string;
  dropOffDate: string;
  totalDays: number;
  totalAmount: number;
  bookingStatus: "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";
  paymentStatus: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
  depositStatus: "PENDING" | "PAID" | "REFUNDED";
  isActive: boolean;
  carOwnerId: number;
  createdAt: string;
  updatedAt: string;
}

// Car owner details interface
export interface CarOwnerDetails {
  id: number;
  fname: string;
  lname: string;
  email: string;
}

// Booking per owner interface - aggregated bookings for each car owner
export interface BookingPerOwner {
  carOwnerId: number;
  totalBookings: number;
  totalAmountOwed: number;
  carOwnerDetails: CarOwnerDetails;
  details: BookingDetail[];
}

// List of bookings per owner
export type BookingsPerOwnerList = BookingPerOwner[];
