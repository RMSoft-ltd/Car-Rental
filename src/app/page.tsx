"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { MapPin, Calendar, Clock, Search, ArrowUpDown } from "lucide-react";
import HorizontalCarCard from "@/components/HorizontalCarCard";
import { CarQueryParams } from "@/types/car-listing";
import { HorizontalCarCardSkeleton } from "@/components/skelton/HorizontalCarCardSkeleton";
import EmptyState from "@/components/EmptySatate";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCarList } from "@/hooks/use-car-list";
import { SelectInput } from "@/components/SelectInput";

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
  { value: "year", label: "Newest First" },
] as const;

const CAR_CATEGORIES = [
  { value: "all", label: "All Cars" },
  { value: "small", label: "Small Cars" },
  { value: "medium", label: "Medium Cars" },
  { value: "large", label: "Large Cars" },
] as const;

const FILTER_SECTIONS = {
  carType: [
    { label: "Hatchback", count: 0 },
    { label: "SUV", count: 0 },
    { label: "Convertible", count: 0 },
    { label: "Sedan", count: 0 },
    { label: "Coupe", count: 0 },
    { label: "Minivan", count: 0 },
    { label: "Sports Car", count: 0 },
    { label: "Wagon", count: 0 },
    { label: "Crossover", count: 0 },
    { label: "Luxury", count: 0 },
    { label: "Pickup Truck", count: 0 },
    { label: "Hybrid Vehicle", count: 0 },
    { label: "Large Car", count: 0 },
    { label: "Electric Vehicle", count: 0 },
    { label: "Grand Tourer", count: 0 },
    { label: "Limousine", count: 0 },
    { label: "Minivan (MPV)", count: 0 },
    { label: "Roadster", count: 0 },
    { label: "Off-Road", count: 0 },
    { label: "Microcar", count: 0 },
  ],
  transmission: [
    { label: "Automatic", count: 0, defaultChecked: true },
    { label: "Manual", count: 0 },
  ],
  priceRange: [
    { label: "Under 50,000 RWF", count: 0 },
    { label: "50,000 - 80,000 RWF", count: 0 },
    { label: "Above 80,000 RWF", count: 0 },
  ],
  features: [
    { label: "Air Conditioning", count: 0 },
    { label: "GPS Navigation", count: 0 },
    { label: "Bluetooth", count: 0 },
  ],
  fuelType: [
    { label: "Petrol", count: 0 },
    { label: "Diesel", count: 0 },
    { label: "Electric", count: 0 },
  ],
  year: [
    { label: "2020 - 2024", count: 0 },
    { label: "2018 - 2019", count: 0 },
    { label: "Below 2018", count: 0 },
  ],
} as const;

const DEFAULT_SEARCH_VALUES = {
  location: "Kigali, Kigali, Rwanda",
  pickupDate: "Sun 9 Mar",
  pickupTime: "10:30",
  dropoffDate: "Mon 16 Mar",
  dropoffTime: "21:00",
} as const;

// Price range mapping
const PRICE_RANGE_MAP: Record<string, { pricePerDayMin?: number; pricePerDayMax?: number }> = {
  "Under 50,000 RWF": { pricePerDayMax: 50000 },
  "50,000 - 80,000 RWF": { pricePerDayMin: 50000, pricePerDayMax: 80000 },
  "Above 80,000 RWF": { pricePerDayMin: 80000 },
};

// Year range mapping
const YEAR_RANGE_MAP: Record<string, { yearMin?: number; yearMax?: number }> = {
  "2020 - 2024": { yearMin: 2020, yearMax: 2024 },
  "2018 - 2019": { yearMin: 2018, yearMax: 2019 },
  "Below 2018": { yearMax: 2018 },
};

// Feature mapping to API params
const FEATURE_MAP: Record<string, string> = {
  "Air Conditioning": "isAirConditioner",
  "GPS Navigation": "isNavigation",
  "Bluetooth": "isNavigation", // Adjust based on your API
};

// ============================================
// Types
// ============================================

interface FilterCheckboxProps {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
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
  checked,
  onChange,
}) => (
  <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black cursor-pointer"
      />
      <span className="ml-2 text-sm text-gray-600">{label}</span>
    </div>
    <span className="text-sm text-gray-500">({count})</span>
  </label>
);

const FilterSection: React.FC<{
  title: string;
  items: readonly { label: string; count: number; defaultChecked?: boolean }[];
  selectedItems: string[];
  onToggle: (label: string) => void;
  showBorder?: boolean;
}> = ({ title, items, selectedItems, onToggle, showBorder = true }) => (
  <div className={`mb-4 ${showBorder ? "pb-4 border-b border-gray-200" : ""}`}>
    <h4 className="text-sm font-bold text-gray-900 mb-2">{title}</h4>
    <div className="space-y-1">
      {items.map((item) => (
        <FilterCheckbox
          key={item.label}
          label={item.label}
          count={item.count}
          checked={selectedItems.includes(item.label)}
          onChange={() => onToggle(item.label)}
        />
      ))}
    </div>
  </div>
);

// ============================================
// Main Component
// ============================================

export default function Home() {
  // Filter state
  const [selectedCarTypes, setSelectedCarTypes] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(["Automatic"]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedYearRange, setSelectedYearRange] = useState<string | null>(null);

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("recommended");
  const [page, setPage] = useState<number>(1);
  const [allCars, setAllCars] = useState<any[]>([]);

  // Refs
  const observerTarget = useRef<HTMLDivElement>(null);

  // Build query params from filters
  const queryParams: CarQueryParams = useMemo(() => {
    const params: CarQueryParams = {
      page,
      limit: 25,
      sortBy: selectedSort !== "recommended" ? selectedSort : undefined,
    };

    // Car types -> body parameter
    if (selectedCarTypes.length > 0) {
      params.body = selectedCarTypes.join(",");
    }

    // Transmission -> transition parameter
    if (selectedTransmissions.length > 0) {
      params.transition = selectedTransmissions.join(",");
    }

    // Price range
    if (selectedPriceRange && PRICE_RANGE_MAP[selectedPriceRange]) {
      const priceRange = PRICE_RANGE_MAP[selectedPriceRange];
      if (priceRange.pricePerDayMin !== undefined) {
        params.pricePerDayMin = priceRange.pricePerDayMin;
      }
      if (priceRange.pricePerDayMax !== undefined) {
        params.pricePerDayMax = priceRange.pricePerDayMax;
      }
    }

    // Fuel type
    if (selectedFuelTypes.length > 0) {
      params.fuelType = selectedFuelTypes.join(",");
    }

    // Year range
    if (selectedYearRange && YEAR_RANGE_MAP[selectedYearRange]) {
      const yearRange = YEAR_RANGE_MAP[selectedYearRange];
      if (yearRange.yearMin !== undefined) {
        params.yearMin = yearRange.yearMin;
      }
      if (yearRange.yearMax !== undefined) {
        params.yearMax = yearRange.yearMax;
      }
    }

    // Features -> boolean flags
    selectedFeatures.forEach((feature) => {
      const apiParam = FEATURE_MAP[feature];
      if (apiParam) {
        (params as any)[apiParam] = "true";
      }
    });

    return params;
  }, [
    page,
    selectedSort,
    selectedCarTypes,
    selectedTransmissions,
    selectedPriceRange,
    selectedFeatures,
    selectedFuelTypes,
    selectedYearRange,
  ]);

  // Fetch data
  const { data, isLoading, isError, error } = useCarList(queryParams);

  console.log("Fetched cars data:", data);

  // Accumulate cars for infinite scroll
  useEffect(() => {
    if (data?.rows && !isLoading) {
      if (page === 1) {
        setAllCars(data.rows);
      } else {
        setAllCars((prev) => [...prev, ...data.rows]);
      }
    }
  }, [data, isLoading, page]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
    setAllCars([]);
  }, [
    selectedSort,
    selectedCarTypes,
    selectedTransmissions,
    selectedPriceRange,
    selectedFeatures,
    selectedFuelTypes,
    selectedYearRange,
  ]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          allCars.length > 0 &&
          allCars.length < (data?.total || 0)
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [isLoading, allCars.length, data?.total]);

  // Filter toggle handlers
  const toggleArrayFilter = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string[]>>) => (item: string) => {
      setter((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    },
    []
  );

  const togglePriceRange = useCallback((range: string) => {
    setSelectedPriceRange((prev) => (prev === range ? null : range));
  }, []);

  const toggleYearRange = useCallback((range: string) => {
    setSelectedYearRange((prev) => (prev === range ? null : range));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedCarTypes([]);
    setSelectedTransmissions(["Automatic"]);
    setSelectedPriceRange(null);
    setSelectedFeatures([]);
    setSelectedFuelTypes([]);
    setSelectedYearRange(null);
  }, []);

  // Computed values
  const carCount = data?.total ?? 0;
  const hasNoCars = !isLoading && carCount === 0 && page === 1;
  const hasCars = carCount > 0;

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
                    onClick={clearAllFilters}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    aria-label="Clear all filters"
                  >
                    Clear All Filters
                  </button>
                </div>

                <FilterSection
                  title="Car Type"
                  items={FILTER_SECTIONS.carType}
                  selectedItems={selectedCarTypes}
                  onToggle={toggleArrayFilter(setSelectedCarTypes)}
                />
                <FilterSection
                  title="Transmission"
                  items={FILTER_SECTIONS.transmission}
                  selectedItems={selectedTransmissions}
                  onToggle={toggleArrayFilter(setSelectedTransmissions)}
                />
                <FilterSection
                  title="Price Range"
                  items={FILTER_SECTIONS.priceRange}
                  selectedItems={selectedPriceRange ? [selectedPriceRange] : []}
                  onToggle={togglePriceRange}
                />
                <FilterSection
                  title="Features"
                  items={FILTER_SECTIONS.features}
                  selectedItems={selectedFeatures}
                  onToggle={toggleArrayFilter(setSelectedFeatures)}
                />
                <FilterSection
                  title="Fuel Type"
                  items={FILTER_SECTIONS.fuelType}
                  selectedItems={selectedFuelTypes}
                  onToggle={toggleArrayFilter(setSelectedFuelTypes)}
                />
                <FilterSection
                  title="Year"
                  items={FILTER_SECTIONS.year}
                  selectedItems={selectedYearRange ? [selectedYearRange] : []}
                  onToggle={toggleYearRange}
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
                    {isLoading && page === 1
                      ? "Loading..."
                      : `${carCount} Cars Available`}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Sort By:</span>
                    </div>

                    <SelectInput
                      options={[...SORT_OPTIONS]}
                      value={selectedSort}
                      onValueChange={(value: string) => setSelectedSort(value)}
                    />
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
                  page === 1 &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <HorizontalCarCardSkeleton key={i} />
                  ))}

                {/* Empty State */}
                {/* {hasNoCars && <EmptyState />} */}

                {
                  hasNoCars && <div> No Data Available </div>
                }

                {/* Cars List */}
                {hasCars &&
                  allCars.map((car, index) => (
                    <HorizontalCarCard
                      key={car.id}
                      car={car}
                      isTopPick={index < 2}
                    />
                  ))}

                {/* Loading more indicator */}
                {isLoading && page > 1 && <HorizontalCarCardSkeleton />}

                {/* Infinite scroll trigger */}
                <div ref={observerTarget} className="h-4" />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}