"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Users,
  Clock,
  Settings,
  User,
  Share2,
  Heart,
  Briefcase,
  CheckCircle2,
  Star
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCarListing } from "@/hooks/use-car-list";
import { baseUrl } from "@/lib/api";
import { Car as CarListing } from "@/types/car-listing";
import { BookedItem } from "@/types/cart";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/app/shared/ToastProvider";
import { useMutation } from "@tanstack/react-query";
import { bookCarNow } from "@/services/cart-service";
import { AxiosError } from "axios";
import { useAddToCart } from "@/hooks/use-cart-items";

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
        { label: "Leather Seats", flag: car.isLeatherSeats },
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

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Recently";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 }
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
};

const renderRatingStars = (rating?: number) => {
  const normalized = Math.round(Number.isFinite(rating ?? NaN) ? rating ?? 0 : 0);
  return Array.from({ length: 5 }, (_, index) => {
    const active = index < normalized;
    return (
      <Star
        key={`review-star-${index}`}
        className={`h-4 w-4 ${active ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
      />
    );
  });
};

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
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const carIdParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const carId = Number(carIdParam);

  const { data: car, isLoading, error } = useCarListing(
    Number.isNaN(carId) ? 0 : carId
  );

  const [pickUpDate, setPickUpDate] = useState<string>("");
  const [dropOffDate, setDropOffDate] = useState<string>("");
  const pickUpInputRef = useRef<HTMLInputElement | null>(null);
  const dropOffInputRef = useRef<HTMLInputElement | null>(null);

  const getTodayIso = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getNextDayIso = (iso: string) => {
    const date = new Date(iso + "T00:00:00");
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const todayIso = getTodayIso();
    setPickUpDate(todayIso);
    setDropOffDate(todayIso);
  }, []);

  const featureCategories = useMemo(
    () => (car ? buildFeatureCategories(car) : []),
    [car]
  );

  const carSpecs = useMemo(() => (car ? buildCarSpecs(car) : []), [car]);
  const hostDisplay = useMemo(() => getHostDisplay(car), [car]);
  const reviews = car?.reviews ?? [];

  const heroImage = toAbsoluteImage(car?.carImages?.[0]);
  const galleryImages =
    car?.carImages
      ?.slice(1)
      .map((img) => toAbsoluteImage(img))
      .filter((img): img is string => Boolean(img)) ?? [];

  const pricePerDay = car?.pricePerDay;
  const currency = car?.currency ?? "RWF";
  const totalForOneDay =
    typeof pricePerDay === "number" ? pricePerDay * 1 : null;
  const bookingDates = useMemo(() => {
    const formatDisplayDate = (iso: string) =>
      iso
        ? new Date(iso).toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
        })
        : "";

    return {
      pickUpDateLabel: formatDisplayDate(pickUpDate),
      dropOffDateLabel: formatDisplayDate(dropOffDate),
      payload: {
        pickUpDate,
        dropOffDate,
      },
    };
  }, [pickUpDate, dropOffDate]);

  const dropOffMinDate = pickUpDate || getTodayIso();

  const rentalDays =
    pickUpDate && dropOffDate
      ? Math.max(
        1,
        Math.ceil(
          (new Date(dropOffDate + "T00:00:00").getTime() -
            new Date(pickUpDate + "T00:00:00").getTime()) /
          (1000 * 60 * 60 * 24)
        ) + 1
      )
      : 1;

  const totalSelectedAmount =
    typeof pricePerDay === "number" && pickUpDate && dropOffDate
      ? pricePerDay * rentalDays
      : totalForOneDay;

  const cacheDirectBookingContext = (bookedItems: BookedItem[]) => {
    if (typeof window === "undefined" || !bookedItems?.length || !car) {
      return;
    }
    try {
      const payload = {
        bookingGroupId: bookedItems[0]?.bookingGroupId ?? null,
        bookedItems,
        car,
        dates: bookingDates.payload,
        totals: {
          currency,
          pricePerDay: pricePerDay ?? null,
          totalAmount: totalSelectedAmount ?? null,
          rentalDays,
        },
        user: user
          ? {
              id: user.id,
              name:
                `${user.fName ?? ""} ${user.lName ?? ""}`.trim() || user.email,
              email: user.email,
              phone: user.phone,
            }
          : null,
      };
      sessionStorage.setItem("directBooking", JSON.stringify(payload));
    } catch (error) {
      console.error("Failed to cache booking context", error);
    }
  };

  const { mutate: addToCartMutation, isPending: isAddingToCart } = useAddToCart(
    user?.id ?? 0
  );

  const bookingMutation = useMutation<BookedItem[]>({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be signed in to book a car.");
      }
      if (!car?.id) {
        throw new Error("Car information is missing.");
      }
      return bookCarNow(user.id, car.id, bookingDates.payload);
    },
    onSuccess: (bookedItems) => {
      cacheDirectBookingContext(bookedItems ?? []);
      toast.success("Booking created", "Redirecting to checkout...");
      router.push("/booking");
    },
    onError: (error: unknown) => {
      let message = "Something went wrong while booking this car.";
      if (error instanceof AxiosError) {
        message =
          (error.response?.data as { message?: string })?.message ??
          error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error("Booking failed", message);
    },
  });

  const handleBookNow = () => {
    if (!user) {
      toast.info("Sign in required", "Please sign in to book this car.");
      router.push("/login");
      return;
    }
    if (!car?.id) {
      toast.error("Booking unavailable", "Car information is missing.");
      return;
    }
    if (!pickUpDate || !dropOffDate) {
      toast.error("Invalid dates", "Please select pick-up and drop-off dates.");
      return;
    }
    const pickUp = new Date(pickUpDate);
    const dropOff = new Date(dropOffDate);
    const today = new Date(getTodayIso());
    if (pickUp < today) {
      toast.error("Invalid dates", "Pick-up date cannot be in the past.");
      return;
    }
    if (dropOff < pickUp) {
      toast.error(
        "Invalid dates",
        "Drop-off date cannot be before the pick-up date."
      );
      return;
    }
    bookingMutation.mutate();
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Sign in required", "Please sign in to add items to cart.");
      router.push("/auth/signin");
      return;
    }
    if (!car?.id) {
      toast.error("Cart unavailable", "Car information is missing.");
      return;
    }
    if (!pickUpDate || !dropOffDate) {
      toast.error("Invalid dates", "Please select pick-up and drop-off dates.");
      return;
    }
    const pickUp = new Date(pickUpDate);
    const dropOff = new Date(dropOffDate);
    const today = new Date(getTodayIso());
    if (pickUp < today) {
      toast.error("Invalid dates", "Pick-up date cannot be in the past.");
      return;
    }
    if (dropOff < pickUp) {
      toast.error(
        "Invalid dates",
        "Drop-off date cannot be before the pick-up date."
      );
      return;
    }

    addToCartMutation(
      {
        carId: car.id,
        pickUpDate,
        dropOffDate,
      },
      {
        onSuccess: () => {
          toast.success("Added to cart", "Car has been added to your cart.");
        },
        onError: (error: unknown) => {
          let message = "Something went wrong while adding to cart.";
          if (error instanceof AxiosError) {
            message =
              (error.response?.data as { message?: string })?.message ??
              error.message;
          } else if (error instanceof Error) {
            message = error.message;
          }
          toast.error("Add to cart failed", message);
        },
      }
    );
  };

  const handlePickUpChange = (value: string) => {
    if (!value) return;
    const todayIso = getTodayIso();
    const normalized = value < todayIso ? todayIso : value;
    setPickUpDate(normalized);
    if (dropOffDate && dropOffDate < normalized) {
      setDropOffDate(normalized);
    }
  };

  const handleDropOffChange = (value: string) => {
    if (!value) return;
    if (value < pickUpDate) {
      toast.info(
        "Adjust date",
        "Drop-off date cannot be before the pick-up date."
      );
      return;
    }
    setDropOffDate(value);
  };

  const openPickUpPicker = () => {
    const input = pickUpInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
      input.click();
    }
  };

  const openDropOffPicker = () => {
    const input = dropOffInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
      input.click();
    }
  };

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
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {car.owner?.picture ? (
                    <Image
                      src={toAbsoluteImage(car.owner.picture) ?? ""}
                      alt={hostDisplay?.hostName ?? "Host"}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div className="space-y-1">
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

            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {carSpecs.map((detail) => (
                  <div key={detail.label} className="flex flex-col gap-1 border-b border-gray-200 pb-3 last:border-b-0 sm:border-b-0">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {detail.label}
                    </span>
                    <span className="text-base font-semibold text-gray-900 break-words">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Reviews</h4>
                  <p className="text-sm text-gray-500">
                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {renderRatingStars(
                    reviews.length
                      ? reviews.reduce((sum, current) => sum + (current.rating ?? 0), 0) /
                      reviews.length
                      : undefined
                  )}
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-5">
                  {reviews.map((review, index) => {
                    const reviewerName =
                      hostDisplay?.hostName ?? `Guest ${index + 1}`;
                    const comment =
                      review.comment ||
                      "The guest left no written feedback for this trip.";

                    return (
                      <article
                        key={review.id ?? `review-${index}`}
                        className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {reviewerName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTimeAgo(review.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {renderRatingStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-600">
                          {comment}
                        </p>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                  Reviews for this car will appear here once guests share their
                  experience.
                </div>
              )}
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
              {typeof totalSelectedAmount === "number" ? (
                <p className="text-sm text-gray-500">
                  <span className="text-gray-900 font-semibold">
                    {totalSelectedAmount.toLocaleString()} {currency}
                  </span>{" "}
                  for {rentalDays} {rentalDays === 1 ? "day" : "days"}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Select your dates to see an accurate total.
                </p>
              )}

              <div className="relative flex items-center rounded-2xl border border-gray-900 px-5 py-4 text-sm font-semibold text-gray-900">
                <button
                  type="button"
                  className="flex flex-1 flex-col text-left focus:outline-none"
                  onClick={openPickUpPicker}
                >
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    Pick-up Date
                  </p>
                  <p className="text-lg text-gray-900">
                    {bookingDates.pickUpDateLabel}
                  </p>
                </button>
                <div className="mx-4 h-10 w-px bg-gray-200" />
                <button
                  type="button"
                  className="flex flex-1 flex-col text-right focus:outline-none"
                  onClick={openDropOffPicker}
                >
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    Drop-off Date
                  </p>
                  <p className="text-lg text-gray-900">
                    {bookingDates.dropOffDateLabel}
                  </p>
                </button>
                <input
                  ref={pickUpInputRef}
                  id="pickup-date"
                  type="date"
                  value={pickUpDate}
                  min={getTodayIso()}
                  onChange={(event) => handlePickUpChange(event.target.value)}
                  className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <input
                  ref={dropOffInputRef}
                  id="dropoff-date"
                  type="date"
                  value={dropOffDate}
                  min={dropOffMinDate}
                  onChange={(event) => handleDropOffChange(event.target.value)}
                  className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
                  tabIndex={-1}
                  aria-hidden="true"
                />
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
                    {typeof totalSelectedAmount === "number"
                      ? `${totalSelectedAmount.toLocaleString()} ${currency}`
                      : "—"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Free cancellation</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !pickUpDate || !dropOffDate}
                  className="rounded-2xl border border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? "Adding..." : "Add To Cart"}
                </button>
                <button
                  onClick={handleBookNow}
                  disabled={
                    bookingMutation.isPending || !pickUpDate || !dropOffDate
                  }
                  className="rounded-2xl bg-black px-6 py-3 text-center text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed hover:bg-gray-900"
                >
                  {bookingMutation.isPending ? "Booking..." : "Book Now"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
