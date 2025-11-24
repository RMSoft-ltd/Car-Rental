"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Calendar, Car, Filter } from "lucide-react";
import { useBookingHistory } from "@/hooks/use-booking-history";
import { formatCurrency, formatDate } from "@/utils/formatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getBookingStatusConfig,
  getPaymentStatusConfig,
  getBookingStatusLabel,
  getPaymentStatusLabel,
} from "@/utils/status-colors";
import { baseUrl } from "@/lib/api";
import { BookingHistoryFilters } from "@/types/payment";
import { UserAvatar } from "../Avator";
import { TokenService } from "@/utils/token";


export default function RentalHistoryContent() {

  const loggedInUser = TokenService.getUserData();
  const loggedInUserId = loggedInUser?.id || 0;
  const loggedInRole = loggedInUser?.role || 'user';

  const isAdmin = loggedInRole.toLowerCase().includes('admin');

  const [filters, setFilters] = useState<BookingHistoryFilters>({
    skip: 0,
    limit: 25,
    userId: isAdmin ? undefined : loggedInUserId,
  });
 
  const [currentPage, setCurrentPage] = useState(1);
  const isPaginationChange = useRef(false);

  // booking history data with filters
  const { data: bookingHistory, isLoading, refetch } = useBookingHistory(filters);

  // Debounce only for search/filter changes, not pagination
  useEffect(() => {
    if (isPaginationChange.current) {
      isPaginationChange.current = false;
      refetch();
      return;
    }

    const timeoutId = setTimeout(() => {
      refetch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, refetch]);



  // Handle filter changes
  const handleFilterChange = (key: keyof BookingHistoryFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
      skip: 0
    }));
    setCurrentPage(1);
  };

  // Handle pagination - no debounce, immediate response
  const handlePageChange = (page: number) => {
    isPaginationChange.current = true;
    const newSkip = (page - 1) * (filters.limit || 25);
    setCurrentPage(page);
    setFilters(prev => ({
      ...prev,
      skip: newSkip
    }));
  };

  // Get current rentals
  const currentRentals = bookingHistory?.rows || [];
  const totalCount = bookingHistory?.count || 0;
  const itemsPerPage = filters.limit || 25;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getStatusVariant = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    if (
      ["CONFIRMED", "COMPLETED", "EXPIRED", "REJECTED"].includes(
        normalizedStatus
      )
    ) {
      return getBookingStatusConfig(status).variant;
    }
    if (["PAID", "UNPAID", "PARTIALLY_PAID"].includes(normalizedStatus)) {
      return getPaymentStatusConfig(status).variant;
    }
    return "default";
  };

  const getStatusClassName = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    if (
      ["CONFIRMED", "COMPLETED", "EXPIRED", "REJECTED", "DEPOSITED"].includes(
        normalizedStatus
      )
    ) {
      return getBookingStatusConfig(status).className;
    }
    if (["PAID", "UNPAID", "PARTIALLY_PAID", "DEPOSITED"].includes(normalizedStatus)) {
      return getPaymentStatusConfig(status).className;
    }
    return "";
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({ skip: 0, limit: 25, userId: isAdmin ? undefined : loggedInUserId });
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading rental history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
      <div className="container mx-auto">
     

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Booking Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Booking Status</label>
              <Select
                value={filters.bookingStatus || ""}
                onValueChange={(value) => handleFilterChange("bookingStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Payment Status</label>
              <Select
                value={filters.paymentStatus || ""}
                onValueChange={(value) => handleFilterChange("paymentStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All payments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                  <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filters */}
            <div>
              <label className="text-sm font-medium mb-2 block">Pickup Date From</label>
              <Input
                type="date"
                value={filters.pickUpDateFrom || ""}
                onChange={(e) => handleFilterChange("pickUpDateFrom", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Pickup Date To</label>
              <Input
                type="date"
                value={filters.pickUpDateTo || ""}
                onChange={(e) => handleFilterChange("pickUpDateTo", e.target.value)}
              />
            </div>
          </div>

          {/* Additional Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Drop-off Date From</label>
              <Input
                type="date"
                value={filters.dropOffDateFrom || ""}
                onChange={(e) => handleFilterChange("dropOffDateFrom", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Drop-off Date To</label>
              <Input
                type="date"
                value={filters.dropOffDateTo || ""}
                onChange={(e) => handleFilterChange("dropOffDateTo", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Items Per Page</label>
              <Select
                value={filters.limit?.toString() || "25"}
                onValueChange={(value) => handleFilterChange("limit", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="25 items" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 items</SelectItem>
                  <SelectItem value="25">25 items</SelectItem>
                  <SelectItem value="50">50 items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        {totalCount > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
          </div>
        )}

        {/* Rental History Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-nowrap">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Car Details
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    User (Booked By)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Car Owner
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Pickup Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Return Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Price/Day
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Booking Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Payment Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentRentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-gray-50">
                    {/* Car Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                          {rental.car?.carImages?.[0] ? (
                            <Image
                              src={(() => {
                                const carImage = rental.car.carImages?.[0];
                                return carImage.startsWith("http")
                                  ? carImage
                                  : `${baseUrl}${carImage}`;
                              })()}
                              alt={`${rental.car.make} ${rental.car.model}`}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <Car className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {rental.car?.make} {rental.car?.model}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {rental.car?.title || "N/A"}
                          </div>
                          <div className="text-xs text-gray-400">
                            Year: {rental.car?.year}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* User (Booked By) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          {rental?.user && (
                            <UserAvatar user={rental?.user} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {rental.user?.fName} {rental.user?.lName}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {rental.user?.email}
                          </div>
                          {rental.user?.phone && (
                            <div className="text-xs text-gray-400">
                              {rental.user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Car Owner */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          {rental.car?.owner && (
                            <UserAvatar user={rental.car?.owner} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {rental.car?.owner?.fName} {rental.car?.owner?.lName}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {rental.car?.owner?.email}
                          </div>
                          {rental.car?.owner?.phone && (
                            <div className="text-xs text-gray-400">
                              {rental.car.owner.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Pickup Date */}
                    <td className="px-6 text-nowrap py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(rental.pickUpDate)}
                      </div>
                    </td>

                    {/* Return Date */}
                    <td className="px-6 text-nowrap py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(rental.dropOffDate)}
                      </div>
                    </td>

                    {/* Price per Day */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(rental.car?.pricePerDay || 0)}
                    </td>

                    {/* Total Amount */}
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(rental.totalAmount)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={getStatusVariant(rental.bookingStatus)}
                          className={`text-xs ${getStatusClassName(
                            rental.bookingStatus
                          )}`}
                        >
                          {getBookingStatusLabel(rental.bookingStatus)}
                        </Badge>
                        
                        {rental.depositStatus && rental.depositStatus !== "PENDING" && (
                          <Badge variant="outline" className="text-xs">
                            Deposit: {rental.depositStatus}
                          </Badge>
                        )}
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                       <Badge
                          variant={getStatusVariant(rental.paymentStatus)}
                          className={`text-xs ${getStatusClassName(
                            rental.paymentStatus
                          )}`}
                        >
                          {getPaymentStatusLabel(rental.paymentStatus)}
                        </Badge>
                        
                        {rental.depositStatus && rental.depositStatus !== "PENDING" && (
                          <Badge variant="outline" className="text-xs">
                            Deposit: {rental.depositStatus}
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                title="Previous Page"
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-full font-medium transition-colors ${currentPage === pageNum
                      ? "bg-black text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                title="Next Page"
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* No Results */}
        {currentRentals.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No rental history found matching your criteria.
            </p>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="mt-4"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}