"use client";

import { Calendar, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { BookingDetail, BookingStatus } from "@/types/payment";

interface MonthData {
  date: Date;
  dates: Date[];
  monthName: string;
}

interface BookingCalendarProps {
  bookings: BookingDetail[];
  currentMonth: Date;
  viewMode: 'single' | 'double' | 'triple';
  isLoading: boolean;
  error: Error | null;
  selectedBooking: BookingDetail | null;
  onSelectBooking: (booking: BookingDetail) => void;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onViewModeChange: (mode: 'single' | 'double' | 'triple') => void;
  onRetry: () => void;
}

// Status color mapping
const statusColors: Record<BookingStatus, string> = {
  CONFIRMED: "bg-emerald-500",
  PENDING: "bg-amber-500",
  CANCELLED: "bg-red-500",
  COMPLETED: "bg-blue-500",
  PROCESSING: "bg-violet-500",
};

export default function BookingCalendar({
  bookings,
  currentMonth,
  viewMode,
  isLoading,
  error,
  selectedBooking,
  onSelectBooking,
  onNavigateMonth,
  onViewModeChange,
  onRetry,
}: BookingCalendarProps) {
  
  // Generate month dates
  const getMonthDates = (startDate: Date): Date[] => {
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const totalDays = Math.ceil((startDay + daysInMonth) / 7) * 7;

    const dates: Date[] = [];
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(year, month, i - startDay + 1);
      dates.push(date);
    }
    return dates;
  };

  // Generate multiple months
  const getMultipleMonths = (startDate: Date, count: number): MonthData[] => {
    const months: MonthData[] = [];
    for (let i = 0; i < count; i++) {
      const monthDate = new Date(startDate);
      monthDate.setMonth(startDate.getMonth() + i);
      months.push({
        date: monthDate,
        dates: getMonthDates(monthDate),
        monthName: monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
    }
    return months;
  };

  const months = getMultipleMonths(currentMonth, viewMode === 'single' ? 1 : viewMode === 'double' ? 2 : 3);

  // Format date range
  const formatDateRange = (): string => {
    if (months.length === 1) {
      return months[0].monthName;
    }
    const start = months[0].monthName;
    const end = months[months.length - 1].monthName;
    return `${start} - ${end}`;
  };

  // Check if booking is in a specific month
  const isBookingInMonth = (booking: BookingDetail, monthDates: Date[]): boolean => {
    const startDate = new Date(booking.pickUpDate);
    const endDate = new Date(booking.dropOffDate);
    return monthDates.some(date => date >= startDate && date <= endDate);
  };

  // Get bookings for a specific month
  const getBookingsForMonth = (monthDates: Date[]): BookingDetail[] => {
    return bookings.filter(booking => isBookingInMonth(booking, monthDates));
  };

  // Calculate booking position within a month
  const getBookingPosition = (booking: BookingDetail, monthDates: Date[]) => {
    const startDate = new Date(booking.pickUpDate);
    const endDate = new Date(booking.dropOffDate);

    const startIndex = monthDates.findIndex(date => date.toDateString() === startDate.toDateString());
    const endIndex = monthDates.findIndex(date => date.toDateString() === endDate.toDateString());

    if (startIndex === -1 || endIndex === -1) return null;

    const row = Math.floor(startIndex / 7);
    const col = startIndex % 7;
    const width = Math.min(endIndex - startIndex + 1, 7 - col);

    return { row, col, width };
  };

  // Format date for tooltip
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Loading bookings...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-600 font-semibold text-lg mb-2">Failed to load bookings</p>
            <p className="text-gray-500 text-sm mb-6">Please check your connection and try again</p>
            <button
              onClick={onRetry}
              className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all hover:scale-105 font-medium shadow-sm cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-900 font-semibold text-lg mb-2">No bookings found</p>
            <p className="text-gray-500 text-sm">There are no bookings to display at the moment</p>
          </div>
        </div>
      ) : (
        <>
          {/* Date Navigation */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {formatDateRange()}
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => onViewModeChange('single')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer ${
                  viewMode === 'single'
                    ? 'bg-white text-gray-900 shadow-sm cursor-pointer'
                    : 'text-gray-600 hover:text-gray-900 cursor-pointer'
                }`}
              >
                1 Month
              </button>
              <button
                onClick={() => onViewModeChange('double')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer ${
                  viewMode === 'double'
                    ? 'bg-white text-gray-900 shadow-sm cursor-pointer'
                    : 'text-gray-600 hover:text-gray-900 cursor-pointer'
                }`}
              >
                2 Months
              </button>
              <button
                onClick={() => onViewModeChange('triple')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer ${
                  viewMode === 'triple'
                    ? 'bg-white text-gray-900 shadow-sm cursor-pointer'
                    : 'text-gray-600 hover:text-gray-900 cursor-pointer'
                }`}
              >
                3 Months
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group cursor-pointer"
                aria-label="Previous months"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
              </button>
              <button
                onClick={() => onNavigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group cursor-pointer"
                aria-label="Next months"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
              </button>
            </div>
          </div>

          {/* Multi-Month Calendar Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'single' ? 'grid-cols-1' : 
            viewMode === 'double' ? 'grid-cols-1 md:grid-cols-2' : 
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {months.map((month, monthIndex) => (
              <div key={monthIndex} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                {/* Month Header */}
                <div className="text-center mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    {month.monthName}
                  </h3>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center">
                      <div className="text-xs font-semibold text-gray-600 py-1">
                        {day}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="relative">
                  {/* Booking bars */}
                  {getBookingsForMonth(month.dates).map((booking) => {
                    const position = getBookingPosition(booking, month.dates);
                    if (!position) return null;

                    const { row, col, width } = position;
                    const top = row * 44 + 28;
                    const left = (col * 100) / 7;
                    const barWidth = (width * 100) / 7;
                    const isSelected = selectedBooking?.id === booking.id;

                    return (
                      <div
                        key={booking.id}
                        className={`absolute h-2 ${statusColors[booking.bookingStatus]} rounded-full cursor-pointer transition-all z-10 ${
                          isSelected 
                            ? 'h-3 opacity-100 ring-2 ring-offset-1 ring-gray-900' 
                            : 'hover:h-2.5 hover:opacity-90'
                        }`}
                        style={{
                          top: `${top}px`,
                          left: `${left}%`,
                          width: `${barWidth}%`,
                          maxWidth: 'calc(100% - 8px)',
                          marginLeft: '4px'
                        }}
                        onClick={() => onSelectBooking(booking)}
                        title={`${booking.user?.fName} ${booking.user?.lName} - ${booking.car?.make} ${booking.car?.model}\n${formatDate(new Date(booking.pickUpDate))} - ${formatDate(new Date(booking.dropOffDate))}`}
                      />
                    );
                  })}

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {month.dates.map((date, dayIndex) => {
                      const isCurrentMonth = date.getMonth() === month.date.getMonth();
                      const isToday = date.toDateString() === new Date().toDateString();
                      const dayBookings = getBookingsForMonth([date]);

                      return (
                        <div
                          key={dayIndex}
                          className={`min-h-[40px] p-1 border rounded-lg transition-all cursor-default ${
                            isCurrentMonth
                              ? 'bg-white border-gray-200 hover:border-gray-300'
                              : 'bg-gray-100/50 border-gray-100 text-gray-400'
                          } ${isToday ? 'bg-gray-50 border-gray-300 ring-2 ring-gray-100' : ''} relative`}
                        >
                          <div className={`text-xs font-medium ${
                            isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                          } ${isToday ? 'text-gray-600 font-bold' : ''}`}>
                            {date.getDate()}
                          </div>

                          {/* Multiple booking indicators */}
                          {dayBookings.length > 1 && (
                            <div className="absolute bottom-1 right-1 flex gap-0.5">
                              {dayBookings.slice(1, 3).map((booking, idx) => (
                                <div
                                  key={`${booking.id}-indicator-${idx}`}
                                  className={`w-1.5 h-1.5 ${statusColors[booking.bookingStatus]} rounded-full`}
                                  title={`${booking.user?.fName} ${booking.user?.lName}`}
                                />
                              ))}
                              {dayBookings.length > 3 && (
                                <div 
                                  className="w-1.5 h-1.5 bg-gray-400 rounded-full" 
                                  title={`+${dayBookings.length - 3} more`}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}