"use client";

import CartCard from "@/components/cart-card";
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { 
  useCart, 
  useCartSummary, 
  useDeleteCartItem, 
  useProceedCartToCheckout, 
  useUpdateCartItem 
} from "@/hooks/use-cart-items";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { BookingResponse } from "@/types/cart";

// Loading Skeleton Component
const CartCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 h-56 flex-shrink-0 bg-gray-200" />
        <div className="flex-1 p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-36" />
            <div className="h-4 bg-gray-200 rounded w-28" />
          </div>
        </div>
        <div className="border-t md:border-t-0 md:border-l border-gray-200 p-6 md:w-80">
          <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-20 mb-4" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

// Empty Cart Component
const EmptyCart = () => {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-100 rounded-full p-8 mb-6">
        <ShoppingCart className="w-24 h-24 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Looks like you haven&apos;t added any cars to your cart yet. Start browsing to find your perfect ride!
      </p>
      <button 
        onClick={() => router.push('/cars')}
        className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
      >
        Browse Cars
      </button>
    </div>
  );
};

// Order Summary Component
interface OrderSummaryProps {
  total: number;
  itemCount: number;
  onCheckout: () => void;
  isLoading?: boolean;
  isCheckingOut?: boolean;
}

const OrderSummary = ({ 
  total, 
  itemCount, 
  onCheckout, 
  isLoading = false,
  isCheckingOut = false 
}: OrderSummaryProps) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-4 animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-40 mb-4" />
        <div className="border-t border-gray-200 my-4" />
        <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
        <div className="h-10 bg-gray-200 rounded w-24 mb-4" />
        <div className="h-24 bg-gray-200 rounded mb-4" />
        <div className="h-12 bg-gray-300 rounded" />
      </div>
    );
  }

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
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-gray-900">
          RWF {total.toLocaleString()}
        </span>
      </div>

      <label className="flex items-start space-x-3 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black mt-0.5"
        />
        <span className="text-sm text-gray-700">
          I agree to the <span className="font-semibold underline">terms and conditions</span>
        </span>
      </label>

      <button
        onClick={onCheckout}
        disabled={!agreedToTerms || itemCount === 0 || isCheckingOut}
        className={`w-full py-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center ${
          agreedToTerms && itemCount > 0 && !isCheckingOut
            ? "bg-black hover:bg-gray-800"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {isCheckingOut ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Processing...
          </>
        ) : (
          "Process Checkout"
        )}
      </button>
    </div>
  );
};

// Error State Component
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-red-50 rounded-full p-8 mb-6">
        <ShoppingCart className="w-24 h-24 text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">{message}</p>
      <button 
        onClick={onRetry}
        className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

// Main Cart Page Component
const Cart = () => {
  const { user } = useAuth();
  const router = useRouter();
  const userId = user?.id ?? 0;
  
  // State to store checkout response
  // const [checkoutData, setCheckoutData] = useState<BookingResponse | null>(null);
  
  // Fetch cart data
  const { 
    data: cartItems, 
    isLoading: isCartLoading, 
    error: cartError,
    refetch: refetchCart 
  } = useCart(userId);
  
  // Get summary with loading states
  const { 
    totalItems, 
    totalPrice, 
    isLoading: isSummaryLoading,
    error: summaryError 
  } = useCartSummary(userId);
  
  // Update dates mutation
  const { mutate: updateDates, isPending: isUpdating } = useUpdateCartItem(userId);
  
  // Delete item mutation
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteCartItem(userId);
  
  // Checkout mutation
  const { 
    mutate: checkout, 
    isPending: isCheckingOut 
  } = useProceedCartToCheckout(userId);

  const handleCheckout = () => {
    checkout(undefined, {
      onSuccess: (data: unknown) => {
        // Store the checkout response data
        // setCheckoutData(data as BookingResponse);
        const response = data as BookingResponse;

        // Navigate to checkout page with all booking data
        const queryParams = new URLSearchParams({
          bookingGroupId: response.bookingGroupId,
          bookedItems: JSON.stringify(response.bookedItems || []),
          failedItems: JSON.stringify(response.failedItems || []),
          message: encodeURIComponent(response.message || '')
        }).toString();

        router.push(`/checkout?${queryParams}`);
      },
      onError: (error: unknown) => {
        console.error('Checkout failed:', error);
        const message = (error as { message?: string })?.message || 'Please try again';
        alert(`Checkout failed: ${message}`);
      }
    });
  };

  const handleUpdateDates = (cartItemId: number, pickUpDate: string, dropOffDate: string) => {
    updateDates({
      cartItemId,
      pickUpDate,
      dropOffDate
    });
  };

  const handleDeleteItem = (cartItemId: number) => {
    deleteItem(cartItemId);
  };

  const handleRetry = () => {
    refetchCart();
  };

  // Combined loading state
  const isLoading = isCartLoading || isSummaryLoading;
  
  // Combined error state
  const error = cartError || summaryError;

  // Error State
  if (error && !isLoading) {
    return (
      <section className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-black">CART</h1>
          <ErrorState 
            message={error.message || "Failed to load cart items"} 
            onRetry={handleRetry}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-8 text-black">CART</h1>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <CartCardSkeleton />
            <CartCardSkeleton />
            <CartCardSkeleton />
            <CartCardSkeleton />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!cartItems || cartItems.length === 0) && <EmptyCart />}

        {/* Cart with Items */}
        {!isLoading && cartItems && cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <CartCard 
                  key={item.id} 
                  item={item}
                  onUpdateDates={handleUpdateDates}
                  onDeleteItem={handleDeleteItem}
                  isUpdating={isUpdating}
                  isDeleting={isDeleting}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                total={totalPrice}
                itemCount={totalItems}
                onCheckout={handleCheckout}
                isLoading={isSummaryLoading}
                isCheckingOut={isCheckingOut}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;