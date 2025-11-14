"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PaymentHistoryContent from "@/components/dashboard/PaymentHistoryContent";
import PaymentManagementContent from "@/components/dashboard/PaymentManagementContent";
import { DollarSign, Shield } from "lucide-react";

export default function PaymentsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<"history" | "management">(
        user?.role === "admin" ? "management" : "history"
    );

    const isAdmin = user?.role === "admin";

    return (
        <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payments</h1>
                    <p className="text-gray-600">
                        {isAdmin
                            ? "Manage all payments, bookings, and deposits"
                            : "View your payment history and pending transactions"}
                    </p>
                </div>

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
                                {isAdmin ? "All History" : "My History"}
                            </button>

                            {/* Payment Management Tab - Admin only */}
                            {isAdmin && (
                                <button
                                    onClick={() => setActiveTab("management")}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "management"
                                        ? "border-gray-900 text-gray-900"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    Management
                                </button>
                            )}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === "history" && <PaymentHistoryContent />}
                        {activeTab === "management" && isAdmin && <PaymentManagementContent />}
                    </div>
                </div>

                {/* Info Banner for Car Owners */}
                {!isAdmin && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                                    Payment Information
                                </h3>
                                <p className="text-sm text-blue-700">
                                    Pending payments are processed within 3-5 business days after the
                                    rental period ends. You&apos;ll receive a notification once the
                                    deposit is initiated.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Banner for Admins */}
                {isAdmin && activeTab === "management" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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
            </div>
        </div>
    );
}
