"use client";

import { Filter as FilterIcon, X, User, Car, ChevronDown } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { BookingStatus, PaymentStatus, BookingDetail } from "@/types/payment";

interface BookingFilters {
  plateNumber?: string;
  carId?: string;
  ownerId?: string;
  bookingStatus?: BookingStatus | "";
  paymentStatus?: PaymentStatus | "";
  search?: string;
}

interface BookingFiltersProps {
  filters: BookingFilters;
  onFiltersChange: (filters: BookingFilters) => void;
  isAdmin: boolean;
  bookings: BookingDetail[];
  isLoading: boolean;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; subtitle?: string }[];
  placeholder: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

function CustomSelect({ value, onChange, options, placeholder, disabled, icon }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-2.5 text-left bg-white border rounded-lg transition-all flex items-center justify-between ${
          disabled 
            ? "bg-gray-50 cursor-not-allowed opacity-60" 
            : "cursor-pointer hover:border-gray-400"
        } ${
          isOpen 
            ? "border-gray-500 ring-2 ring-gray-200" 
            : "border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {icon && <span className="text-gray-500 flex-shrink-0">{icon}</span>}
          <span className={`truncate ${!selectedOption ? "text-gray-500" : "text-gray-900"}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                option.value === value ? "bg-gray-100" : ""
              } ${
                !option.value ? "border-b border-gray-200 font-medium" : ""
              }`}
            >
              <div className="flex flex-col">
                <span className={`text-sm ${option.value === value ? "font-medium text-gray-900" : "text-gray-700"}`}>
                  {option.label}
                </span>
                {option.subtitle && (
                  <span className="text-xs text-gray-500 mt-0.5">{option.subtitle}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookingFilters({ 
  filters, 
  onFiltersChange, 
  isAdmin, 
  bookings,
  isLoading 
}: BookingFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const { cars, owners } = useMemo(() => {
    const carMap = new Map();
    const ownerMap = new Map();

    bookings.forEach(booking => {
      if (booking.car && !carMap.has(booking.car.id)) {
        carMap.set(booking.car.id, booking.car);
      }
      const carOwner = booking.car?.owner;
      if (carOwner && !ownerMap.has(carOwner.id)) {
        ownerMap.set(carOwner.id, carOwner);
      }
    });

    return {
      cars: Array.from(carMap.values()),
      owners: Array.from(ownerMap.values())
    };
  }, [bookings]);

  const handleFilterChange = (key: keyof BookingFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setShowFilters(false);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== "");

  // Prepare options for custom selects
  const carOptions = [
    { value: "", label: "All Vehicles" },
    ...cars.map(car => ({
      value: car.id.toString(),
      label: `${car.make} ${car.model} • ${car.plateNumber}`,
      subtitle: car.title
    }))
  ];

  const ownerOptions = [
    { value: "", label: "All Owners" },
    ...owners.map(owner => ({
      value: owner.id.toString(),
      label: `${owner.fName} ${owner.lName}`,
      subtitle: owner.email
    }))
  ];

  const bookingStatusOptions = [
    { value: "", label: "All Statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "PROCESSING", label: "Processing" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" }
  ];

  const paymentStatusOptions = [
    { value: "", label: "All Payments" },
    { value: "UNPAID", label: "Unpaid" },
    { value: "PARTIALLY_PAID", label: "Partially Paid" },
    { value: "PAID", label: "Paid" },
    { value: "REFUNDED", label: "Refunded" },
    { value: "PROCESSING", label: "Processing" }
  ];

  return (
    <div>
      {/* Search and Filter Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

        {/* Filter Toggle Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${
              showFilters || hasActiveFilters
                ? "bg-gray-50 border-gray-200 text-gray-700"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FilterIcon className="w-4 h-4" />
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Car Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Car className="w-4 h-4" />
                Vehicle
              </label>
              <CustomSelect
                value={filters.carId || ""}
                onChange={(value) => handleFilterChange("carId", value)}
                options={carOptions}
                placeholder="All Vehicles"
                disabled={isLoading}
                icon={<Car className="w-4 h-4" />}
              />
            </div>

            {/* Owner Selection - Admin Only */}
            {isAdmin && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Car Owner
                </label>
                <CustomSelect
                  value={filters.ownerId || ""}
                  onChange={(value) => handleFilterChange("ownerId", value)}
                  options={ownerOptions}
                  placeholder="All Owners"
                  disabled={isLoading}
                  icon={<User className="w-4 h-4" />}
                />
              </div>
            )}

            {/* Plate Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Plate
              </label>
              <input
                type="text"
                placeholder="e.g., RAA123A"
                value={filters.plateNumber || ""}
                onChange={(e) => handleFilterChange("plateNumber", e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-500 transition-all uppercase font-mono hover:border-gray-400"
              />
            </div>

            {/* Booking Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Status
              </label>
              <CustomSelect
                value={filters.bookingStatus || ""}
                onChange={(value) => handleFilterChange("bookingStatus", value)}
                options={bookingStatusOptions}
                placeholder="All Statuses"
              />
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <CustomSelect
                value={filters.paymentStatus || ""}
                onChange={(value) => handleFilterChange("paymentStatus", value)}
                options={paymentStatusOptions}
                placeholder="All Payments"
              />
            </div>
          </div>

          {/* Active Filters Badges */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  
                  const filterLabels: Record<string, string> = {
                    plateNumber: "License Plate",
                    carId: "Vehicle", 
                    ownerId: "Car Owner",
                    bookingStatus: "Booking Status",
                    paymentStatus: "Payment Status",
                    search: "Search"
                  };

                  // Get display value for specific filters
                  let displayValue = value;
                  if (key === 'carId') {
                    const car = cars.find(c => c.id === parseInt(value));
                    displayValue = car ? `${car.make} ${car.model} • ${car.plateNumber}` : value;
                  } else if (key === 'ownerId') {
                    const owner = owners.find(o => o.id === parseInt(value));
                    displayValue = owner ? `${owner.fName} ${owner.lName}` : value;
                  }

                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full border border-gray-200"
                    >
                      <span className="font-medium">{filterLabels[key]}:</span>
                      <span className="max-w-32 truncate">{displayValue}</span>
                      <button
                        onClick={() => handleFilterChange(key as keyof BookingFilters, "")}
                        className="hover:bg-gray-200 rounded-full p-0.5 cursor-pointer flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}