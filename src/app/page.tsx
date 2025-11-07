"use client";

import React from "react";
import { MapPin, Calendar, Clock, Search, ArrowUpDown } from "lucide-react";
import HorizontalCarCard from "@/components/HorizontalCarCard";
import {
  selectCars,
  fetchCars,
  selectCarsLoading,
} from "@/store/slices/carSlice";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { CarQueryParams } from "@/types/car-listing";
import { HorizontalCarCardSkeleton } from "@/components/skelton/HorizontalCarCardSkeleton";
import EmptyState from "@/components/EmptySatate";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectInput } from "@/components/SelectInput";

export default function Home() {
  const cars = useAppSelector(selectCars);
  const isLoading = useAppSelector(selectCarsLoading);

  console.log("Alls Cars", cars);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchCars(filters));
  }, [dispatch]);

  const filters: CarQueryParams = {
    page: 1,
    limit: 25,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[80vh]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          }}
        >
          {/* Secondary Car Image Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            }}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              {/* Main Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Car & Driver Rental - Search, Compare & Save
              </h1>

              {/* Features List */}
              <div className="space-y-3 mb-12">
                <div className="flex items-center text-white">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-lg">Free Cancellation</span>
                </div>
                <div className="flex items-center text-white">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-lg">10,000 + Car Rentals</span>
                </div>
                <div className="flex items-center text-white">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-lg">Customer support 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="absolute bottom-4 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                {/* Pick-up Location */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pick-up Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value="Kigali, Kigali, Rwanda"
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                    />
                  </div>
                </div>

                {/* Pick-up Date */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pick-up Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value="Sun 9 Mar"
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                    />
                  </div>
                </div>

                {/* Pick-up Time */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value="10:30"
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                    />
                  </div>
                </div>

                {/* Drop-off Date */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop-off Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value="Mon 16 Mar"
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                    />
                  </div>
                </div>

                {/* Drop-off Time */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value="21:00"
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="md:col-span-1">
                  <button className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <Search className="w-5 h-5" />
                    Search Car
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Below Hero */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 sticky top-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filter</h3>
                  <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    Clear All Filters
                  </button>
                </div>

                {/* Car Type Filter */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">
                    Car Type
                  </h4>
                  <div className="space-y-1">
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Sedan
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(3)</span>
                    </label>
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">SUV</span>
                      </div>
                      <span className="text-sm text-gray-500">(4)</span>
                    </label>
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Hatchback
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(2)</span>
                    </label>
                  </div>
                </div>

                {/* Transmission Filter */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">
                    Transmission
                  </h4>
                  <div className="space-y-1">
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Automatic
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(6)</span>
                    </label>
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Manual
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(3)</span>
                    </label>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">
                    Price Range
                  </h4>
                  <div className="space-y-1">
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Under 50,000 RWF
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(3)</span>
                    </label>
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          50,000 - 80,000 RWF
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(4)</span>
                    </label>
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Above 80,000 RWF
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(2)</span>
                    </label>
                  </div>
                </div>

                {/* Features Filter */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">
                    Features
                  </h4>
                  <div className="space-y-1">
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Air Conditioning
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(9)</span>
                    </label>
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          GPS Navigation
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(7)</span>
                    </label>
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Bluetooth
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(8)</span>
                    </label>
                  </div>
                </div>

                {/* Fuel Type Filter */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">
                    Fuel Type
                  </h4>
                  <div className="space-y-1">
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Petrol
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(7)</span>
                    </label>
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Diesel
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(2)</span>
                    </label>
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Electric
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(0)</span>
                    </label>
                  </div>
                </div>

                {/* Year Filter */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Year</h4>
                  <div className="space-y-1">
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          2020 - 2024
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(5)</span>
                    </label>
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          2018 - 2019
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(3)</span>
                    </label>
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Below 2018
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">(1)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Header and Filter Card */}
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 mb-6">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {cars?.total} Cars Available
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Sort By:</span>
                    </div>


                    {/* <SelectInput /> */}
                    <select className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white">
                      <option>Recommended</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest First</option>
                    </select>
                  </div>
                </div>

                {/* Car Category Filter Buttons */}
                {/* <div className="flex flex-wrap gap-2">
                  <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium">
                    All Cars
                  </button>
                  <button className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50">
                    Small Cars
                  </button>
                  <button className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50">
                    Medium Cars
                  </button>
                  <button className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50">
                    Large Cars
                  </button>
                  <button className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50">
                    SUVs Cars
                  </button>
                </div> */}

                <Tabs defaultValue="all" className="flex flex-wrap gap-2">
                <TabsList>
                  <TabsTrigger value="all"> All Cars</TabsTrigger>
                  <TabsTrigger value="small">Small Cars</TabsTrigger>
                  <TabsTrigger value="medium">Medium Cars</TabsTrigger>
                  <TabsTrigger value="large">Large Cars</TabsTrigger>
                </TabsList>

              </Tabs>
              </div>

              {/* Car Listings */}
              <div className="space-y-6">
                {isLoading ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => <HorizontalCarCardSkeleton key={i} />)
                ) : cars?.total === 0 ? (
                  <EmptyState />
                ) : (
                  cars?.rows.map((car, index) => (
                    <HorizontalCarCard
                      isTopPick={index < 2}
                      key={car.id}
                      car={car}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
