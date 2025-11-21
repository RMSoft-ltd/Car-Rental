import React, { useState } from "react";
import { Users, Briefcase, Clock, Settings, Info } from "lucide-react";
import ImportantInfoModal from "./ImportantInfoModal";
import Link from "next/link";
import { Car } from "@/types/car-listing";
import { baseUrl } from "@/lib/api";
import Image from "next/image";
import { UserAvatar } from "./Avator";

interface HorizontalCarCardProps {
  car: Car;
  isTopPick?: boolean;
  hostName?: string;
  reviewCount?: number;
  reviewRating?: number;
}

export default function HorizontalCarCard({
  car,
  isTopPick = false,
  hostName = car.owner.fName + " " + car.owner.lName || car.owner.email,
  reviewCount = 111,
  reviewRating = 9.3,
}: HorizontalCarCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleInfoClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 relative transform hover:-translate-y-1 overflow-hidden">
        {/* Top Pick Badge */}
        {isTopPick && (
          <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-medium z-10 rounded">
            Top Pick
          </div>
        )}

        {/* Main Content - Responsive Layout */}
        <div className="flex flex-col md:flex-row">
          {/* Car Image - Optimized aspect ratio */}
          <div className="w-full md:w-80 h-56 md:h-48 lg:h-56 flex-shrink-0 relative overflow-hidden rounded-l-xl md:rounded-l-xl md:rounded-r-none bg-gray-100">
            {/* Loading Skeleton */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              </div>
            )}

            {/* Error State */}
            {imageError && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Image unavailable</p>
                </div>
              </div>
            )}

            {/* Main Image */}
            <Image
              src={(() => {
                const carImage = car.carImages?.[0] || car.carImages?.[1];

                // If carImage is already a full URL (starts with http), return directly.
                if (carImage?.startsWith("http")) return carImage;

                // If it's a filename or relative path, prefix with baseUrl
                if (carImage) return `${baseUrl}${carImage}`;

                // Final fallback (optional)
                return carImage;
              })()}
              fill
              className={`object-cover transition-all duration-300 ${
                imageLoaded ? "hover:scale-105 opacity-100" : "opacity-0"
              }`}
              alt={`${car.make} ${car.model}`}
              onLoad={() => {
                setImageLoaded(true);
                setImageError(false);
              }}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 320px, 384px"
              priority={false}
            />

            {/* Image Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Car Details Section */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row justify-between h-full gap-4 lg:gap-6">
              {/* Left Side - Car Info */}
              <div className="flex-1 min-w-0">
                {/* Car Title */}
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 line-clamp-1">
                  {car.make} {car.model} {car.year}
                </h3>

                {/* Car Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <Users className="w-4 h-4 mr-3 flex-shrink-0 text-gray-500" />
                    <span className="font-medium">{car.doors} Seats</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <Briefcase className="w-4 h-4 mr-3 flex-shrink-0 text-gray-500" />
                    <span className="font-medium">{car.largeBags} Large bag</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <Clock className="w-4 h-4 mr-3 flex-shrink-0 text-gray-500" />
                    <span className="font-medium">{car.mileage} km</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <Briefcase className="w-4 h-4 mr-3 flex-shrink-0 text-gray-500" />
                    <span className="font-medium">{car.smallBags} Small bags</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 sm:col-span-2">
                    <Settings className="w-4 h-4 mr-3 flex-shrink-0 text-gray-500" />
                    <span className="font-medium capitalize">
                      {car.transition}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side - Price and Action */}
              <div className="lg:w-52 flex flex-row lg:flex-col justify-between lg:justify-end items-center lg:items-end gap-4 lg:gap-6">
                <div className="text-center lg:text-right flex-1 lg:flex-none">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Price Per day
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                    {car.pricePerDay.toLocaleString()}{" "}
                    <span className="text-lg font-semibold text-gray-600">
                      RWF
                    </span>
                  </p>
                  <p className="text-xs sm:text-sm text-black font-medium mt-1">
                    ✓ Free cancellation
                  </p>
                </div>
                <Link
                  href={`/cars/${car.id}`}
                  className="w-full lg:w-auto bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 hover:shadow-lg transition-all duration-200 text-center text-sm sm:text-base hover:scale-105 active:scale-95"
                >
                  View Deal
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: Host | Rating | Important Info */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            {/* Host Info */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2">
              <UserAvatar user={car.owner} size="small" />
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {hostName}
                </p>
                <p className="text-xs text-gray-700 font-medium">
                  Verified Host
                </p>
              </div>
            </div>

            {/* Rating and Important Info */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* Rating */}
              <div className="flex items-center bg-white rounded-lg px-3 py-2">
                <div className="bg-black text-white px-3 py-1 rounded-md text-sm font-bold mr-3">
                  {reviewRating.toFixed(1)}
                </div>
                <div className="text-left">
                  <span className="text-xs text-gray-700">
                    ({reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Important Info */}
              <button
                onClick={handleInfoClick}
                className="flex items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-lg px-3 py-2 font-medium transition-all duration-200 cursor-pointer hover:font-semibold"
              >
                <Info className="w-4 h-4 mr-2" />
                <span className="text-sm">Important Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Important Info Modal */}
      <ImportantInfoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        carData={{
          make: car.make,
          model: car.model,
          year: car.year,
          mileage: car.mileage,
        }}
      />
    </>
  );
}
