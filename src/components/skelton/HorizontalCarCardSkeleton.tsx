import React from "react";

export const HorizontalCarCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      {/* First Row: Image | Car Details | Price & Button */}
      <div className="flex flex-col md:flex-row">
        {/* Car Image Skeleton */}
        <div className="w-full md:w-80 h-56 md:h-64 flex-shrink-0 bg-gray-200"></div>

        {/* Car Details Skeleton */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between h-full gap-6">
            {/* Left Side - Car Info Skeleton */}
            <div className="flex-1">
              {/* Car Title Skeleton */}
              <div className="mb-6">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              </div>

              {/* Car Features Skeleton */}
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <div className="w-5 h-5 bg-gray-200 rounded mr-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Price and Action Skeleton */}
            <div className="w-full md:w-56 flex flex-col justify-between items-end">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl w-full">
                <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-32 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-28"></div>
              </div>
              <div className="w-full h-14 bg-gray-300 rounded-xl mt-4"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Host | Rating | Important Info Skeleton */}
      <div className="border-t-2 border-gray-100 px-6 md:px-8 py-5 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Host Info Skeleton */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>

          {/* Rating Skeleton */}
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <div className="w-20 h-10 bg-gray-200 rounded-lg mr-3"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>

          {/* Important Info Skeleton */}
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};