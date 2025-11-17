"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import HistoryContent from "@/components/dashboard/HistoryContent";
import { Receipt, Wallet } from "lucide-react";
import { useCarOwnerPayments } from "@/hooks/use-car-owner-payments";
import { CarOwnerPaymentFilters } from "@/types/payment";
import { CarOwnerPaymentList } from "@/components/dashboard/CarOwnerPaymentList";
import { useCarList } from "@/hooks/use-car-list";
import { TokenService } from "@/utils/token";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

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
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Spinner />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 min-w-md h-full overflow-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Payments & Bookings</h1>
                    <p className="text-muted-foreground">
                        {isAdmin
                            ? "Manage all payments, bookings, and deposits across the platform"
                            : isOwner
                                ? "View your payment history and track car owner earnings"
                                : "View your rental bookings and payment history"}
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "history" | "payments")}>
                <TabsList className="grid w-full grid-cols-2 gap-8 mb-6">
                    <TabsTrigger value="history" className="flex items-center gap-2 cursor-pointer">
                        <Receipt className="w-4 h-4" />
                        {isAdmin ? "All Booking History" : "My Booking History"}
                    </TabsTrigger>

                    {(isAdmin || isOwner) && (
                        <TabsTrigger value="payments" className="flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            {isAdmin ? "Car Owner Payments" : "My Owner Payments"}
                        </TabsTrigger>
                    )}
                </TabsList>

                {isLoading && activeTab === "payments" ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        {/* Booking History Tab */}
                        <TabsContent value="history" className="space-y-6">
                            <HistoryContent
                                userId={!isAdmin ? loggedInUserId : undefined}
                                isAdmin={isAdmin}
                            />
                        </TabsContent>

                        {(isAdmin || isOwner) && (
                            <TabsContent value="payments" className="space-y-6">
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
                            </TabsContent>
                        )}
                    </>
                )}
            </Tabs>
        </div>
    );
}
