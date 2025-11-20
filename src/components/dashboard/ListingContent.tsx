"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Trash2, Gauge, Fuel, SlidersHorizontal, Plus, Eye } from "lucide-react";
import { Car } from "@/types/car-listing";
import { useCarList, useUserCarList } from "@/hooks/use-car-list";
import { useSearch } from "@/hooks/use-search";
import { baseUrl } from "@/lib/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteCarListing } from "@/hooks/use-car-listing-mutations";
import { TokenService } from "@/utils/token";
import { Badge } from "../ui/badge";
import { HtmlRenderer } from "../shared/HtmlRenderer";
import { useToast } from "@/app/shared/ToastProvider";

const carsPerPage = 6;
export default function ListingContent() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const toast = useToast();


  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearch({
    searchFn: () => {
      return null;
    },
    debounceDelay: 500,
    minSearchLength: 0,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [fetchParams, setFetchParams] = useState<{ search?: string, limit?: number, skip?: number }>({
    search: '',
    limit: carsPerPage,
    skip: 0,
  });

  useEffect(() => {
    setFetchParams(prev => ({
      ...prev,
      search: debouncedSearchTerm,
      skip: 0
    }));
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const loggedInUser = TokenService.getUserData();
  const loggedInUserId = loggedInUser?.id || 0;
  const loggedInRole = loggedInUser?.role || 'user';

  const isAdmin = loggedInRole.toLowerCase().includes('admin');

  const { data: allCars, isLoading: isLoadingAllCars, isError: isErrorAllCars } = useCarList({
    search: fetchParams.search,
    limit: fetchParams.limit,
    skip: fetchParams.skip,
  });

  const { data: userCars, isLoading: isLoadingUserCars, isError: isErrorUserCars } = useUserCarList(
    loggedInUserId,
    {
      search: fetchParams.search,
      limit: fetchParams.limit,
      skip: fetchParams.skip,
    }
  );

  const cars = isAdmin ? (allCars?.rows || []) : (userCars?.rows || []);
  const totalCount = isAdmin ? (allCars?.total || 0) : (userCars?.total || 0);
  const isLoading = isAdmin ? isLoadingAllCars : isLoadingUserCars;
  const isError = isAdmin ? isErrorAllCars : isErrorUserCars;

  // Mutation Hooks
  const { mutate: deleteCarListing, isPending: deleteCarListingLoading } = useDeleteCarListing();

  const totalPages = Math.ceil(totalCount / carsPerPage);
  const currentCars = cars;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFetchParams({
      ...fetchParams,
      skip: (page - 1) * carsPerPage
    });
  };

  const handleView = (carId: number) => {
    router.push(`/dashboard/listing/${carId}`);
  };

  const handleDelete = (carId: number) => {
    deleteCarListing(carId, {
      onSuccess: () => {
        toast.success("Success", "Car listing deleted successfully!");
      },
      onError: () => {
        toast.error("Failed", "Failed to delete car listing.");
      },
    });
  };

  return (
    <div className="flex-1 p-4 lg:p-8 h-full overflow-auto custom-scrollbar bg-gray-50">
      <div className="container mx-auto">
        {/* Header with Add Listing Button */}
        <div className="flex justify-end items-center mb-6">
          <Button
            onClick={() => router.push("/dashboard/add-listing")}
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            size={"xl"}
          >
            <Plus />
            Add Listing
          </Button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Type make or model to search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <Button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              size={"xl"}
            >
              <Search />
              Search
            </Button>
          </div>
        </form>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentCars.map((car: Car) => {
            // Construct image URL safely
            const carImage = car.carImages?.[0];
            const imageUrl = carImage
              ? (carImage.startsWith('http') ? carImage : `${baseUrl}${carImage}`)
              : "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&crop=center";

            return (
              <div key={car.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Car Image */}
                <div className="relative h-64 border-b border-gray-200">
                  <Image
                    src={imageUrl}
                    alt={`${car.make} ${car.model} ${car.year}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&crop=center";
                    }}
                  />
                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  {/* Car title overlay */}
                  <div className="absolute top-3 left-3 px-2 py-1 z-10">

                    <Badge
                      variant={
                        car.status === "approved"
                          ? "default"
                          : car.status === "rejected"
                            ? "destructive"
                            : car.status === "changeRequested"
                              ? "outline"
                              : "secondary"
                      }
                      className={`text-sm capitalize ${car.status === "approved"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : car.status === "pending"
                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                          : car.status === "changeRequested"
                            ? "border-orange-500 text-orange-700"
                            : ""
                        }`}
                    >
                      {car.status === "changeRequested" ? "Change Requested" : car.status}
                    </Badge>

                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-bold text-lg">
                      {car.make} {car.model} {car.year}
                    </h3>
                  </div>
                </div>

                {/* Car Details */}
                <div className="p-5">
                  {/* Car Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {car.title}
                  </h3>

                  {/* Car Description */}
                  <HtmlRenderer
                    content={car.description || `${car.body} • ${car.engineSize}L • ${car.doors} Doors`}
                    className="text-sm text-gray-600 mb-4 leading-relaxed"
                    maxLength={150}
                  />

                  {/* Divider */}
                  <hr className="border-gray-200 mb-4" />

                  {/* Car Specs */}
                  <div className="flex items-center justify-around mb-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4" />
                      <span>{car.mileage} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4" />
                      <span>{car.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      <span>{car.transition}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handleView(car.id)}
                      size={`lg`}
                      variant="outline"
                      className={`bg-white text-black hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${car.userId === loggedInUserId || isAdmin ? 'flex-grow-[1]' : 'flex-grow-[2]'
                        }`}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>

                    {/* Show Delete button only for car owner or admin */}
                    {(car.userId === loggedInUserId || isAdmin) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="lg"
                            className="flex-grow-[1] bg-white text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-3"
                          >
                            <Trash2 />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete listing?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action permanently removes {car.title}. You can&apos;t undo this.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleteCarListingLoading}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-white hover:bg-destructive/90"
                              disabled={deleteCarListingLoading}
                              onClick={() => handleDelete(car.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Previous page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-full font-medium transition-colors ${currentPage === page
                  ? "bg-black text-white"
                  : "border border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Next page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Loading State */}
        {!isMounted || isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading cars...</p>
          </div>
        ) : isError ? (
          /* Error State */
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Failed to load cars. Please try again.</p>
          </div>
        ) : cars.length === 0 ? (
          /* No Results */
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No cars found matching your search.</p>
          </div>
        ) : null}



      </div>
    </div>
  );
}
