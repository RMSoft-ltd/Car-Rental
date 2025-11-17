"use client";

import { useState } from "react";
import { CarOwnerPaymentList } from "@/components/dashboard/CarOwnerPaymentList";
import { useCarOwnerPayments } from "@/hooks/use-car-owner-payments";
import { CarOwnerPaymentFilters } from "@/types/payment";
import { toast } from "sonner";
import { TokenService } from "@/utils/token";
import { useCarList } from "@/hooks/use-car-list";

export default function CarOwnerPaymentsPage() {
    const [filters, setFilters] = useState<CarOwnerPaymentFilters>({
        skip: 0,
        limit: 10,
        depositStatus: "PENDING",
    });
    const loggedInUser = TokenService.getUserData();
    const loggedInUserId = loggedInUser?.id || 0;
    const loggedInRole = loggedInUser?.role || 'user';

    const isAdmin = loggedInRole.toLowerCase().includes('admin');

    // Check if user owns any cars
    const { data: userCarsData } = useCarList({ userId: loggedInUserId });

    const isOwner = (userCarsData?.rows?.length ?? 0) > 0;

    const { data, isLoading, refetch } = useCarOwnerPayments(filters);

    const handleFilterChange = (newFilters: CarOwnerPaymentFilters) => {
        setFilters(newFilters);
    };

    const handlePayOwner = async (carOwnerId: number, bookingIds: number[]) => {
        try {
            // TODO: Implement payment API call
            console.log("Processing payment for:", { carOwnerId, bookingIds });

            toast.success(
                `Payment initiated for ${bookingIds.length} booking(s). Owner ID: ${carOwnerId}`
            );

            // Refetch data after payment
            await refetch();
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Failed to process payment. Please try again.");
        }
    };

    return (
        <div className="container mx-auto py-6">
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
        </div>
    );
}
