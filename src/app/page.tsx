"use client";

import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { MapPin, Calendar, Clock, Search, ArrowUpDown } from "lucide-react";
import HorizontalCarCard from "@/components/HorizontalCarCard";
import { CarQueryParams } from "@/types/car-listing";
import { HorizontalCarCardSkeleton } from "@/components/skelton/HorizontalCarCardSkeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCarList } from "@/hooks/use-car-list";
import { SelectInput } from "@/components/SelectInput";
import { LuCar } from "react-icons/lu";
import Button from "@/components/shared/Button";


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
  { value: "pricePerDay-asc", label: "Price: Low to High" },
  { value: "pricePerDay-desc", label: "Price: High to Low" },
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
    { label: "Automatic", count: 0 },
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

const PRICE_RANGE_MAP: Record<
  string,
  { pricePerDayMin?: number; pricePerDayMax?: number }
> = {
  "Under 50,000 RWF": { pricePerDayMax: 50000 },
  "50,000 - 80,000 RWF": { pricePerDayMin: 50000, pricePerDayMax: 80000 },
  "Above 80,000 RWF": { pricePerDayMin: 80000 },
};

const YEAR_RANGE_MAP: Record<string, { yearMin?: number; yearMax?: number }> = {
  "2020 - 2024": { yearMin: 2020, yearMax: 2024 },
  "2018 - 2019": { yearMin: 2018, yearMax: 2019 },
  "Below 2018": { yearMax: 2018 },
};

const FEATURE_MAP: Record<string, string> = {
  "Air Conditioning": "isAirConditioner",
  "GPS Navigation": "isNavigation",
  Bluetooth: "isBluetooth",
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

const FeatureItem = React.memo<{ label: string }>(({ label }) => (
  <div className="flex items-center text-white">
    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
      <span className="text-white text-sm">✓</span>
    </div>
    <span className="text-lg">{label}</span>
  </div>
));
FeatureItem.displayName = "FeatureItem";

const SearchInput = React.memo<{
  label: string;
  value: string;
  icon: React.ReactNode;
}>(({ label, value, icon }) => (
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
        placeholder="..."
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
      />
    </div>
  </div>
));
SearchInput.displayName = "SearchInput";

const FilterCheckbox = React.memo<FilterCheckboxProps>(
  ({ label, count, checked, onChange }) => (
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
  )
);
FilterCheckbox.displayName = "FilterCheckbox";

const FilterSection = React.memo<{
  title: string;
  items: readonly { label: string; count: number; defaultChecked?: boolean }[];
  selectedItems: string[];
  onToggle: (label: string) => void;
  showBorder?: boolean;
}>(({ title, items, selectedItems, onToggle, showBorder = true }) => (
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
));
FilterSection.displayName = "FilterSection";

const EmptyState = React.memo<{ refetch: () => void , reset : () => void }>(({ refetch , reset }) => (
  <div className="text-center py-16 px-4">
    <div className="max-w-md mx-auto">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <LuCar className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No cars available
      </h3>
      <p className="text-gray-600 mb-6">
        We couldn't find any cars matching your current filters. Try adjusting your search criteria or clearing some filters to see more options.
      </p>
      <div className="space-x-3">

        <Button variant="primary" type="reset" onClick={() => { refetch(); }} >
         Refresh search
        </Button>
        <Button variant="secondary"  type="reset" onClick={() => { reset(); }} >
         Reset search
        </Button>

      </div>
    </div>
  </div>
));
EmptyState.displayName = "EmptyState";

// ============================================
// Main Component
// ============================================

export default function Home() {
  // Filter state
  const [selectedCarTypes, setSelectedCarTypes] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(
    []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedYearRange, setSelectedYearRange] = useState<string | null>(
    null
  );

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("recommended");
  const [page, setPage] = useState<number>(1);

  // Refs
  const observerTarget = useRef<HTMLDivElement>(null);

  // query params from filters
  const queryParams: CarQueryParams = useMemo(() => {
    const params: CarQueryParams = {
      page,
      limit: 25,
    };

    if (selectedCategory !== "all") {
      params.size = selectedCategory;
    }

    if (
      selectedSort && selectedSort !== "recommended" ? selectedSort : undefined
    ) {
      switch (selectedSort) {
        case "pricePerDay-asc":
          params.sortBy = "pricePerDay";
          params.order = "ASC";
          break;
        case "pricePerDay-desc":
          params.sortBy = "pricePerDay";
          params.order = "DESC";
          break;
        case "year":
          params.sortBy = "year";
          params.order = "DESC";
          break;
        default:
          params.sortBy = "recommended";
          break;
      }
    }

    if (selectedCarTypes.length > 0) {
      params.body = selectedCarTypes.join(",");
    }

    if (selectedTransmissions.length > 0) {
      params.transition = selectedTransmissions.join(",");
    }

    if (selectedPriceRange && PRICE_RANGE_MAP[selectedPriceRange]) {
      const priceRange = PRICE_RANGE_MAP[selectedPriceRange];
      if (priceRange.pricePerDayMin !== undefined) {
        params.pricePerDayMin = priceRange.pricePerDayMin;
      }
      if (priceRange.pricePerDayMax !== undefined) {
        params.pricePerDayMax = priceRange.pricePerDayMax;
      }
    }

    if (selectedFuelTypes.length > 0) {
      params.fuelType = selectedFuelTypes.join(",");
    }

    if (selectedYearRange && YEAR_RANGE_MAP[selectedYearRange]) {
      const yearRange = YEAR_RANGE_MAP[selectedYearRange];
      if (yearRange.yearMin !== undefined) {
        params.yearMin = yearRange.yearMin;
      }
      if (yearRange.yearMax !== undefined) {
        params.yearMax = yearRange.yearMax;
      }
    }

    selectedFeatures.forEach((feature) => {
      const apiParam = FEATURE_MAP[feature];
      if (apiParam) {
        (params as Record<string, unknown>)[apiParam] = "true";
      }
    });

    return params;
  }, [
    page,
    selectedSort,
    selectedCategory,
    selectedCarTypes,
    selectedTransmissions,
    selectedPriceRange,
    selectedFeatures,
    selectedFuelTypes,
    selectedYearRange,
  ]);

  // Fetch data
  const { data, isLoading, isError, error, refetch } = useCarList(queryParams);

  // Reset to page 1 when any filter changes (except page itself)
  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  // Watch for filter changes and reset page
  useEffect(() => {
    resetPage();
  }, [
    selectedSort,
    selectedCarTypes,
    selectedTransmissions,
    selectedPriceRange,
    selectedFeatures,
    selectedFuelTypes,
    selectedYearRange,
    resetPage,
  ]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          data?.rows &&
          data.rows.length > 0 &&
          data.rows.length < (data.total || 0)
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
  }, [isLoading, data?.rows, data?.total]);

  // Filter toggle handlers
  const toggleArrayFilter = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
      (item: string) => {
        setter((prev) =>
          prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
      },
    []
  );

  const toggleTransmission = useCallback((transmission: string) => {
    setSelectedTransmissions((prev) =>
      prev.includes(transmission) ? [] : [transmission]
    );
  }, []);

  const togglePriceRange = useCallback((range: string) => {
    setSelectedPriceRange((prev) => (prev === range ? null : range));
  }, []);

  const toggleYearRange = useCallback((range: string) => {
    setSelectedYearRange((prev) => (prev === range ? null : range));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedCarTypes([]);
    setSelectedTransmissions([]);
    setSelectedPriceRange(null);
    setSelectedFeatures([]);
    setSelectedFuelTypes([]);
    setSelectedYearRange(null);
    setSelectedCategory("all");
    setPage(1);
    // Trigger refetch after clearing filters
    setTimeout(() => refetch(), 0);
  }, [refetch]);

  // Computed values
  const carCount = data?.total ?? 0;
  const cars = data?.rows ?? [];
  const hasNoCars = !isLoading && carCount === 0;
  const hasCars = cars.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[80vh]">
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
                    Clear All
                  </button>
                </div>

                <FilterSection
                  title="Car Type"
                  items={FILTER_SECTIONS.carType}
                  selectedItems={selectedCarTypes}
                  onToggle={toggleArrayFilter(setSelectedCarTypes)}
                />
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">
                    Transmission
                  </h4>
                  <div className="space-y-1">
                    {FILTER_SECTIONS.transmission.map((item) => (
                      <FilterCheckbox
                        key={item.label}
                        label={item.label}
                        count={item.count}
                        checked={selectedTransmissions.includes(item.label)}
                        onChange={() => toggleTransmission(item.label)}
                      />
                    ))}
                  </div>
                </div>
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
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isLoading ? "Loading..." : `${carCount} Cars Available`}
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
                {hasNoCars && (
                  <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6">
                    <EmptyState refetch={refetch} reset={clearAllFilters} />
                  </div>
                )}

                {/* Cars List */}
                {hasCars &&
                  cars.map((car, index) => (
                    <HorizontalCarCard
                      key={`${car.id}-${page}`}
                      car={car}
                      isTopPick={index < 2 && page === 1}
                    />
                  ))}

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
