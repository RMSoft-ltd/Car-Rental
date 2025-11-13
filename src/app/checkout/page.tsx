"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, ShoppingCart } from "lucide-react";

// Booking Status Component
const BookingStatus = ({ bookedItems, failedItems }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Status</h2>
      
      {/* Successfully Booked Items */}
      {bookedItems && bookedItems.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Successfully Booked ({bookedItems.length})
            </h3>
          </div>
          
          <div className="space-y-4">
            {bookedItems.map((item) => (
              <div key={item.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {item.carDetails.make} {item.carDetails.model} {item.carDetails.year}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Plate: {item.carDetails.plateNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(item.pickUpDate).toLocaleDateString()} - {new Date(item.dropOffDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.totalDays} days • RWF {item.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {item.bookingStatus}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Payment: {item.paymentStatus}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Failed Bookings */}
      {failedItems && failedItems.length > 0 && (
        <div>
          <div className="flex items-center mb-3">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Failed Bookings ({failedItems.length})
            </h3>
          </div>
          
          <div className="space-y-4">
            {failedItems.map((item, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {item.carDetails.make} {item.carDetails.model} {item.carDetails.year}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Plate: {item.carDetails.plateNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(item.pickUpDate).toLocaleDateString()} - {new Date(item.dropOffDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      RWF {item.totalAmount.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                      <p className="text-sm text-red-600">{item.reason}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Customer Details Component
const CustomerDetails = ({ customer }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium text-gray-900">{customer.name}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium text-gray-900">{customer.email}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Phone Number</p>
          <p className="font-medium text-gray-900">{customer.phone}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Address</p>
          <p className="font-medium text-gray-900">{customer.address}</p>
        </div>
      </div>
    </div>
  );
};

// Booking Details Component
const BookingDetails = ({ booking }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Pickup Location</p>
          <p className="font-medium text-gray-900">{booking.pickupLocation}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Drop-off Location</p>
          <p className="font-medium text-gray-900">{booking.dropoffLocation}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Pickup Date & Time</p>
          <p className="font-medium text-gray-900">{booking.pickupDateTime}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Drop-off Date & Time</p>
          <p className="font-medium text-gray-900">{booking.dropoffDateTime}</p>
        </div>
      </div>
    </div>
  );
};

// Payment Method Component
const PaymentMethod = ({ method }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
      <p className="font-medium text-gray-900">{method}</p>
    </div>
  );
};

// Car Details Component
const CarDetails = ({ car }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Car Details</h2>
      
      <div className="flex flex-col md:flex-row">
        {/* Car Image - Placeholder */}
        <div className="w-full md:w-64 h-56 bg-gray-200 rounded-lg flex items-center justify-center mb-4 md:mb-0 md:mr-6">
          <ShoppingCart className="w-12 h-12 text-gray-400" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {car.make} {car.model} {car.year}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Seats</p>
              <p className="font-medium text-gray-900">{car.seats}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Range</p>
              <p className="font-medium text-gray-900">{car.range}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Transmission</p>
              <p className="font-medium text-gray-900">{car.transmission}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Luggage</p>
              <p className="font-medium text-gray-900">{car.luggage}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500">Description</p>
            <p className="font-medium text-gray-900">{car.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Summary Component
const OrderSummary = ({ total, itemCount, bookingGroupId }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-4">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Order <span className="text-gray-500 font-normal">Summary</span>
      </h2>
      
      <div className="border-t border-gray-200 my-4" />
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-gray-900">Items</span>
        <span className="text-lg font-semibold text-gray-900">{itemCount}</span>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-gray-900">
          RWF {total.toLocaleString()}
        </span>
      </div>
      
      {bookingGroupId && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500">Booking Reference</p>
          <p className="font-medium text-gray-900 text-sm">{bookingGroupId}</p>
        </div>
      )}
      
      <button
        onClick={() => window.print()}
        className="w-full py-4 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 transition-colors mb-4"
      >
        Print Confirmation
      </button>
      
      <button
        onClick={() => window.location.href = '/cars'}
        className="w-full py-4 rounded-lg font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        Back to Cars
      </button>
    </div>
  );
};

// Main Checkout Component
const Checkout = () => {
  // Sample data - in a real app, this would come from props or API
  const [bookingData, setBookingData] = useState({
    message: "2 items booked successfully",
    bookedItems: [
      {
        bookingStatus: "PENDING",
        paymentStatus: "UNPAID",
        depositStatus: "PENDING",
        isActive: true,
        id: 9,
        userId: 3,
        carDetails: {
          make: "Toyota",
          model: "Corolla",
          year: 2022,
          plateNumber: "RAB30923"
        },
        bookingGroupId: "5ca8e682-adc8-4040-b45b-410c3fde41b2",
        carOwnerId: 2,
        carId: 1,
        pickUpDate: "2025-12-01T00:00:00.000Z",
        dropOffDate: "2025-12-10T00:00:00.000Z",
        totalDays: 10,
        totalAmount: 200,
        updatedAt: "2025-11-13T14:10:12.857Z",
        createdAt: "2025-11-13T14:10:12.857Z"
      },
      {
        bookingStatus: "PENDING",
        paymentStatus: "UNPAID",
        depositStatus: "PENDING",
        isActive: true,
        id: 10,
        userId: 3,
        carDetails: {
          make: "Toyota",
          model: "Corolla",
          year: 2022,
          plateNumber: "RAB30923"
        },
        bookingGroupId: "5ca8e682-adc8-4040-b45b-410c3fde41b2",
        carOwnerId: 2,
        carId: 2,
        pickUpDate: "2025-12-01T00:00:00.000Z",
        dropOffDate: "2025-12-10T00:00:00.000Z",
        totalDays: 10,
        totalAmount: 200,
        updatedAt: "2025-11-13T14:10:13.036Z",
        createdAt: "2025-11-13T14:10:13.036Z"
      }
    ],
    failedItems: [
      {
        carId: 9,
        carDetails: {
          make: "Toyota",
          model: "Corolla",
          year: 2020,
          plateNumber: "RAB1234fghj"
        },
        pickUpDate: "2025-12-01T00:00:00.000Z",
        dropOffDate: "2025-12-10T00:00:00.000Z",
        totalAmount: 250000,
        reason: "Car is already booked for the selected dates",
        reasonCode: "ALREADY_BOOKED",
        conflictingBookings: 1
      },
      {
        carId: 8,
        carDetails: {
          make: "Toyota",
          model: "Corolla",
          year: 2022,
          plateNumber: "RAB30923"
        },
        pickUpDate: "2025-12-01T00:00:00.000Z",
        dropOffDate: "2025-12-10T00:00:00.000Z",
        totalAmount: 5000000,
        reason: "Car is already booked for the selected dates",
        reasonCode: "ALREADY_BOOKED",
        conflictingBookings: 1
      }
    ],
    bookingGroupId: "5ca8e682-adc8-4040-b45b-410c3fde41b2"
  });

  // Sample customer and booking details from the form
  const customerDetails = {
    name: "Benny Chrispin",
    email: "ndizibaidu23@gmail.com",
    phone: "(250) 780-003-842",
    address: "KG 234 ST"
  };

  const bookingDetails = {
    pickupLocation: "KG 234 ST",
    dropoffLocation: "KG 34 ST",
    pickupDateTime: "24 April, 2024, 10:30",
    dropoffDateTime: "28 April, 2024, 21:30"
  };

  const paymentMethod = "MTN Mobile Money";

  const carDetails = {
    make: "Toyota",
    model: "Corolla",
    year: 2018,
    seats: "5 Seats",
    range: "450 km per rental",
    transmission: "Automatic",
    luggage: "1 Large bag, 1 Small bag",
    description: "2.0 DS Power Pulse Momentum Sdr AWD Geartronic Estate"
  };

  // Calculate totals
  const totalBookedAmount = bookingData.bookedItems.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalItems = bookingData.bookedItems.length;

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black">CHECKOUT</h1>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Booking Confirmed</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Status */}
            <BookingStatus 
              bookedItems={bookingData.bookedItems} 
              failedItems={bookingData.failedItems} 
            />
            
            {/* Customer Details */}
            <CustomerDetails customer={customerDetails} />
            
            {/* Booking Details */}
            <BookingDetails booking={bookingDetails} />
            
            {/* Payment Method */}
            <PaymentMethod method={paymentMethod} />
            
            {/* Car Details */}
            <CarDetails car={carDetails} />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              total={totalBookedAmount}
              itemCount={totalItems}
              bookingGroupId={bookingData.bookingGroupId}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;