"use client";

import { useState } from "react";
import { Calendar, Info } from "lucide-react";
import { useBookingHistory } from "@/hooks/use-booking-history";
import { useAuth } from "@/contexts/AuthContext";
import { BookingDetail } from "@/types/payment";
import BookingCalendar from "./Bookingcalendar";
import BookingDetailsPanel from "./Bookingdetailspanel";
import BookingLegend from "./Bookinglegend";

export default function BookingContent() {
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'single' | 'double' | 'triple'>('double');
  const [showLegend, setShowLegend] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  // Build booking filters based on user role
  const bookingFilters = isAdmin
    ? { limit: 100 }
    : { userId: user?.id, limit: 100 };  

  // Fetch booking data
  const { data: bookingData, isLoading, error, refetch } = useBookingHistory(bookingFilters);

  const bookings = bookingData?.rows || [];

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    const increment = viewMode === 'single' ? 1 : viewMode === 'double' ? 2 : 3;
    newDate.setMonth(currentMonth.getMonth() + (direction === 'next' ? increment : -increment));
    setCurrentMonth(newDate);
  };

  return (
    <div className="flex-1 p-4 lg:p-8 h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar bg-gray-50">
      <div className="container mx-auto h-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Booking Management
              </h1>
              <p className="text-gray-600">
                {isAdmin 
                  ? "View and manage all car rental bookings across the platform" 
                  : "Manage and track your car rental bookings"}
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
                  </span>
                </div>
                
                {/* Legend Toggle */}
                <button
                  onClick={() => setShowLegend(!showLegend)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                >
                  <Info className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {showLegend ? 'Hide' : 'Show'} Tips
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Legend - Collapsible */}
          {showLegend && (
            <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
              <BookingLegend />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <BookingCalendar
              bookings={bookings}
              currentMonth={currentMonth}
              viewMode={viewMode}
              isLoading={isLoading}
              error={error}
              selectedBooking={selectedBooking}
              onSelectBooking={setSelectedBooking}
              onNavigateMonth={navigateMonth}
              onViewModeChange={setViewMode}
              onRetry={refetch}
            />
          </div>

          {/* Booking Details Panel */}
          <div className="lg:col-span-1">
            <BookingDetailsPanel
              booking={selectedBooking}
              isAdmin={isAdmin}
              onClose={() => setSelectedBooking(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}