"use client";

import { useRouter } from "next/navigation";
import { CarListingForm } from "@/components/forms/CarListingForm";
import { useCreateCarListing } from "@/hooks/use-car-listing-mutations";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/app/shared/ToastProvider";
import type { CarListingFormData } from "@/schemas/car-listing.schema";

export default function AddListingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const createMutation = useCreateCarListing();
  const toast = useToast();

  const handleSubmit = async (data: CarListingFormData) => {
    console.log(`Submitting car listing: ${JSON.stringify(data)}`);
    if (!user?.id) {
      toast.error("Authentication Required", "Please log in to create a listing");
      router.push("/auth/signin");
      return;
    }

    try {
      await createMutation.mutateAsync({
        userId: user.id,
        data,
      });

      toast.success("Success", "Car listing created successfully!");
      router.push("/dashboard/listing");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to create listing. Please try again.";
      toast.error("Error", message);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/listing");
  };

  return (
    <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to list your car for rent
          </p>
        </div>

        {/* Car Listing Form */}
        <CarListingForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  );
}

