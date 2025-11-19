"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Gauge,
  Settings,
  Briefcase,
  Luggage,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa";
import { FiPhone, FiMail } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { Car as CarListing } from "@/types/car-listing";
import { BookedItem } from "@/types/cart";
import { usePayment } from "@/hooks/use-cart-items";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/shared/ToastProvider";

type SummaryStat = {
  label: string;
  icon: LucideIcon;
};

type PaymentOption = {
  label: string;
  value: string;
  type: "mobile" | "card";
};

const PAYMENT_OPTIONS: PaymentOption[] = [
  { label: "MTN Mobile Money", value: "mtn-mobile-money", type: "mobile" },
  { label: "Airtel Money", value: "airtel-money", type: "mobile" },
  { label: "Visa Card", value: "visa-card", type: "card" },
  { label: "Master Card", value: "master-card", type: "card" },
];

interface CachedUserDetails {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

interface DirectBookingSession {
  bookingGroupId: string | null;
  bookedItems: BookedItem[];
  car: CarListing | null;
  dates: {
    pickUpDate: string;
    dropOffDate: string;
  };
  totals?: {
    currency?: string;
    pricePerDay?: number | null;
    totalAmount?: number | null;
    rentalDays?: number;
  };
  user: CachedUserDetails | null;
}

const formatDateDisplay = (iso?: string) => {
  if (!iso) return "Select date";
  const date = new Date(iso + "T00:00:00");
  if (Number.isNaN(date.getTime())) return "Select date";
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${weekday}, ${month} ${day}, ${year}`;
};

export default function BookingRequestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const { mutate: processPayment, isPending: isProcessingPayment } = usePayment();
  const [bookingData, setBookingData] = useState<DirectBookingSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption>(PAYMENT_OPTIONS[0]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cached = sessionStorage.getItem("directBooking");
    if (cached) {
      try {
        setBookingData(JSON.parse(cached));
      } catch (error) {
        console.error("Failed to parse booking cache", error);
      }
    }
    setIsLoading(false);
  }, []);

  const activeUser = useMemo(() => {
    if (user) {
      const displayName = `${user.fName ?? ""} ${user.lName ?? ""}`.trim() || user.email;
      return {
        id: user.id,
        name: displayName,
        email: user.email,
        phone: user.phone,
      };
    }
    return bookingData?.user ?? null;
  }, [user, bookingData]);

  const carSummary = useMemo(() => {
    const car = bookingData?.car;
    const stats: SummaryStat[] = [];
    if (car?.seats) {
      stats.push({ label: `${car.seats} Seats`, icon: Users });
    }
    if (car?.mileage) {
      stats.push({ label: `${car.mileage.toLocaleString()} km per rental`, icon: Gauge });
    }
    if (car?.transition) {
      stats.push({ label: car.transition, icon: Settings });
    }
    if (car?.driverType) {
      stats.push({ label: car.driverType, icon: Briefcase });
    }
    if (car?.color) {
      stats.push({ label: `${car.color} exterior`, icon: Luggage });
    }

    return {
      title: car ? `${car.make} ${car.model} ${car.year ?? ""}`.trim() : "No car selected",
      subtitle: car?.title ?? "Choose a car to start a booking.",
      stats,
    };
  }, [bookingData?.car]);

  const bookingFields = useMemo(
    () => [
  {
    label: "Pickup Location",
        value: bookingData?.car?.pickUpLocation ?? "Kigali International Airport",
    icon: MapPin,
        type: "text",
      },
      {
        label: "Pickup Date",
        value: formatDateDisplay(bookingData?.dates?.pickUpDate),
        icon: CalendarDays,
        type: "text",
  },
  {
    label: "Drop-off Location",
        value: bookingData?.car?.pickUpLocation ?? "Kigali International Airport",
    icon: MapPin,
        type: "text",
      },
      {
        label: "Drop-off Date",
        value: formatDateDisplay(bookingData?.dates?.dropOffDate),
        icon: CalendarDays,
        type: "text",
      },
    ],
    [bookingData]
  );

  const customerDetails = [
    { label: "Name", value: activeUser?.name ?? "" },
    { label: "Email", value: activeUser?.email ?? "" },
  ];

  const primaryBooking = bookingData?.bookedItems?.[0];
  const totals = bookingData?.totals;
  const totalDisplay = totals?.totalAmount ?? primaryBooking?.totalAmount;
  const currencyDisplay = totals?.currency ?? bookingData?.car?.currency ?? "RWF";
  const rentalDaysDisplay = totals?.rentalDays ?? primaryBooking?.totalDays;
  const bookingGroupId = primaryBooking?.bookingGroupId ?? bookingData?.bookingGroupId;

  // Phone number validation helper (from checkout page)
  const getValidationInfo = (methodValue: string) => {
    let regex = /^\d{9}$/; // Default
    let prefixes = ["72", "73", "78", "79"];
    let placeholder = "7x/7x/7x/7x xxxxxxx";
    let title = "Enter a 9-digit number starting with 72, 73, 78, or 79.";

    if (methodValue === "mtn-mobile-money") {
      // MTN numbers must start with 78 or 79
      regex = /^(78|79)[0-9]{7}$/;
      prefixes = ["78", "79"];
      placeholder = "78xxxxxxx or 79xxxxxxx";
      title = "Enter your 9-digit MTN number (must start with 78 or 79).";
    } else if (methodValue === "airtel-money") {
      // Airtel numbers must start with 72 or 73
      regex = /^(72|73)[0-9]{7}$/;
      prefixes = ["72", "73"];
      placeholder = "72xxxxxxx or 73xxxxxxx";
      title = "Enter your 9-digit Airtel number (must start with 72 or 73).";
    }

    return { regex, prefixes, placeholder, title };
  };

  const handleBookNow = () => {
    if (!bookingGroupId) {
      toast.error("Payment unavailable", "Booking information is missing.");
      return;
    }

    if (selectedPayment.type === "mobile") {
      const validationInfo = getValidationInfo(selectedPayment.value);
      const { regex } = validationInfo;

      if (!mobileNumber || !regex.test(mobileNumber)) {
        toast.error("Invalid phone number", "Please enter a valid 9-digit phone number.");
        return;
      }

      const fullPhoneNumber = `250${mobileNumber}`;
      processPayment(
        {
          bookingGroupId,
          paymentData: { mobilephone: fullPhoneNumber },
        },
        {
          onSuccess: () => {
            toast.success("Payment processed", "Redirecting to your bookings...");
            router.push("/dashboard/history");
          },
          onError: (error: unknown) => {
            const message =
              error instanceof Error
                ? error.message
                : "Payment failed. Please try again.";
            toast.error("Payment failed", message);
          },
        }
      );
    } else {
      // Card payment - validate card details
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        toast.error("Invalid card details", "Please fill in all card information.");
        return;
      }
      // For card payments, we might need a different API endpoint
      // For now, we'll use the same endpoint with card details
      // You may need to adjust this based on your backend API
      toast.info("Card payment", "Card payment processing is not yet implemented.");
    }
  };

  const renderPaymentFields = () => {
    if (selectedPayment.type === "mobile") {
      const validationInfo = getValidationInfo(selectedPayment.value);
      const { regex, prefixes, placeholder, title } = validationInfo;

      return (
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Phone Number
          </label>
          <div className="flex items-center">
            <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-gray-600 text-sm">
              +250
            </span>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");

                // Check if the current input starts with an ALLOWED prefix
                const startsWithAllowedPrefix = prefixes.some((p) =>
                  digits.startsWith(p)
                );

                // Handle input based on length and allowed prefixes
                if (digits.length <= 9) {
                  if (digits.length <= 2) {
                    // Allow initial typing of single digits (e.g., 7) or valid two-digit prefixes (e.g., 78)
                    const isTypingValidPrefix = prefixes.some((p) =>
                      p.startsWith(digits)
                    );

                    if (isTypingValidPrefix || digits.length === 0) {
                      setMobileNumber(digits);
                    }
                  } else if (startsWithAllowedPrefix) {
                    // Allow typing up to 9 digits if a valid prefix is fully entered
                    setMobileNumber(digits);
                  }
                }
              }}
              onFocus={() => {
                if (!mobileNumber) {
                  setMobileNumber("");
                }
              }}
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm text-gray-900"
              required
              pattern={regex.source}
              title={title}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter your <strong>9-digit number</strong> without +250 prefix.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Card Number
          </label>
          <input
            type="text"
            value={cardDetails.number}
            onChange={(event) => setCardDetails((prev) => ({ ...prev, number: event.target.value }))}
            placeholder="1234 5678 9012 3456"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Expiry
          </label>
          <input
            type="text"
            value={cardDetails.expiry}
            onChange={(event) => setCardDetails((prev) => ({ ...prev, expiry: event.target.value }))}
            placeholder="MM/YY"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            CVV
          </label>
          <input
            type="password"
            value={cardDetails.cvv}
            onChange={(event) => setCardDetails((prev) => ({ ...prev, cvv: event.target.value }))}
            placeholder="123"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#e5e5e7] flex items-center justify-center text-gray-600">
        Loading booking details...
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-[#e5e5e7] flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">No booking found</h2>
          <p className="text-gray-600">
            Please select a car and complete the booking steps to see payment options.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            Browse Cars
          </Link>
        </div>
      </div>
    );
  }

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
              {carSummary.stats.length ? (
                carSummary.stats.map((stat) => (
                <div key={stat.label} className="inline-flex items-center gap-2 text-gray-600">
                  <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-gray-600" />
                  </span>
                  <span className="text-base">{stat.label}</span>
                </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No additional specs provided.</p>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Booking form */}
        <section className="rounded-[32px] bg-white p-8 shadow-sm border border-gray-100 space-y-8">
          <div className="space-y-2">
            <h2 className="text-[28px] font-semibold text-gray-900">Request for Booking</h2>
            <p className="text-sm text-gray-500">
              Review your trip details, choose how you want to pay, and confirm the booking.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-5 flex flex-wrap gap-4 items-center justify-between text-sm text-gray-600">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Total Amount</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalDisplay ? `${totalDisplay.toLocaleString()} ${currencyDisplay}` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Rental Length</p>
              <p className="text-lg font-semibold text-gray-900">
                {rentalDaysDisplay ? `${rentalDaysDisplay} ${rentalDaysDisplay === 1 ? "day" : "days"}` : "—"}
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {bookingFields.map((field) => (
              <div key={field.label} className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {field.label}
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <field.icon className="w-4 h-4 text-gray-400 mr-3" />
                    <input
                      type="text"
                    value={field.value}
                    readOnly
                    className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                    />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">Payment Method</p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              {PAYMENT_OPTIONS.map((option) => (
                <label key={option.value} className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={selectedPayment.value === option.value}
                    onChange={() => setSelectedPayment(option)}
                    className="accent-black text-black focus:ring-black"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {renderPaymentFields()}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Customer Details</p>
            <div className="grid gap-4 md:grid-cols-2">
              {customerDetails.map((detail) => (
                <div key={detail.label}>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 block mb-1">
                    {detail.label}
                  </label>
                  <input
                    type="text"
                    value={detail.value}
                    readOnly
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:outline-none shadow-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleBookNow}
            className="w-full rounded-2xl bg-black py-4 text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!bookingData || isProcessingPayment}
          >
            {isProcessingPayment ? "Processing Payment..." : "Book Now"} <ArrowRight className="w-4 h-4" />
          </button>
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

