"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { CarListingForm } from "@/components/forms/CarListingForm";
import { useUpdateCarListing } from "@/hooks/use-car-listing-mutations";
import { useCarListing } from "@/hooks/use-car-list";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/app/shared/ToastProvider";
import type { CarListingFormData } from "@/schemas/car-listing.schema";
import type { Car } from "@/types/car-listing";

/**
 * Convert Car API response to CarListingFormData format
 * Handles type conversions and ensures compatibility with form schema
 */
function carToFormData(car: Car): Partial<CarListingFormData> {
    return {
        // Listing Information
        title: car.title,
        make: car.make,
        model: car.model,
        plateNumber: car.plateNumber,
        body: car.body,
        seats: 4, // Default value as Car type doesn't have seats
        year: car.year,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transition: car.transition,
        driverType: car.driverType,
        engineSize: car.engineSize,
        doors: car.doors,
        smallBags: 0, // Default value as Car type doesn't have smallBags
        color: car.color,
        largeBags: 0, // Default value as Car type doesn't have largeBags
        inTerminal: car.inTerminal,
        description: car.description,

        // Features
        isPowerSteering: Boolean(car.isPowerSteering),
        isCruiseControl: Boolean(car.isCruiseControl),
        isNavigation: Boolean(car.isNavigation),
        isPowerLocks: Boolean(car.isPowerLocks),
        isVanityMirror: Boolean(car.isVanityMirror),
        isTrunkLight: Boolean(car.isTrunkLight),
        isAirConditioner: Boolean(car.isAirConditioner),
        Techometer: Boolean(car.Techometer),
        isDigitalOdometer: Boolean(car.isDigitalOdometer),
        isLeatherSeats: Boolean(car.isLeatherSeats),
        isHeater: Boolean(car.isHeater),
        isMemorySeats: Boolean(car.isMemorySeats),
        isFogLightsFront: Boolean(car.isFogLightsFront),
        isRainSensingWipe: Boolean(car.isRainSensingWipe),
        isRearSpoiler: Boolean(car.isRearSpoiler),
        isSunRoof: Boolean(car.isSunRoof),
        isRearWindow: Boolean(car.isRearWindow),
        isWindowDefroster: Boolean(car.isWindowDefroster),
        isBreakeAssist: Boolean(car.isBreakeAssist),
        isChildSafetyLocks: Boolean(car.isChildSafetyLocks),
        isTractionControl: Boolean(car.isTractionControl),
        isPowerDoorLocks: Boolean(car.isPowerDoorLocks),
        isDriverAirBag: Boolean(car.isDriverAirBag),
        isAntiLockBreaks: Boolean(car.isAntiLockBreaks),

        // Pricing
        pricePerDay: car.pricePerDay,
        currency: car.currency as "RWF" | "USD" | "EUR" | "NGN",

        // Important Info
        requiredDocs: car.requiredDocs,
        securityDeposit: car.securityDeposit,
        securityDepositAmount: car.securityDepositAmount,
        damageExcess: car.damageExcess,
        fuelPolicy: car.fuelPolicy,
        availabilityType: car.availabilityType as "FULL" | "WEEKDAYS" | "WEEKENDS" | "CUSTOM",
        insuranceExpirationDate: car.insuranceExpirationDate,
        insuranceFile: car.insuranceFile || null,
        customDays: car.customDays || [],

        // Images - keep as string URLs from server
        carImages: car.carImages || [],
    };
}

export default function EditListingPage() {
    const router = useRouter();
    const params = useParams();
    const carId = Number(params.id);
    const { user } = useAuth();
    const updateMutation = useUpdateCarListing();
    const toast = useToast();

    // Fetch car listing details
    const {
        data: carListing,
        isLoading,
        isError,
    } = useCarListing(carId);
    // Convert car data to form format
    const formInitialData = useMemo(() => {
        if (!carListing) return undefined;
        return carToFormData(carListing);
    }, [carListing]);

    const handleSubmit = async (data: CarListingFormData) => {

        if (!user?.id) {
            toast.error("Authentication Required", "Please log in to edit a listing");
            router.push("/auth/signin");
        }

        try {
            await updateMutation.mutateAsync({
                id: carId,
                data,
            });

            toast.success("Success", "Car listing updated successfully!");
            router.push("/dashboard/listing");
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Failed to update listing. Please try again.";
            toast.error("Error", message);
        }
    };

    const handleCancel = () => {
        router.push("/dashboard/listing");
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Loading car details...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (isError || !carListing) {
        return (
            <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-red-500 text-lg">
                            Failed to load car details. Please try again.
                        </p>
                        <button
                            onClick={() => router.push("/dashboard/listing")}
                            className="mt-4 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Back to Listings
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
                    <p className="text-gray-600 mt-2">
                        Update the details for {carListing.make} {carListing.model}{" "}
                        {carListing.year}
                    </p>
                </div>

                {/* Car Listing Form */}
                <CarListingForm
                    mode="update"
                    initialData={formInitialData}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isSubmitting={updateMutation.isPending}
                />
            </div>
        </div>
    );
}
