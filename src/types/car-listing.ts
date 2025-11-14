export interface CarResponse {
  total: number;
  limit: number;
  skip: number;
  rows: Car[];
}

export interface Car {
  id: number;
  title: string;
  make: string;
  model: string;
  body: string;
  mileage: number;
  fuelType: string;
  year: number;
  plateNumber: string;
  transition: string;
  driverType: string;
  engineSize: number;
  doors: number;
  category: string | null;
  color: string;
  inTerminal: string;
  description: string;
  isPowerSteering: boolean;
  isNavigation: boolean;
  isVanityMirror: boolean;
  isCruiseControl: boolean;
  isPowerLocks: boolean;
  isTrunkLight: boolean;
  isBreakeAssist: boolean;
  isTractionControl: boolean;
  isDriverAirBag: boolean;
  isChildSafetyLocks: boolean;
  isPowerDoorLocks: boolean;
  isAntiLockBreaks: boolean;
  isAirConditioner: boolean;
  isDigitalOdometer: boolean;
  isHeater: boolean;
  Techometer: boolean;
  isLeatherSeats: boolean;
  isMemorySeats: boolean;
  isFogLightsFront: boolean;
  isRearSpoiler: boolean;
  isRearWindow: boolean;
  isRainSensingWipe: boolean;
  isSunRoof: boolean;
  isWindowDefroster: boolean;
  pricePerDay: number;
  currency: string;
  requiredDocs: string;
  securityDeposit: string;
  securityDepositAmount: number;
  damageExcess: string;
  fuelPolicy: string;
  carImages: string[];
  status: string;
  comments: string | null;
  userId: number;
  insuranceExpirationDate: string;
  insuranceFile: string;
  changeStatusDescription: string;
  availabilityType: string;
  startDate: string;
  endDate: string;
  isAvailable: boolean | null;
  customDays: string[];
  pickUpLocation: string | null;
  createdAt: string;
  updatedAt: string;
  owner: CarOwner;
  reviews: CarReview[];
}

export interface CarOwner {
  id: number;
  fName: string;
  lName: string;
  phone: string | null;
  email: string;
  picture: string | null;
}

export interface CarReview {
  id?: number;
  rating?: number;
  comment?: string;
  userId?: number;
  carId?: number;
  createdAt?: string;
}

/** ================================
 *  QUERY PARAMETERS STRUCTURE
 *  ================================ */

export interface CarQueryParams {
  page?: number;
  limit?: number;
  skip?: number;
  title?: string;
  make?: string;
  model?: string;
  body?: string;
  size?: string;

  mileageMin?: number;
  mileageMax?: number;
  limitedMileage?: string;
  unLimitedMileage?: string;

  fuelType?: string;

  yearMin?: number;
  yearMax?: number;

  transition?: string;
  driverType?: string;

  engineSizeMin?: number;
  engineSizeMax?: number;

  doors?: number;
  color?: string;
  category?: string;
  inTerminal?: string;

  pricePerDayMin?: number;
  pricePerDayMax?: number;

  securityDepositAmountMin?: number;
  securityDepositAmountMax?: number;

  currency?: string;

  isPowerSteering?: string;
  isNavigation?: string;
  isVanityMirror?: string;
  isCruiseControl?: string;
  isPowerLocks?: string;
  isTrunkLight?: string;
  isBreakeAssist?: string;
  isTractionControl?: string;
  isDriverAirBag?: string;
  isChildSafetyLocks?: string;
  isPowerDoorLocks?: string;
  isAntiLockBreaks?: string;
  isAirConditioner?: string;
  isDigitalOdometer?: string;
  isHeater?: string;
  Techometer?: string;
  isLeatherSeats?: string;
  isMemorySeats?: string;
  isFogLightsFront?: string;
  isRearSpoiler?: string;
  isRearWindow?: string;
  isRainSensingWipe?: string;
  isSunRoof?: string;
  isWindowDefroster?: string;
  isBluetooth?: string;

  status?: string;
  userId?: number;

  insuranceExpirationDateFrom?: string;
  insuranceExpirationDateTo?: string;

  search?: string;
  pickUpLocation?: string;
  sortBy?: string;
  order?: string;
}