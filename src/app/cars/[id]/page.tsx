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
  Fuel
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

export default function CarDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Car Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {mockCar.make} {mockCar.model} {mockCar.year}
              </h1>
              <p className="text-gray-600">or similar SUV</p>
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

            {/* Car Specifications */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Car Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Seats</p>
                    <p className="font-semibold">{mockCar.seats}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Settings className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="font-semibold">{mockCar.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Fuel className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-semibold">{mockCar.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="font-semibold">{mockCar.mileage} km</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {mockCar.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Power Steering</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Central Locking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">ABS</span>
                </div>
              </div>
            </div>

            {/* Host Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Host Information</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Benny Crispin</h3>
                    <p className="text-sm text-gray-500">Host</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-black text-white px-3 py-1 rounded text-sm font-medium mr-3">
                    <span className="text-lg font-bold">9.3</span> OK
                  </div>
                  <span className="text-sm text-gray-500">(111 reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500">Price Per day</p>
                <p className="text-3xl font-bold text-gray-900">{mockCar.pricePerDay.toLocaleString()} RWF</p>
                <p className="text-sm text-gray-500">Free cancellation</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pick-up Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Drop-off Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pick-up Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter location"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <button className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors text-lg">
                  Book Now
                </button>

                <div className="flex items-center justify-center text-gray-500">
                  <Info className="w-4 h-4 mr-2" />
                  <span className="text-sm">Important Info</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
