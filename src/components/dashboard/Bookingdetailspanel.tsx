"use client";

import { Calendar, Users, Car, Clock, Mail, Phone, CreditCard, MapPin, X } from "lucide-react";
import { BookingDetail, BookingStatus, PaymentStatus } from "@/types/payment";

interface BookingDetailsPanelProps {
  booking: BookingDetail | null;
  isAdmin: boolean;
  onClose: () => void;
}

const statusTextColors: Record<BookingStatus, string> = {
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-violet-50 text-violet-700 border-violet-200",
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  UNPAID: "bg-red-50 text-red-700 border-red-200",
  PARTIALLY_PAID: "bg-amber-50 text-amber-700 border-amber-200",
  REFUNDED: "bg-gray-50 text-gray-700 border-gray-200",
  PROCESSING: "bg-violet-50 text-violet-700 border-violet-200",
};

export default function BookingDetailsPanel({ booking, isAdmin, onClose }: BookingDetailsPanelProps) {
  if (!booking) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 h-fit sticky top-8">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">No booking selected</p>
          <p className="text-sm text-gray-500">Click on any booking bar in the calendar to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8 animate-in slide-in-from-right-5 duration-300 max-h-[calc(85vh-6rem)] flex flex-col">
      {/* Close Button - Mobile - Sticky at top */}
      <div className="lg:hidden flex justify-end px-4 pt-4 pb-2 border-b border-gray-100 bg-white">
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Scrollable Content with custom scrollbar */}
      <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">
        {/* User Profile */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">
              {booking.user?.fName?.[0]}{booking.user?.lName?.[0]}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {booking.user?.fName} {booking.user?.lName}
          </h3>
          <p className="text-sm text-gray-500 font-medium">Customer</p>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusTextColors[booking.bookingStatus]}`}>
            {booking.bookingStatus}
          </span>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${paymentStatusColors[booking.paymentStatus]}`}>
            {booking.paymentStatus}
          </span>
        </div>

        {/* Booking Details */}
        <div className="space-y-4">
          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Information</h4>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Mail className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900 break-words">
                  {booking.user?.email}
                </p>
              </div>
            </div>

            {booking.user?.phone && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.user.phone}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Vehicle Details</h4>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Car className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Vehicle</p>
                <p className="text-sm font-semibold text-gray-900">
                  {booking.car?.make} {booking.car?.model}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{booking.car?.year} • {booking.car?.color}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <MapPin className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">License Plate</p>
                <p className="text-sm font-semibold text-gray-900 font-mono">
                  {booking.car?.plateNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Rental Period</h4>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Calendar className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Pick-up Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(booking.pickUpDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Calendar className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Drop-off Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(booking.dropOffDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Clock className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="text-sm font-semibold text-gray-900">
                  {booking.totalDays} {booking.totalDays === 1 ? 'Day' : 'Days'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border-2 border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-emerald-700 font-medium mb-0.5">Total Amount</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {booking.totalAmount.toLocaleString()} <span className="text-sm">RWF</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Car Owner Info - Admin Only */}
        {isAdmin && booking.car?.owner && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Car Owner
            </h4>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-amber-900">
                    {booking.car.owner.fName[0]}{booking.car.owner.lName[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {booking.car.owner.fName} {booking.car.owner.lName}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{booking.car.owner.email}</p>
                </div>
              </div>
              {booking.car.owner.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-700 pt-3 border-t border-amber-200">
                  <Phone className="w-3 h-3" />
                  <span className="font-medium">{booking.car.owner.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking ID */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Booking ID: <span className="font-mono font-medium text-gray-700">{booking.bookingGroupId}</span>
          </p>
        </div>
      </div>

      {/* Scroll Indicator - Fades when scrolled to bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}