"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  Smartphone,
  Loader2,
} from "lucide-react";
import { usePayment } from "@/hooks/use-cart-items";
// Using `window.location.search` instead of `useSearchParams` to avoid
// requiring a Suspense boundary during prerender.
import { BookedItem, FailedItem } from "@/types/cart";

interface PaymentMethodSelectorProps {
  selectedMethod: string | null;
  onMethodChange: (method: string) => void;
  onPaymentSubmit: (data: { mobilephone: string }) => void;
  isLoading: boolean;
}

interface BookingStatusProps {
  bookedItems: BookedItem[];
  failedItems: FailedItem[];
}

interface OrderSummaryProps {
  total: number;
  itemCount: number;
  bookingGroupId: string;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingGroupId: string;
}

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

// Payment Method Component
const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  onPaymentSubmit,
  isLoading,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  // =================================================================
  //  Helper function to handle dynamic validation based on method
  // =================================================================
  const getValidationInfo = (methodId: string | null) => {
    let regex = /^\d{9}$/; // Default
    let prefixes = ["72", "73", "78", "79"];
    let placeholder = "7x/7x/7x/7x xxxxxxx";
    let title = "Enter a 9-digit number starting with 72, 73, 78, or 79.";

    if (methodId === "mtn") {
      // MTN numbers must start with 78 or 79
      regex = /^(78|79)[0-9]{7}$/;
      prefixes = ["78", "79"];
      placeholder = "78xxxxxxx or 79xxxxxxx";
      title = "Enter your 9-digit MTN number (must start with 78 or 79).";
    } else if (methodId === "airtel") {
      // Airtel numbers must start with 72 or 73
      regex = /^(72|73)[0-9]{7}$/;
      prefixes = ["72", "73"];
      placeholder = "72xxxxxxx or 73xxxxxxx";
      title = "Enter your 9-digit Airtel number (must start with 72 or 73).";
    }

    return { regex, prefixes, placeholder, title };
  };

  const validationInfo = getValidationInfo(selectedMethod);
  const { regex, prefixes, placeholder, title } = validationInfo;
  // =================================================================

  const paymentMethods = [
    {
      id: "mtn",
      name: "MTN Mobile Money",
      icon: <Smartphone className="w-5 h-5" />,
      description: "Pay with your MTN mobile money account",
    },
    {
      id: "airtel",
      name: "Airtel Money",
      icon: <Smartphone className="w-5 h-5" />,
      description: "Pay with your Airtel money account",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the dynamic regex for final submission check
    if (selectedMethod && regex.test(phoneNumber)) {
      const fullPhoneNumber = `250${phoneNumber}`;
      onPaymentSubmit({ mobilephone: fullPhoneNumber });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>

      <div className="grid grid-cols-1 gap-4 mb-6">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedMethod === method.id
                ? "border-black bg-black text-white"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onMethodChange(method.id)}
          >
            <div className="flex items-center mb-2">
              <span className="mr-3">{method.icon}</span>
              <h3 className="font-semibold">{method.name}</h3>
            </div>
            <p
              className={`text-sm ${
                selectedMethod === method.id ? "text-gray-200" : "text-gray-600"
              }`}
            >
              {method.description}
            </p>
          </div>
        ))}
      </div>

      {selectedMethod && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="flex items-center">
              <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
                +250
              </span>
              <input
                type="tel"
                value={phoneNumber}
                // =================================================================
                // UPDATED onChange logic for provider-specific prefix validation
                // =================================================================
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");

                  // Check if the current input starts with an ALLOWED prefix
                  const startsWithAllowedPrefix = prefixes.some(p => digits.startsWith(p));

                  // Handle input based on length and allowed prefixes
                  if (digits.length <= 9) {
                    if (digits.length <= 2) {
                      // Allow initial typing of single digits (e.g., 7) or valid two-digit prefixes (e.g., 78)
                      const isTypingValidPrefix = prefixes.some(p => p.startsWith(digits));

                      if (isTypingValidPrefix || digits.length === 0) {
                        setPhoneNumber(digits);
                      }
                    } else if (startsWithAllowedPrefix) {
                      // Allow typing up to 9 digits if a valid prefix is fully entered
                      setPhoneNumber(digits);
                    }
                  }
                }}
                // =================================================================

                onFocus={() => {
                  if (!phoneNumber) {
                    setPhoneNumber("");
                  }
                }}
                // Dynamic placeholder
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-black focus:border-transparent"
                required
                // Dynamic pattern
                pattern={regex.source}
                // Dynamic title
                title={title}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter your **9-digit number** without +250 prefix.
            </p>
          </div>

          <button
            type="submit"
            // =================================================================
            // UPDATED disabled check using dynamic regex
            // =================================================================
            disabled={
              !phoneNumber ||
              isLoading ||
              !regex.test(phoneNumber)
            }
            className={`w-full py-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center ${
              phoneNumber &&
              regex.test(phoneNumber) &&
              !isLoading
                ? "bg-black hover:bg-gray-800"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Pay Now
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

// Booking Status Component
const BookingStatus: React.FC<BookingStatusProps> = ({
  bookedItems,
  failedItems,
}) => {
  const hasSuccessfulBookings = bookedItems.length > 0;
  const hasFailedBookings = failedItems.length > 0;

  if (!hasSuccessfulBookings && !hasFailedBookings) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          No Booking Information
        </h3>
        <p className="text-yellow-700">
          Unable to load booking details. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Successfully Booked Items */}
      {hasSuccessfulBookings && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Ready for Payment
            </h2>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">{bookedItems.length} Item(s)</span>
            </div>
          </div>

          <div className="space-y-4">
            {bookedItems.map((item) => (
              <div
                key={item.id}
                className="border border-green-200 rounded-lg p-4 bg-green-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {item.carDetails.make} {item.carDetails.model} (
                      {item.carDetails.year})
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Plate: {item.carDetails.plateNumber}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm">
                      <div>
                        <span className="font-medium">Pick-up:</span>{" "}
                        {new Date(item.pickUpDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div>
                        <span className="font-medium">Drop-off:</span>{" "}
                        {new Date(item.dropOffDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-600">
                        {item.totalDays} day{item.totalDays > 1 ? "s" : ""}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        RWF {item.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Failed Bookings */}
      {hasFailedBookings && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <XCircle className="w-6 h-6 text-red-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">
              Failed Bookings
            </h2>
            <span className="ml-3 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {failedItems.length}
            </span>
          </div>

          <div className="space-y-4">
            {failedItems.map((item, index) => (
              <div
                key={index}
                className="border border-red-200 rounded-lg p-4 bg-red-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {item.carDetails.make} {item.carDetails.model} (
                      {item.carDetails.year})
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Plate: {item.carDetails.plateNumber}
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">
                          {item.reason}
                        </span>
                      </div>
                      {item.conflictingBookings > 0 && (
                        <p className="text-xs text-red-600 mt-1">
                          {item.conflictingBookings} conflicting booking(s)
                          found
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">
                      RWF {item.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Order Summary Component
const OrderSummary: React.FC<OrderSummaryProps> = ({
  total,
  itemCount,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-4">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Order <span className="text-gray-500 font-normal">Summary</span>
      </h2>

      <div className="border-t border-gray-200 my-4" />

  

      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-gray-900">Items</span>
        <span className="text-lg font-semibold text-gray-900">{itemCount}</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-semibold text-gray-900">
          Total Amount
        </span>
        <span className="text-2xl font-bold text-gray-900">
          RWF {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// Success Modal Component
const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed and payment processed successfully.
        </p>


        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 transition-colors"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
};

// Loading State Component
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    </div>
  </div>
);

// Error State Component
const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">CHECKOUT</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Load Booking
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "There was an error loading your booking details."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-6 py-3 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => (window.location.href = "/cars")}
              className="px-6 py-3 rounded-lg font-semibold text-gray-900 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Browse Cars
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main Checkout Component
const Checkout = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingData, setBookingData] = useState<{
    bookedItems: BookedItem[];
    failedItems: FailedItem[];
    bookingGroupId: string;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Payment mutation
  const { mutate: processPayment, isPending: isProcessingPayment } =
    usePayment();

  // Parse URL parameters on component mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      const bookingGroupId = params.get("bookingGroupId");
      const bookedItemsParam = params.get("bookedItems");
      const failedItemsParam = params.get("failedItems");
      const message = params.get("message");

      if (!bookingGroupId) {
        throw new Error("Missing booking information");
      }

      const bookedItems: BookedItem[] = bookedItemsParam
        ? JSON.parse(bookedItemsParam)
        : [];
      const failedItems: FailedItem[] = failedItemsParam
        ? JSON.parse(failedItemsParam)
        : [];

      setBookingData({
        bookedItems,
        failedItems,
        bookingGroupId,
        message: message ? decodeURIComponent(message) : "",
      });

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid booking data");
      setIsLoading(false);
    }
  }, []);

  // Handle payment submission
  const handlePaymentSubmit = (paymentData: { mobilephone: string }) => {
    if (!bookingData?.bookingGroupId) return;

    processPayment(
      {
        bookingGroupId: bookingData.bookingGroupId,
        paymentData,
      },
      {
        onSuccess: (data) => {
          console.log("Payment successful:", data);
          setShowSuccessModal(true);
        },
        onError: (error) => {
          console.error("Payment failed:", error);
          alert(`Payment failed: ${error.message || "Please try again"}`);
        },
      }
    );
  };

  // Calculate totals
  const totalBookedAmount =
    bookingData?.bookedItems?.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    ) || 0;
  const totalItems = bookingData?.bookedItems?.length || 0;

  const handleRetry = () => {
    window.location.reload();
  };

  // Handle loading and error states
  if (isLoading) return <LoadingState />;
  if (error || !bookingData)
    return (
      <ErrorState
        error={error || "No booking data found"}
        onRetry={handleRetry}
      />
    );

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-black mb-8">CHECKOUT</h1>

        {/* {bookingData.message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{bookingData.message}</p>
          </div>
        )} */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BookingStatus
              bookedItems={bookingData.bookedItems}
              failedItems={bookingData.failedItems}
            />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <OrderSummary
              total={totalBookedAmount}
              itemCount={totalItems}
              bookingGroupId={bookingData.bookingGroupId}
            />

            {totalItems > 0 && (
              <PaymentMethodSelector
                selectedMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
                onPaymentSubmit={handlePaymentSubmit}
                isLoading={isProcessingPayment}
              />
            )}
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          window.location.href = "/cart";
        }}
        bookingGroupId={bookingData.bookingGroupId}
      />
    </section>
  );
};

export default Checkout;