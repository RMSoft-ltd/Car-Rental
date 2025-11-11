// ============================================
// Constants
// ============================================

export const HERO_FEATURES = [
  { label: "Free Cancellation" },
  { label: "10,000 + Car Rentals" },
  { label: "Customer support 24/7" },
] as const;

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "pricePerDay-asc", label: "Price: Low to High" },
  { value: "pricePerDay-desc", label: "Price: High to Low" },
  { value: "year", label: "Newest First" },
] as const;

export const CAR_CATEGORIES = [
  { value: "all", label: "All Cars" },
  { value: "small", label: "Small Cars" },
  { value: "medium", label: "Medium Cars" },
  { value: "large", label: "Large Cars" },
] as const;

// ============================================
// Dynamic Year Range Function
// ============================================

export const getYearRanges = () => {
  const currentYear = new Date().getFullYear();
  
  // Calculate ranges
  const recentRange = {
    label: `${currentYear - 5} - ${currentYear}`,
    yearMin: currentYear - 5,
    yearMax: currentYear
  };
  
  const previousRange = {
    label: `${currentYear - 10} - ${currentYear - 6}`,
    yearMin: currentYear - 10,
    yearMax: currentYear - 6
  };
  
  const olderRange = {
    label: `Below ${currentYear - 10}`,
    yearMin: undefined,
    yearMax: currentYear - 10
  };
  
  return [recentRange, previousRange, olderRange];
};

// Generate dynamic year ranges
export const YEAR_RANGES = getYearRanges();

export const FILTER_SECTIONS = {
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
  year: YEAR_RANGES.map(range => ({ 
    label: range.label, 
    count: 0 
  })),
} as const;

export const DEFAULT_SEARCH_VALUES = {
  location: "Kigali, Kigali, Rwanda",
  pickupDate: "Sun 9 Mar",
  pickupTime: "10:30",
  dropoffDate: "Mon 16 Mar",
  dropoffTime: "21:00",
} as const;

export const PRICE_RANGE_MAP: Record<
  string,
  { pricePerDayMin?: number; pricePerDayMax?: number }
> = {
  "Under 50,000 RWF": { pricePerDayMax: 50000 },
  "50,000 - 80,000 RWF": { pricePerDayMin: 50000, pricePerDayMax: 80000 },
  "Above 80,000 RWF": { pricePerDayMin: 80000 },
};

// Dynamic YEAR_RANGE_MAP based on generated ranges
export const YEAR_RANGE_MAP: Record<string, { yearMin?: number; yearMax?: number }> =
  YEAR_RANGES.reduce((acc, range) => {
    acc[range.label] = {
      ...(range.yearMin !== undefined ? { yearMin: range.yearMin } : {}),
      ...(range.yearMax !== undefined ? { yearMax: range.yearMax } : {}),
    };
    return acc;
  }, {} as Record<string, { yearMin?: number; yearMax?: number }>);

export const FEATURE_MAP: Record<string, string> = {
  "Air Conditioning": "isAirConditioner",
  "GPS Navigation": "isNavigation",
  Bluetooth: "isBluetooth",
};

// ============================================
// Types
// ============================================

export interface FilterCheckboxProps {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}