
import { Car } from "@/types/car-listing";
import { YEAR_RANGES, FILTER_SECTIONS } from "@/types/landing-constants";

// Types for filter counts
export interface FilterCounts {
  carType: Record<string, number>;
  transmission: Record<string, number>;
  priceRange: Record<string, number>;
  features: Record<string, number>;
  fuelType: Record<string, number>;
  year: Record<string, number>;
}


const PRICE_RANGES = {
  "Under 50,000 RWF": { min: 0, max: 50000 },
  "50,000 - 80,000 RWF": { min: 50000, max: 80000 },
  "Above 80,000 RWF": { min: 80000, max: Infinity },
};


export function calculateFilterCounts(cars: Car[]): FilterCounts {
  const counts: FilterCounts = {
    carType: {},
    transmission: {},
    priceRange: {},
    features: {},
    fuelType: {},
    year: {},
  };

  if (!cars || cars.length === 0) {
    return counts;
  }

  cars.forEach((car) => {
    // Count car types (body types)
    if (car.body) {
      counts.carType[car.body] = (counts.carType[car.body] || 0) + 1;
    }

    // Count transmissions (handling both 'transition' and 'transmission' field names)
    if (car.transition || car.transition) {
      const transmission = car.transition || car.transition;
      counts.transmission[transmission] = 
        (counts.transmission[transmission] || 0) + 1;
    }

    // Count price ranges (using RWF amounts)
    if (car.pricePerDay !== undefined) {
      Object.entries(PRICE_RANGES).forEach(([range, { min, max }]) => {
        if (car.pricePerDay >= min && car.pricePerDay < max) {
          counts.priceRange[range] = (counts.priceRange[range] || 0) + 1;
        }
      });
    }

    // Count fuel types
    if (car.fuelType) {
      counts.fuelType[car.fuelType] = (counts.fuelType[car.fuelType] || 0) + 1;
    }

    // Count year ranges (using dynamic YEAR_RANGES)
    if (car.year !== undefined) {
      YEAR_RANGES.forEach((range) => {
        const { label, yearMin, yearMax } = range;
        const min = yearMin ?? 0;
        const max = yearMax ?? Infinity;
        
        if (car.year >= min && car.year <= max) {
          counts.year[label] = (counts.year[label] || 0) + 1;
        }
      });
    }

    // Count features 
    const featureMapping = {
      'Air Conditioning': 'isAirConditioner',
      'GPS Navigation': 'isNavigation',
      'Bluetooth': 'isBluetooth',
    };

    Object.entries(featureMapping).forEach(([displayName, fieldName]) => {
      if (car[fieldName] === true) {
        counts.features[displayName] = (counts.features[displayName] || 0) + 1;
      }
    });
  });

  return counts;
}


export function updateFilterItemsWithCounts<T extends { label: string; count: number }>(
  items: readonly T[],
  counts: Record<string, number>
): T[] {
  return items.map((item) => ({
    ...item,
    count: counts[item.label] || 0,
  }));
}


export function getUpdatedFilterSections(
  filterSections: typeof FILTER_SECTIONS,
  counts: FilterCounts
) {
  return {
    carType: updateFilterItemsWithCounts(filterSections.carType, counts.carType),
    transmission: updateFilterItemsWithCounts(filterSections.transmission, counts.transmission),
    priceRange: updateFilterItemsWithCounts(filterSections.priceRange, counts.priceRange),
    features: updateFilterItemsWithCounts(filterSections.features, counts.features),
    fuelType: updateFilterItemsWithCounts(filterSections.fuelType, counts.fuelType),
    year: updateFilterItemsWithCounts(filterSections.year, counts.year),
  };
}
