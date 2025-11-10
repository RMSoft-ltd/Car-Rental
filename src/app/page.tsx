"use client";

import React, { useState, useMemo } from "react";
import { MapPin, Calendar, Clock, Search, ArrowUpDown } from "lucide-react";
import HorizontalCarCard from "@/components/HorizontalCarCard";
import { CarQueryParams } from "@/types/car-listing";
import { HorizontalCarCardSkeleton } from "@/components/skelton/HorizontalCarCardSkeleton";
import EmptyState from "@/components/EmptySatate";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCarList } from "@/hooks/use-car-list";

// ============================================
// Constants
// ============================================

const HERO_FEATURES = [
  { label: "Free Cancellation" },
  { label: "10,000 + Car Rentals" },
  { label: "Customer support 24/7" },
] as const;

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
] as const;

const CAR_CATEGORIES = [
  { value: "all", label: "All Cars" },
  { value: "small", label: "Small Cars" },
  { value: "medium", label: "Medium Cars" },
  { value: "large", label: "Large Cars" },
  { value: "suv", label: "SUVs Cars" },
] as const;

const FILTER_SECTIONS = {
  carType: [
    { label: "Sedan", count: 3 },
    { label: "SUV", count: 4 },
    { label: "Hatchback", count: 2 },
  ],
  transmission: [
    { label: "Automatic", count: 6, defaultChecked: true },
    { label: "Manual", count: 3 },
  ],
  priceRange: [
    { label: "Under 50,000 RWF", count: 3 },
    { label: "50,000 - 80,000 RWF", count: 4 },
    { label: "Above 80,000 RWF", count: 2 },
  ],
  features: [
    { label: "Air Conditioning", count: 9 },
    { label: "GPS Navigation", count: 7 },
    { label: "Bluetooth", count: 8 },
  ],
  fuelType: [
    { label: "Petrol", count: 7 },
    { label: "Diesel", count: 2 },
    { label: "Electric", count: 0 },
  ],
  year: [
    { label: "2020 - 2024", count: 5 },
    { label: "2018 - 2019", count: 3 },
    { label: "Below 2018", count: 1 },
  ],
} as const;

const DEFAULT_SEARCH_VALUES = {
  location: "Kigali, Kigali, Rwanda",
  pickupDate: "Sun 9 Mar",
  pickupTime: "10:30",
  dropoffDate: "Mon 16 Mar",
  dropoffTime: "21:00",
} as const;

// ============================================
// Types
// ============================================

interface FilterCheckboxProps {
  label: string;
  count: number;
  defaultChecked?: boolean;
}

// ============================================
// Subcomponents
// ============================================

const FeatureItem: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center text-white">
    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
      <span className="text-white text-sm">✓</span>
    </div>
    <span className="text-lg">{label}</span>
  </div>
);

const SearchInput: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="md:col-span-1">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      {icon}
      <input
        type="text"
        value={value}
        readOnly
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
      />
    </div>
  </div>
);

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  label,
  count,
  defaultChecked = false,
}) => (
  <label className="flex items-center justify-between">
    <div className="flex items-center">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
      />
      <span className="ml-2 text-sm text-gray-600">{label}</span>
    </div>
    <span className="text-sm text-gray-500">({count})</span>
  </label>
);

const FilterSection: React.FC<{
  title: string;
  items: readonly FilterCheckboxProps[];
  showBorder?: boolean;
}> = ({ title, items, showBorder = true }) => (
  <div className={`mb-4 ${showBorder ? "pb-4 border-b border-gray-200" : ""}`}>
    <h4 className="text-sm font-bold text-gray-900 mb-2">{title}</h4>
    <div className="space-y-1">
      {items.map((item) => (
        <FilterCheckbox key={item.label} {...item} />
      ))}
    </div>
  </div>
);

// ============================================
// Main Component
// ============================================

export default function Home() {
  // State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("recommended");

  // Query params
  const queryParams: CarQueryParams = useMemo(
    () => ({
      page: 1,
      limit: 25,
      // Add sorting logic here when backend supports it
      // sortBy: selectedSort !== "recommended" ? selectedSort : undefined,
    }),
    [selectedSort]
  );

  // Fetch data
  const { data, isLoading, isError, error } = useCarList(queryParams);

  // Computed values
  const carCount = data?.total ?? 0;
  const cars = data?.rows ?? [];
  const hasNoCars = !isLoading && carCount === 0;
  const hasCars = !isLoading && carCount > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[80vh]">
        {/* Background Images */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Car & Driver Rental - Search, Compare & Save
              </h1>

              <div className="space-y-3 mb-12">
                {HERO_FEATURES.map((feature) => (
                  <FeatureItem key={feature.label} label={feature.label} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="absolute bottom-4 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                <SearchInput
                  label="Pick-up Location"
                  value={DEFAULT_SEARCH_VALUES.location}
                  icon={
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  }
                />
                <SearchInput
                  label="Pick-up Date"
                  value={DEFAULT_SEARCH_VALUES.pickupDate}
                  icon={
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  }
                />
                <SearchInput
                  label="Time"
                  value={DEFAULT_SEARCH_VALUES.pickupTime}
                  icon={
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  }
                />
                <SearchInput
                  label="Drop-off Date"
                  value={DEFAULT_SEARCH_VALUES.dropoffDate}
                  icon={
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  }
                />
                <SearchInput
                  label="Time"
                  value={DEFAULT_SEARCH_VALUES.dropoffTime}
                  icon={
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  }
                />

                <div className="md:col-span-1">
                  <button
                    className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    aria-label="Search for cars"
                  >
                    <Search className="w-5 h-5" />
                    Search Car
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Below Hero */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 sticky top-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filter</h3>
                  <button
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    aria-label="Clear all filters"
                  >
                    Clear All Filters
                  </button>
                </div>

                <FilterSection
                  title="Car Type"
                  items={FILTER_SECTIONS.carType}
                />
                <FilterSection
                  title="Transmission"
                  items={FILTER_SECTIONS.transmission}
                />
                <FilterSection
                  title="Price Range"
                  items={FILTER_SECTIONS.priceRange}
                />
                <FilterSection
                  title="Features"
                  items={FILTER_SECTIONS.features}
                />
                <FilterSection
                  title="Fuel Type"
                  items={FILTER_SECTIONS.fuelType}
                />
                <FilterSection
                  title="Year"
                  items={FILTER_SECTIONS.year}
                  showBorder={false}
                />
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              {/* Header and Filter Card */}
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 mb-6">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isLoading ? "Loading..." : `${carCount} Cars Available`}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Sort By:</span>
                    </div>

                    <select
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value)}
                      className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                      aria-label="Sort cars by"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Car Category Filter Tabs */}
                <Tabs
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  className="flex cursor-pointer flex-wrap gap-2"
                >
                  <TabsList>
                    {CAR_CATEGORIES.map((category) => (
                      <TabsTrigger key={category.value} value={category.value}>
                        {category.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* Error State */}
              {isError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-800 font-medium">
                    Failed to load cars
                  </p>
                  <p className="text-red-600 text-sm mt-2">
                    {error?.message || "Please try again later"}
                  </p>
                </div>
              )}

              {/* Car Listings */}
              <div className="space-y-6">
                {/* Loading State */}
                {isLoading &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <HorizontalCarCardSkeleton key={i} />
                  ))}

                {/* Empty State */}
                {hasNoCars && <EmptyState />}

                {/* Cars List */}
                {hasCars &&
                  cars.map((car, index) => (
                    <HorizontalCarCard
                      key={car.id}
                      car={car}
                      isTopPick={index < 2}
                    />
                  ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}