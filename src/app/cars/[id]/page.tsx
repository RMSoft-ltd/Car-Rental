"use client";

import React, { useMemo } from "react";
import {
  ArrowLeft,
  Users,
  Clock,
  Settings,
  User,
  Info,
  Share2,
  Heart,
  Briefcase,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCarListing } from "@/hooks/use-car-list";
import { baseUrl } from "@/lib/api";
import { Car as CarListing } from "@/types/car-listing";

const toAbsoluteImage = (path?: string) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${baseUrl ?? ""}${path}`;
};

const buildFeatureCategories = (car: CarListing) => {
  const groups = [
    {
      title: "Interior",
      items: [
        { label: "Air Conditioner", flag: car.isAirConditioner },
        { label: "Digital Odometer", flag: car.isDigitalOdometer },
        { label: "Leather Seats", flag: car.isLeatherSeats },
        { label: "Heater", flag: car.isHeater },
        { label: "Techometer", flag: car.Techometer }
      ]
    },
    {
      title: "Exterior",
      items: [
        { label: "Fog Lights Front", flag: car.isFogLightsFront },
        { label: "Rain Sensing Wipe", flag: car.isRainSensingWipe },
        { label: "Rear Spoiler", flag: car.isRearSpoiler },
        { label: "Sun Roof", flag: car.isSunRoof }
      ]
    },
    {
      title: "Safety",
      items: [
        { label: "Brake Assist", flag: car.isBreakeAssist },
        { label: "Child Safety Locks", flag: car.isChildSafetyLocks },
        { label: "Traction Control", flag: car.isTractionControl },
        { label: "Power Door Locks", flag: car.isPowerDoorLocks },
        { label: "Driver Air Bag", flag: car.isDriverAirBag }
      ]
    },
    {
      title: "Comfort & Convenience",
      items: [
        { label: "Power Steering", flag: car.isPowerSteering },
        { label: "Vanity Mirror", flag: car.isVanityMirror },
        { label: "Trunk Light", flag: car.isTrunkLight }
      ]
    }
  ];

  return groups
    .map((group) => ({
      title: group.title,
      items: group.items.filter((item) => item.flag).map((item) => item.label)
    }))
    .filter((group) => group.items.length > 0);
};

const buildCarSpecs = (car: CarListing) => [
  { label: "Body", value: car.body ?? "—" },
  {
    label: "Mileage",
    value:
      typeof car.mileage === "number"
        ? `${car.mileage.toLocaleString()} Miles`
        : "—"
  },
  { label: "Fuel Type", value: car.fuelType ?? "—" },
  { label: "Year", value: car.year?.toString() ?? "—" },
  { label: "Transmission", value: car.transition ?? "—" },
  { label: "Driver Type", value: car.driverType ?? "—" },
  {
    label: "Engine Size",
    value:
      typeof car.engineSize === "number" ? `${car.engineSize}L` : "—"
  },
  {
    label: "Doors",
    value: typeof car.doors === "number" ? `${car.doors}-door` : "—"
  },
  {
    label: "Cylinders",
    value:
      typeof car.cylinders === "number" ? `${car.cylinders}` : "—"
  },
  { label: "Interior Color", value: car.color ?? "—" }
];

const getHostDisplay = (car?: CarListing | null) => {
  const hostName = car?.owner
    ? `${car.owner.fName ?? ""} ${car.owner.lName ?? ""}`.trim()
    : "Host";
  const reviews = car?.reviews ?? [];
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? (
          reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) /
          reviewCount
        ).toFixed(1)
      : "9.3";

  return {
    hostName: hostName || "Host",
    reviewCount,
    rating: avgRating
  };
};

export default function CarDetailPage() {
  const params = useParams();
  const carIdParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const carId = Number(carIdParam);

  const { data: car, isLoading, error } = useCarListing(
    Number.isNaN(carId) ? 0 : carId
  );

  const featureCategories = useMemo(
    () => (car ? buildFeatureCategories(car) : []),
    [car]
  );

  const carSpecs = useMemo(() => (car ? buildCarSpecs(car) : []), [car]);
  const hostDisplay = useMemo(() => getHostDisplay(car), [car]);

  const heroImage = toAbsoluteImage(car?.carImages?.[0]);
  const galleryImages =
    car?.carImages
      ?.slice(1)
      .map((img) => toAbsoluteImage(img))
      .filter((img): img is string => Boolean(img)) ?? [];

  const pricePerDay = car?.pricePerDay;
  const currency = car?.currency ?? "RWF";
  const totalForSixDays =
    typeof pricePerDay === "number" ? pricePerDay * 6 : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading car details...
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Unable to load car details.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Search
            </Link>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <Heart className="w-5 h-5 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 px-6 py-5">
          <div className="space-y-2">
            <div>
              <h1 className="text-[28px] font-semibold text-gray-900">
                {car.make} {car.model} {car.year}
              </h1>
              <p className="text-gray-500 text-sm">{car.title}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                {car.seats ?? "—"} Seats
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                {car.mileage
                  ? `${car.mileage.toLocaleString()} km mileage`
                  : "Mileage N/A"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500" />
                {car.transition ?? "—"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                {car.driverType ?? "Driver info"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                {car.color ?? "Color"}
              </span>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={`${car.make} ${car.model}`}
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No image available
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {galleryImages.length ? (
              galleryImages.map((img, index) => (
                <div
                  key={`${img}-${index}`}
                  className="aspect-video rounded-lg overflow-hidden bg-gray-100"
                >
                  <Image
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-2 h-full rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                No additional images
              </div>
            )}
          </div>
        </section>

        {/* Details */}
        <section className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {hostDisplay?.hostName ?? "Host"}
                  </h3>
                  <p className="text-sm text-gray-500">Host</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-black text-white px-3 py-1 rounded text-sm font-medium">
                  <span className="text-lg font-bold">
                    {hostDisplay?.rating ?? "—"}
                  </span>{" "}
                  OK
                </div>
                <span className="text-sm text-gray-500">
                  ({hostDisplay?.reviewCount ?? 0} reviews)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4">
              {carSpecs.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center justify-between border-b border-gray-100 pb-3"
                >
                  <span className="text-sm text-gray-500">{detail.label}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-2 gap-6">
                {featureCategories.length ? (
                  featureCategories.map((category) => (
                    <div key={category.title}>
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">
                        {category.title}
                      </p>
                      <div className="space-y-2 text-sm text-gray-800">
                        {category.items.map((item) => (
                          <div key={item} className="flex items-center gap-3">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white">
                              <CheckCircle2 className="w-4 h-4 text-black" />
                            </span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No feature information provided.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              {typeof totalForSixDays === "number" && (
                <p className="text-sm text-gray-500">
                  <span className="text-gray-900 font-semibold">
                    {totalForSixDays.toLocaleString()} {currency}
                  </span>{" "}
                  for 6 days
                </p>
              )}

              <div className="flex items-center rounded-2xl border border-gray-900 px-5 py-4 text-sm font-semibold text-gray-900">
                <div className="flex-1">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    Pick-up Date
                  </p>
                  <p className="text-lg text-gray-900">8/8/2025</p>
                </div>
                <div className="mx-4 h-10 w-px bg-gray-200" />
                <div className="flex-1 text-right">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    Drop-off Date
                  </p>
                  <p className="text-lg text-gray-900">8/20/2025</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Rental Price breakdown</p>
                <div className="flex items-center justify-between">
                  <span>Car Rental</span>
                  <span className="text-gray-900">
                    {typeof pricePerDay === "number"
                      ? `${pricePerDay.toLocaleString()} ${currency}`
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between font-semibold text-gray-900">
                  <span>Total Amount</span>
                  <span>
                    {typeof pricePerDay === "number"
                      ? `${pricePerDay.toLocaleString()} ${currency}`
                      : "—"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Free cancellation</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button className="rounded-2xl border border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-white transition-colors">
                  Add To Cart
                </button>
                <Link
                  href="/booking"
                  className="rounded-2xl bg-black px-6 py-3 text-center text-sm font-semibold text-white hover:bg-gray-900 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
