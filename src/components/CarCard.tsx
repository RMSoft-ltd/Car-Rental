import React from "react";
import { Car } from "@/types/car";
import { Star, Users, Fuel, Settings } from "lucide-react";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const fallbackImage = "https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Car Image */}
      <div className="relative h-48 bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
        {!car.available && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium z-10">
            Unavailable
          </div>
        )}
      </div>

      {/* Car Details */}
      <div className="p-4">
        {/* Car Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {car.make} {car.model}
            </h3>
            <p className="text-gray-600 text-sm">{car.year}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{car.rating}</span>
          </div>
        </div>

        {/* Car Features */}
        <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            <span>Auto</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span>{car.mileage} km</span>
          </div>
        </div>

        {/* Features Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {car.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
            >
              {feature}
            </span>
          ))}
          {car.features.length > 3 && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              +{car.features.length - 3} more
            </span>
          )}
        </div>

        {/* Price and Location */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {car.pricePerDay.toLocaleString()} RWF
            </p>
            <p className="text-sm text-gray-600">per day</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{car.location}</p>
          </div>
        </div>

        {/* Book Button */}
        <button
          className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors ${
            car.available
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!car.available}
        >
          {car.available ? "Book Now" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}
