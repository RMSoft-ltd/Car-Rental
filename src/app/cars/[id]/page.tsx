import React from "react";
import { Car } from "@/types/car";
import {
  ArrowLeft,
  Users,
  Clock,
  Settings,
  MapPin,
  Calendar,
  User,
  Info,
  Share2,
  Heart,
  Fuel,
  Briefcase,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock car data - in real app this would come from API
const mockCar: Car = {
  id: "1",
  make: "Toyota",
  model: "Corolla",
  year: 2018,
  pricePerDay: 35000,
  image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  seats: 5,
  mileage: 450,
  fuelType: "Petrol",
  transmission: "Automatic",
  features: ["Air Conditioning", "GPS", "Bluetooth"],
  available: true,
  location: "Kigali, Rwanda",
  rating: 4.5
};

const featureCategories = [
  {
    title: "Interior",
    items: ["Air Conditioner", "Digital Odometer", "Leather Seats", "Heater", "Techometer"]
  },
  {
    title: "Exterior",
    items: ["Fog Lights Front", "Rain Sensing Wipe", "Rear Spoiler", "Sun Roof"]
  },
  {
    title: "Safety",
    items: ["Brake Assist", "Child Safety Locks", "Traction Control", "Power Door Locks", "Driver Air Bag"]
  },
  {
    title: "Comfort & Convenience",
    items: ["Power Steering", "Vanity Mirror", "Trunk Light"]
  }
];

const carInfoDetails: { label: string; value: string }[] = [
  { label: "Body", value: "SUV" },
  { label: "Mileage", value: "28,000 Miles" },
  { label: "Fuel Type", value: "Diesel" },
  { label: "Year", value: "2022" },
  { label: "Transmission", value: "8-Speed Automatic" },
  { label: "Driver Type", value: "Front Wheel Drive" },
  { label: "Engine Size", value: "4.8L" },
  { label: "Doors", value: "5-door" },
  { label: "Cylinders", value: "6" },
  { label: "Interior Color", value: "Black" }
];

export default function CarDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Search
            </Link>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <Heart className="w-5 h-5 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Car Title */}
            <div className="mb-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-6 py-5">
                <div className="space-y-2">
                  <div>
                    <h1 className="text-[28px] font-semibold text-gray-900">
                      {mockCar.make} {mockCar.model} {mockCar.year}
                    </h1>
                    <p className="text-gray-500 text-sm">2.0 D5 Power Pulse Momentum 5dr AWD Geartronic Estate</p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      5 Seats
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      450 km per rental
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Settings className="w-4 h-4 text-gray-500" />
                      Automatic
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      1 Large bag
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      1 Small bag
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Car Images */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={mockCar.image}
                    alt={`${mockCar.make} ${mockCar.model}`}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                      alt="Interior"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                      alt="Dashboard"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                      alt="Exterior"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                      alt="Engine"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="space-y-6">
                {/* Host Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Benny Crispin</h3>
                        <p className="text-sm text-gray-500">Host</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-black text-white px-3 py-1 rounded text-sm font-medium">
                        <span className="text-lg font-bold">9.3</span> OK
                      </div>
                      <span className="text-sm text-gray-500">(111 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="grid grid-cols-2 gap-y-4">
                    {carInfoDetails.map((detail) => (
                      <div key={detail.label} className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span className="text-sm text-gray-500">{detail.label}</span>
                        <span className="text-sm font-semibold text-gray-900">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
            
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
                <p className="text-sm text-gray-500">
                  <span className="text-gray-900 font-semibold">200,000 Rfw</span> for 6 days
                </p>

                <div className="flex items-center rounded-2xl border border-gray-900 px-5 py-4 text-sm font-semibold text-gray-900">
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-wide text-gray-500">Pick-up Date</p>
                    <p className="text-lg text-gray-900">8/8/2025</p>
                  </div>
                  <div className="mx-4 h-10 w-px bg-gray-200" />
                  <div className="flex-1 text-right">
                    <p className="text-[11px] uppercase tracking-wide text-gray-500">Drop-off Date</p>
                    <p className="text-lg text-gray-900">8/20/2025</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900">Rental Price breakdown</p>
                  <div className="flex items-center justify-between">
                    <span>Car Rental</span>
                    <span className="text-gray-900">200,000 Rfw</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-gray-900">
                    <span>Total Amount</span>
                    <span>200,000 Rfw</span>
                  </div>
                  <p className="text-xs text-gray-500">Free cancellation</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button className="rounded-2xl border border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-white transition-colors">
                    Add To Cart
                  </button>
                  <Link
                    href="/booking"
                    className="rounded-2xl bg-black px-6 py-3 text-center text-sm font-semibold text-white hover:bg-gray-900 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                <h3 className="text-lg font-semibold text-gray-900">Features</h3>
                <div className="space-y-5">
                  {featureCategories.map((category) => (
                    <div key={category.title}>
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">{category.title}</p>
                      <div className="space-y-2 text-sm text-gray-800">
                        {category.items.map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-black" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
