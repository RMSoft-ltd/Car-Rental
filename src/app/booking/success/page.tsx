import Link from "next/link";
import { Check } from "lucide-react";
import { FiMail, FiPhone } from "react-icons/fi";
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa";

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-[#e5e5e7] py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <section className="rounded-[32px] bg-white px-8 py-16 text-center shadow-sm border border-gray-100 space-y-6">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-gray-900">
            <Check className="w-10 h-10 text-gray-900" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900">Your Booking Was Successful</h1>
            <p className="text-sm text-gray-500">
              Congratulations! You have successfully booked Toyota Corolla 2018
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-black px-16 py-4 text-white font-medium text-sm gap-2"
          >
            Back Home →
          </Link>
        </section>

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

