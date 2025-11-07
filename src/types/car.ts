export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  seats: number;
  pricePerDay: number;
  image: string;
  available: boolean;
  features: string[];
  location: string;
  mileage: number;
  rating: number;
  fuelType: string;
  transmission: string;
  
}

export interface RentalBooking {
  id: string;
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}
