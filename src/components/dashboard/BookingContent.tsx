"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// Mock booking data
const mockBookings = [
  {
    id: 1,
    customer: "Benny Chrispin",
    mobileNumber: "(250) 780-003842",
    email: "ndizibaidu23@gmail.com",
    location: "Remera, Kigali",
    vehicle: "Toyota Corolla 2018",
    pickupTime: "Apr 12, 2024, 10:30",
    pickupLocation: "Kacyiru, KK ST 23",
    returnTime: "Apr 17, 2024, 21:30",
    returnLocation: "Kacyiru, KK ST 23",
    startDate: "2024-04-09",
    endDate: "2024-04-12",
    color: "bg-blue-400"
  },
  {
    id: 2,
    customer: "Alice Johnson",
    mobileNumber: "(250) 780-123456",
    email: "alice.johnson@gmail.com",
    location: "Kimisagara, Kigali",
    vehicle: "Honda Civic 2019",
    pickupTime: "Apr 10, 2024, 09:00",
    pickupLocation: "Kimisagara, KG 123",
    returnTime: "Apr 13, 2024, 18:00",
    returnLocation: "Kimisagara, KG 123",
    startDate: "2024-04-10",
    endDate: "2024-04-13",
    color: "bg-yellow-400"
  },
  {
    id: 3,
    customer: "Bob Smith",
    mobileNumber: "(250) 780-789012",
    email: "bob.smith@gmail.com",
    location: "Nyamirambo, Kigali",
    vehicle: "BMW X5 2020",
    pickupTime: "Apr 10, 2024, 14:00",
    pickupLocation: "Nyamirambo, NY 456",
    returnTime: "Apr 11, 2024, 12:00",
    returnLocation: "Nyamirambo, NY 456",
    startDate: "2024-04-10",
    endDate: "2024-04-11",
    color: "bg-green-400"
  },
  {
    id: 4,
    customer: "Carol Davis",
    mobileNumber: "(250) 780-345678",
    email: "carol.davis@gmail.com",
    location: "Gikondo, Kigali",
    vehicle: "Mercedes C-Class 2021",
    pickupTime: "Apr 13, 2024, 08:00",
    pickupLocation: "Gikondo, GK 789",
    returnTime: "Apr 15, 2024, 20:00",
    returnLocation: "Gikondo, GK 789",
    startDate: "2024-04-13",
    endDate: "2024-04-15",
    color: "bg-red-400"
  },
  {
    id: 5,
    customer: "David Wilson",
    mobileNumber: "(250) 780-901234",
    email: "david.wilson@gmail.com",
    location: "Kacyiru, Kigali",
    vehicle: "Audi A4 2022",
    pickupTime: "May 5, 2024, 10:00",
    pickupLocation: "Kacyiru, KK ST 45",
    returnTime: "May 8, 2024, 18:00",
    returnLocation: "Kacyiru, KK ST 45",
    startDate: "2024-05-05",
    endDate: "2024-05-08",
    color: "bg-purple-400"
  },
  {
    id: 6,
    customer: "Eva Brown",
    mobileNumber: "(250) 780-567890",
    email: "eva.brown@gmail.com",
    location: "Remera, Kigali",
    vehicle: "Nissan Altima 2021",
    pickupTime: "May 15, 2024, 14:30",
    pickupLocation: "Remera, RM 67",
    returnTime: "May 18, 2024, 12:00",
    returnLocation: "Remera, RM 67",
    startDate: "2024-05-15",
    endDate: "2024-05-18",
    color: "bg-indigo-400"
  },
  {
    id: 7,
    customer: "Frank Miller",
    mobileNumber: "(250) 780-234567",
    email: "frank.miller@gmail.com",
    location: "Kimisagara, Kigali",
    vehicle: "Hyundai Elantra 2020",
    pickupTime: "Jun 2, 2024, 09:00",
    pickupLocation: "Kimisagara, KG 89",
    returnTime: "Jun 5, 2024, 17:00",
    returnLocation: "Kimisagara, KG 89",
    startDate: "2024-06-02",
    endDate: "2024-06-05",
    color: "bg-pink-400"
  },
  {
    id: 8,
    customer: "Grace Taylor",
    mobileNumber: "(250) 780-890123",
    email: "grace.taylor@gmail.com",
    location: "Nyamirambo, Kigali",
    vehicle: "Volkswagen Jetta 2021",
    pickupTime: "Jun 20, 2024, 11:00",
    pickupLocation: "Nyamirambo, NY 12",
    returnTime: "Jun 23, 2024, 19:00",
    returnLocation: "Nyamirambo, NY 12",
    startDate: "2024-06-20",
    endDate: "2024-06-23",
    color: "bg-teal-400"
  }
];

export default function BookingContent() {
  const [selectedBooking, setSelectedBooking] = useState(mockBookings[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date("2024-04-01"));
  const [viewMode, setViewMode] = useState<'single' | 'double' | 'triple'>('double');

  // Generate month dates
  const getMonthDates = (startDate: Date) => {
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get the first day of the week (Sunday = 0)
    const startDay = firstDay.getDay();

    // Calculate how many days to show (including previous month's trailing days)
    const daysInMonth = lastDay.getDate();
    const totalDays = Math.ceil((startDay + daysInMonth) / 7) * 7;

    const dates = [];
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(year, month, i - startDay + 1);
      dates.push(date);
    }
    return dates;
  };

  // Generate multiple months
  const getMultipleMonths = (startDate: Date, count: number) => {
    const months = [];
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

  // Format date for display (keeping for potential future use)
  // const formatDate = (date: Date) => {
  //   return date.toLocaleDateString('en-US', { 
  //     day: '2-digit', 
  //     month: 'short' 
  //   });
  // };

  // Format date range
  const formatDateRange = () => {
    if (months.length === 1) {
      return months[0].monthName;
    } else {
      const start = months[0].monthName;
      const end = months[months.length - 1].monthName;
      return `${start} - ${end}`;
    }
  };

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    const increment = viewMode === 'single' ? 1 : viewMode === 'double' ? 2 : 3;
    newDate.setMonth(currentMonth.getMonth() + (direction === 'next' ? increment : -increment));
    setCurrentMonth(newDate);
  };

  // Check if booking is in a specific month
  const isBookingInMonth = (booking: typeof mockBookings[0], monthDates: Date[]) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    return monthDates.some(date =>
      date >= startDate && date <= endDate
    );
  };

  // Get bookings for a specific month
  const getBookingsForMonth = (monthDates: Date[]) => {
    return mockBookings.filter(booking => isBookingInMonth(booking, monthDates));
  };

  // Calculate booking position within a month (keeping for potential future use)
  // const getBookingPosition = (booking: typeof mockBookings[0], monthDates: Date[]) => {
  //   const startDate = new Date(booking.startDate);
  //   const endDate = new Date(booking.endDate);

  //   const startIndex = monthDates.findIndex(date => 
  //     date.toDateString() === startDate.toDateString()
  //   );
  //   const endIndex = monthDates.findIndex(date => 
  //     date.toDateString() === endDate.toDateString()
  //   );

  //   if (startIndex === -1 || endIndex === -1) return null;

  //   const row = Math.floor(startIndex / 7);
  //   const col = startIndex % 7;
  //   const width = Math.min(endIndex - startIndex + 1, 7 - col);

  //   return {
  //     row,
  //     col,
  //     width,
  //     display: 'block'
  //   };
  // };

  return (
    <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
      <div className="max-w-5xl mx-auto h-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

          {/* Calendar Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Date Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-lg font-semibold text-gray-900">
                  {formatDateRange()}
                </span>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('single')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'single'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  1 Month
                </button>
                <button
                  onClick={() => setViewMode('double')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'double'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  2 Months
                </button>
                <button
                  onClick={() => setViewMode('triple')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'triple'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  3 Months
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Multi-Month Calendar Grid */}
            <div className={`grid gap-6 ${viewMode === 'single' ? 'grid-cols-1' : viewMode === 'double' ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {months.map((month, monthIndex) => (
                <div key={monthIndex} className="bg-gray-50 rounded-lg p-4">
                  {/* Month Header */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {month.monthName}
                    </h3>
                  </div>

                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center">
                        <div className="text-xs font-medium text-gray-600 py-1">
                          {day}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {month.dates.map((date, dayIndex) => {
                      const isCurrentMonth = date.getMonth() === month.date.getMonth();
                      const isToday = date.toDateString() === new Date().toDateString();
                      const dayBookings = getBookingsForMonth([date]);

                      return (
                        <div
                          key={dayIndex}
                          className={`min-h-[40px] p-1 border border-gray-200 ${isCurrentMonth
                              ? 'bg-white'
                              : 'bg-gray-100 text-gray-400'
                            } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
                        >
                          <div className={`text-xs font-medium ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                            } ${isToday ? 'text-blue-600 font-bold' : ''}`}>
                            {date.getDate()}
                          </div>

                          {/* Booking indicators */}
                          {dayBookings.length > 0 && (
                            <div className="mt-1 space-y-1">
                              {dayBookings.slice(0, 2).map((booking) => (
                                <div
                                  key={booking.id}
                                  className={`h-2 ${booking.color} rounded cursor-pointer hover:opacity-80 transition-opacity`}
                                  onClick={() => setSelectedBooking(booking)}
                                  title={`${booking.customer} - ${booking.vehicle}`}
                                />
                              ))}
                              {dayBookings.length > 2 && (
                                <div className="text-xs text-gray-500 text-center">
                                  +{dayBookings.length - 2}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Details Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
              {/* User Profile */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {selectedBooking.customer.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {selectedBooking.customer}
                </h3>
                <p className="text-sm text-gray-500">Booker</p>
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Mobile Number</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedBooking.mobileNumber}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedBooking.email}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Location</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedBooking.location}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Booked Vehicle</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedBooking.vehicle}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Pick-up Time</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedBooking.pickupTime}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Pick-up Location</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedBooking.pickupLocation}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Return Time</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedBooking.returnTime}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Return Location</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedBooking.returnLocation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
