"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PaymentHistoryContent from "@/components/dashboard/PaymentHistoryContent";
import { DollarSign, Shield } from "lucide-react";
import { useCarOwnerPayments } from "@/hooks/use-car-owner-payments";
import { CarOwnerPaymentFilters } from "@/types/payment";
import { CarOwnerPaymentList } from "@/components/dashboard/CarOwnerPaymentList";
import { useCarList } from "@/hooks/use-car-list";
import { TokenService } from "@/utils/token";

export default function PaymentsPage() {
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);
    const loggedInUser = TokenService.getUserData();
    const loggedInUserId = loggedInUser?.id || user?.id || 0;

    const [filters, setFilters] = useState<CarOwnerPaymentFilters>({
        skip: 0,
        limit: 10,
        depositStatus: "PENDING",
    });

    // Check if user owns any cars
    const { data: userCarsData } = useCarList({ userId: loggedInUserId });
    const isOwner = (userCarsData?.rows?.length ?? 0) > 0;
    const isAdmin = user?.role === "admin" || loggedInUser?.role?.toLowerCase().includes('admin');

    // Determine initial active tab based on role
    const [activeTab, setActiveTab] = useState<"history" | "payments">("history");

    const { data, isLoading } = useCarOwnerPayments(filters);

    // Set mounted to true after component mounts (client-side only)
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleFilterChange = (newFilters: CarOwnerPaymentFilters) => {
        setFilters(newFilters);
    };

    const handlePayOwner = async (carOwnerId: number, bookingIds: number[]) => {
        // Implement your payment logic here
        console.log("Processing payment:", { carOwnerId, bookingIds });
    };

    // Avoid hydration mismatch by not rendering role-based content until mounted
    if (!mounted) {
        return (
            <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
                <div className="container mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payments</h1>
                        <p className="text-gray-600">Loading payment information...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
            <div className="max-w-full mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payments</h1>
                    <p className="text-gray-600">
                        {isAdmin
                            ? "Manage all payments, bookings, and deposits"
                            : isOwner
                                ? "View your payment history and car owner payments"
                                : "View your payment history and transactions"}
                    </p>
                </div>

                {/* Info Banner for Car Owners */}
                {!isAdmin && isOwner && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                                    Car Owner Information
                                </h3>
                                <p className="text-sm text-blue-700">
                                    As a car owner, you can view your rental bookings in the History tab and
                                    track payments owed to you in the Owner Payments tab. Payments are processed
                                    within 3-5 business days after rental completion.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Banner for Regular Users */}
                {!isAdmin && !isOwner && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                                    Payment Information
                                </h3>
                                <p className="text-sm text-blue-700">
                                    View all your car rental bookings and payment history here.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Banner for Admins */}
                {isAdmin && activeTab === "payments" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                                    Admin Notice
                                </h3>
                                <p className="text-sm text-yellow-700">
                                    Review all payment details carefully before initiating deposits to
                                    car owners. Ensure bank details or mobile money numbers are
                                    verified to prevent payment errors.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {/* Payment History Tab - Always visible */}
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "history"
                                    ? "border-gray-900 text-gray-900"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                {isAdmin ? "All Booking History" : "My Booking History"}
                            </button>

                            {/* Car Owner Payments Tab - For admins and car owners */}
                            {(isAdmin || isOwner) && (
                                <button
                                    onClick={() => setActiveTab("payments")}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "payments"
                                        ? "border-gray-900 text-gray-900"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    {isAdmin ? "Car Owners Payments" : "My Owner Payments"}
                                </button>
                            )}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === "history" && (
                            <PaymentHistoryContent
                                userId={!isAdmin ? loggedInUserId : undefined}
                                isAdmin={isAdmin}
                            />
                        )}
                        {activeTab === "payments" && (isAdmin || isOwner) && (
                            <CarOwnerPaymentList
                                data={data?.data || []}
                                onFilterChange={handleFilterChange}
                                onPayOwner={handlePayOwner}
                                isLoading={isLoading}
                                totalPages={data?.totalPages || 1}
                                currentPage={filters.skip || 0}
                                isAdmin={isAdmin}
                                currentUserId={loggedInUserId}
                                isOwner={isOwner}
                            />
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
