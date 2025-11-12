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
          {/* Car Image - Fixed aspect ratio */}
          {/* <div className="w-full md:w-80  h-64 md:h-56 lg:h-64 flex-shrink-0 relative"> */}
           <div className="w-full md:w-72 h-48 flex-shrink-0 relative">
            <Image
              src={
                car.carImages && car.carImages.length > 0
                  ? `${baseUrl}${car.carImages[0]}`
                  : `${baseUrl}${car.carImages[1]}`
              }
              fill
              className="object-cover"
              alt={`${car.make} ${car.model}`}
              onError={(e) => {
                e.currentTarget.src = `${baseUrl}/${car.carImages[0]}`;
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 320px, 384px"
            />
          </div>

          {/* Car Details Section */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row justify-between h-full gap-4">
              {/* Left Side - Car Info */}
              <div className="flex-1">
                {/* Car Title */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                  {car.make} {car.model} {car.year}
                </h3>

                {/* Car Features */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{car.doors} Seats</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>1 Large bag</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{car.mileage} mileage</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>2 Small bag</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 col-span-2">
                    <Settings className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{car.transition}</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Price and Action */}
              <div className="lg:w-48 flex flex-row lg:flex-col justify-between lg:justify-between items-center lg:items-end gap-4">
                <div className="text-left lg:text-right">
                  <p className="text-xs sm:text-sm text-gray-500">Price Per day</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {car.pricePerDay.toLocaleString()} RWF
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Free cancellation</p>
                </div>
                <Link
                  href={`/cars/${car.id}`}
                  className="w-fit sm:w-auto lg:w-full bg-black text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center text-sm sm:text-base whitespace-nowrap"
                >
                  View Deal
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: Host | Rating | Important Info */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            {/* Host Info */}
            <div className="flex items-center">
              <UserAvatar user={car.owner} size="small" />
              <div className="ml-2">
                <p className="text-xs sm:text-sm capitalize font-medium text-gray-900">
                  {hostName}
                </p>
                <p className="text-xs text-gray-500">Host</p>
              </div>
            </div>

            {/* Rating and Important Info - Grouped on mobile */}
            <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
              {/* Rating */}
              <div className="flex items-center">
                <div className="bg-black text-white px-2 py-1 rounded text-xs font-medium mr-2 sm:mr-3">
                  <span className="text-xs font-bold">
                    {reviewRating.toFixed(1)}
                  </span>{" "}
                  OK
                </div>
                <span className="text-xs sm:text-sm text-gray-500">
                  ({reviewCount})
                </span>
              </div>

              {/* Important Info */}
              <button
                onClick={handleInfoClick}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Info className="w-4 h-4 mr-1" />
                <span className="text-xs sm:text-sm">Important Info</span>
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