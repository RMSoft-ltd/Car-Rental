import React, { useState } from "react";
import { Users, Briefcase, Clock, Settings, Info, User } from "lucide-react";
import ImportantInfoModal from "./ImportantInfoModal";
import Link from "next/link";
import { Car } from "@/types/car-listing";
import { baseUrl } from "@/lib/api";
import Image from "next/image";

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

        {/* First Row: Image | Car Details | Price & Button */}
        <div className="flex">
          {/* Car Image */}
          <div className="w-72 h-48 flex-shrink-0 relative">
            <Image
              src={car.carImages && car.carImages.length > 0 ? `${baseUrl}${car.carImages[0]}` : `${baseUrl}${car.carImages[1]}`}
              objectFit="cover"
              width={500}
              height={500}
              alt={`${car.make} ${car.model}`}
              onError={(e) => {
                e.currentTarget.src = `${baseUrl}/${car.carImages[0]}`;
              }}
            />
          </div>

          {/* Car Details */}
          <div className="flex-1 p-6">
            <div className="flex justify-between h-full">
              {/* Left Side - Car Info */}
              <div className="flex-1">
                {/* Car Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {car.make} {car.model} {car.year}
                </h3>
                {/* <p className="text-sm text-gray-500 mb-4">or similar SUV</p> */}

                {/* Car Features */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{car.doors} Seats</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>1 Large bag</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{car.mileage} mileage</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>2 Small bag</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Settings className="w-4 h-4 mr-2" />
                    <span>{car.transition}</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Price and Action */}
              <div className="w-48 flex flex-col justify-between items-end">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Price Per day</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {car.pricePerDay.toLocaleString()} RWF
                  </p>
                  <p className="text-sm text-gray-500">Free cancellation</p>
                </div>
                <Link
                  href={`/cars/${car.id}`}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center block"
                >
                  View Deal
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: Host | Rating | Important Info */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Host Info */}
            <div className="flex items-center">
              <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                <User className="w-3 h-3 text-gray-600" />
              </div>
              <div>
                <p className="text-sm capitalize font-medium text-gray-900">{hostName}</p>
                <p className="text-xs text-gray-500">Host</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center">
              <div className="bg-black text-white px-2 py-1 rounded text-xs font-medium mr-3">
                <span className="text-xs font-bold">
                  {reviewRating.toFixed(1)}
                </span>{" "}
                OK
              </div>
              <span className="text-sm text-gray-500">
                ({reviewCount} reviews)
              </span>
            </div>

            {/* Important Info */}
            <button
              onClick={handleInfoClick}
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Info className="w-4 h-4 mr-1" />
              <span className="text-sm">Important Info</span>
            </button>
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
