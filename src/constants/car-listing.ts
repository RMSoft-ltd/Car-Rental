export const CAR_MAKES = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Nissan",
  "Hyundai",
  "Kia",
  "Mazda",
  "Subaru",
  "Lexus",
  "Tesla",
  "Jeep",
  "Ram",
  "GMC",
  "Dodge",
  "Volvo",
] as const;

export const CAR_MODELS: Record<string, string[]> = {
  Toyota: [
    "Camry",
    "Corolla",
    "RAV4",
    "Highlander",
    "Prius",
    "4Runner",
    "Tacoma",
    "Tundra",
  ],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "HR-V", "Ridgeline"],
  Ford: [
    "F-150",
    "Mustang",
    "Explorer",
    "Escape",
    "Edge",
    "Expedition",
    "Bronco",
  ],
  Chevrolet: [
    "Silverado",
    "Malibu",
    "Equinox",
    "Tahoe",
    "Traverse",
    "Camaro",
    "Corvette",
  ],
  BMW: ["3 Series", "5 Series", "X3", "X5", "X7", "M3", "M5", "iX"],
  "Mercedes-Benz": [
    "C-Class",
    "E-Class",
    "S-Class",
    "GLC",
    "GLE",
    "GLS",
    "A-Class",
  ],
  Audi: ["A4", "A6", "Q5", "Q7", "Q8", "e-tron", "A3", "S4"],
  Volkswagen: ["Jetta", "Passat", "Tiguan", "Atlas", "Golf", "ID.4", "Arteon"],
  Nissan: [
    "Altima",
    "Sentra",
    "Rogue",
    "Pathfinder",
    "Frontier",
    "Murano",
    "Maxima",
  ],
  Hyundai: [
    "Elantra",
    "Sonata",
    "Tucson",
    "Santa Fe",
    "Palisade",
    "Kona",
    "Ioniq 5",
  ],
  Kia: ["Forte", "K5", "Sportage", "Sorento", "Telluride", "Seltos", "EV6"],
  Mazda: ["Mazda3", "Mazda6", "CX-5", "CX-9", "CX-30", "MX-5 Miata", "CX-50"],
  Subaru: [
    "Impreza",
    "Legacy",
    "Outback",
    "Forester",
    "Crosstrek",
    "Ascent",
    "WRX",
  ],
  Lexus: ["ES", "IS", "RX", "NX", "GX", "LX", "UX", "LS"],
  Tesla: ["Model 3", "Model S", "Model X", "Model Y"],
  Jeep: [
    "Wrangler",
    "Grand Cherokee",
    "Cherokee",
    "Compass",
    "Renegade",
    "Gladiator",
  ],
  Ram: ["1500", "2500", "3500", "ProMaster"],
  GMC: ["Sierra", "Terrain", "Acadia", "Yukon", "Canyon"],
  Dodge: ["Charger", "Challenger", "Durango", "Hornet"],
  Volvo: ["S60", "S90", "XC40", "XC60", "XC90", "C40"],
};

export const RELEASE_YEARS = Array.from(
  { length: new Date().getFullYear() - 1990 + 1 },
  (_, i) => 1990 + i
).reverse();

export type CarMake = (typeof CAR_MAKES)[number];

export const CAR_COLORS = [
  "Black",
  "White",
  "Silver",
  "Gray",
  "Blue",
  "Red",
  "Green",
  "Yellow",
  "Brown",
  "Beige",
  "Gold",
  "Orange",
  "Purple",
  "Pink",
] as const;

export type CarColor = (typeof CAR_COLORS)[number];

export const FUEL_TYPES = [
  "Petrol",
  "Diesel",
  "Electric",
  "Hybrid",
  "CNG",
  "LPG",
] as const;

export type FuelType = (typeof FUEL_TYPES)[number];

export const TRANSMISSION_TYPES = [
  "Manual",
  "Automatic",
  "CVT",
  "Semi-Auto",
] as const;

export type TransmissionType = (typeof TRANSMISSION_TYPES)[number];

export const DRIVER_TYPES = ["AWD", "4WD", "2WD", "FWD", "RWD"] as const;

export type DriverType = (typeof DRIVER_TYPES)[number];

export const BODY_TYPES = [
  "Sedan",
  "Hatchback",
  "SUV",
  "Coupe",
  "Convertible",
  "Wagon",
  "Van",
  "Truck",
  "Crossover",
  "Minivan",
] as const;

export type BodyType = (typeof BODY_TYPES)[number];

export const FUEL_POLICIES = [
  "Full to Full",
  "Full to Empty",
  "Prepaid",
  "Same to Same",
] as const;

export type FuelPolicy = (typeof FUEL_POLICIES)[number];

export const CUSTOM_DAYS = ["Mon", "Tue", "Wen", "Thur", "Fri", "Sat", "Sun"];
