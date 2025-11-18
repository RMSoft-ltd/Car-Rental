"use client";

import { Info } from "lucide-react";

export default function BookingLegend() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">Calendar Guide</h3>
          <p className="text-xs text-gray-600">Understand the booking indicators</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Booking Status Colors */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Booking Status</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-2.5 bg-emerald-500 rounded-full shadow-sm"></div>
              <span className="text-xs text-gray-700 font-medium">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-2.5 bg-amber-500 rounded-full shadow-sm"></div>
              <span className="text-xs text-gray-700 font-medium">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-2.5 bg-blue-500 rounded-full shadow-sm"></div>
              <span className="text-xs text-gray-700 font-medium">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-2.5 bg-violet-500 rounded-full shadow-sm"></div>
              <span className="text-xs text-gray-700 font-medium">Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-2.5 bg-red-500 rounded-full shadow-sm"></div>
              <span className="text-xs text-gray-700 font-medium">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Multiple Bookings */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Multiple Bookings</p>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="flex gap-0.5 mt-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-sm"></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full shadow-sm"></div>
              </div>
              <span className="text-xs text-gray-700 leading-relaxed">
                Small colored dots show additional bookings on the same day
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 shadow-sm"></div>
              <span className="text-xs text-gray-700 leading-relaxed">
                Gray dot indicates 4 or more bookings
              </span>
            </div>
          </div>
        </div>

        {/* Today & Interaction */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">How to Use</p>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-9 h-9 bg-blue-50 border-2 border-blue-300 rounded-lg flex items-center justify-center flex-shrink-0 ring-2 ring-blue-100">
                <span className="text-xs font-bold text-blue-600">18</span>
              </div>
              <span className="text-xs text-gray-700 leading-relaxed">
                Blue highlight shows today&apos;s date
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-9 h-2.5 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full flex-shrink-0 shadow-sm"></div>
              <span className="text-xs text-gray-700 leading-relaxed">
                Click any booking bar to view full details
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}