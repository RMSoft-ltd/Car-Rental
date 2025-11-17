import React from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Clock, Users, Gauge, Settings, Briefcase, Luggage, ArrowRight } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa";
import { FiPhone, FiMail } from "react-icons/fi";

const carSummary = {
  title: "Toyota Corolla 2018",
  subtitle: "2.0 D5 Power Pulse Momentum 5dr AWD Geartronic Estate",
  stats: [
    { label: "5 Seats", icon: Users },
    { label: "450 km per rental", icon: Gauge },
    { label: "Automatic", icon: Settings },
    { label: "1 Large bag", icon: Briefcase },
    { label: "1 Small bag", icon: Luggage }
  ]
};

const paymentMethods = ["MTN Mobile Money", "Airtel Money", "Visa Card", "Master Card"];

const customerDetails = [
  { label: "Name", value: "Benny Chrispin" },
  { label: "Email", value: "ndizibaidu23@gmail.com" },
  { label: "Phone Number", value: "(250) 780-003-842" },
  { label: "Address", value: "KG 234 ST" }
];

const bookingFields = [
  {
    label: "Pickup Location",
    value: "KG 234 ST",
    icon: MapPin,
    type: "select"
  },
  {
    label: "Pickup Date & Time",
    value: "24 April, 2024, 10:30",
    icon: CalendarDays
  },
  {
    label: "Drop-off Location",
    value: "KG 34 ST",
    icon: MapPin,
    type: "select"
  },
  {
    label: "Drop-off Date & Time",
    value: "28 April, 2024, 21:30",
    icon: Clock
  }
];

export default function BookingRequestPage() {
  return (
    <div className="min-h-screen bg-[#e5e5e7] py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Section 1: Car summary */}
        <section className="rounded-[32px] bg-white p-8 shadow-md border border-gray-100">
          <div className="space-y-4">
            <div>
              <h1 className="text-[32px] font-semibold text-gray-900 tracking-tight">{carSummary.title}</h1>
              <p className="text-gray-500">{carSummary.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-gray-600">
              {carSummary.stats.map((stat) => (
                <div key={stat.label} className="inline-flex items-center gap-2 text-gray-600">
                  <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-gray-600" />
                  </span>
                  <span className="text-base">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Booking form */}
        <section className="rounded-[32px] bg-white p-8 shadow-sm border border-gray-100 space-y-8">
          <div>
            <h2 className="text-[28px] font-semibold text-gray-900">Request for Booking</h2>
            <p className="text-sm text-gray-500">Enter your information for the booking .</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {bookingFields.map((field) => (
              <div key={field.label}>
                <div className="flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <field.icon className="w-4 h-4 text-gray-400 mr-3" />
                  {field.type === "select" ? (
                    <select className="w-full bg-transparent focus:outline-none text-sm text-gray-800">
                      <option>{field.label}</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={field.value}
                      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none placeholder:text-gray-900"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">Payment Method</p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              {paymentMethods.map((method, index) => (
                <label key={method} className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked={index === 0} className="text-black focus:ring-black" />
                  {method}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Customer Details</p>
            <div className="grid gap-4 md:grid-cols-2">
              {customerDetails.map((detail) => (
                <div key={detail.label}>
                  <input
                    type="text"
                    placeholder={detail.value}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-900 focus:outline-none shadow-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/booking/success"
            className="w-full rounded-2xl bg-black py-4 text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2"
          >
            Book Now <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Section 3: Footer */}
        <footer className="rounded-[32px] bg-white p-10 shadow-sm border border-gray-100 grid gap-8 md:grid-cols-4 text-sm text-gray-600">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Car Rental Hub</h3>
            <p>Discover car rental options in Rwanda with Rent a care select from a range of car options and local specials.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Quick Links</h4>
            <p>Cars</p>
            <p>About us</p>
            <p>Help Center</p>
            <p>Terms &amp; Condition</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Quick Links</h4>
            <p className="flex items-center gap-2 text-gray-700">
              <FiPhone className="w-4 h-4" /> (+250)000-000-039
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <FiMail className="w-4 h-4" /> carental-support@gmail.com
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Social Media Links</h4>
            <div className="flex items-center gap-3 text-white">
              <span className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <FaFacebookF className="w-3.5 h-3.5" />
              </span>
              <span className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <FaLinkedinIn className="w-3.5 h-3.5" />
              </span>
              <span className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <FaYoutube className="w-3.5 h-3.5" />
              </span>
              <span className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <FaInstagram className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
          <div className="col-span-full border-t border-gray-200 pt-4 text-center text-xs text-gray-400">
            © 2025 Car Rental. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

