"use client";

import { useParams, useRouter } from "next/navigation";
import { useCarListing } from "@/hooks/use-car-list";
import { baseUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, Check, X, MapPin, FileText, Shield, ChevronDown, Car as CarIcon, Settings, Sparkles, Box, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useUpdateCarStatus } from "@/hooks/use-car-listing-mutations";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error-utils";
import { TokenService } from "@/utils/token";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { carStatusUpdateSchema, type CarStatusUpdateFormData } from "@/schemas/car-status.schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import TiptapEditor from "@/components/shared/TiptapEditor";

export default function CarListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const carId = Number(params.id);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [openSections, setOpenSections] = useState({
        basicInfo: true,
        location: true,
        rentalTerms: true,
        insurance: true,
        safety: true,
        comfort: true,
        technology: true,
        exterior: true,
        other: true,
        driveType: true,
        owner: true,
    });

    const loggedInUser = TokenService.getUserData();
    const loggedInUserId = loggedInUser?.id || 0;
    const loggedInRole = loggedInUser?.role || 'user';

    const isAdmin = loggedInRole.toLowerCase().includes('admin');

    const { data: car, isLoading, isError, refetch } = useCarListing(carId);
    const { mutate, isPending } = useUpdateCarStatus();

    const isOwner = Number(loggedInUserId) === Number(car?.owner?.id);

    // Initialize React Hook Form with Zod validation
    const form = useForm<CarStatusUpdateFormData>({
        resolver: zodResolver(carStatusUpdateSchema),
        defaultValues: {
            status: "pending",
            changeStatusDescription: "",
        },
    });

    const onSubmit = (data: CarStatusUpdateFormData) => {
        mutate({ id: carId, status: data.status, changeStatusDescription: data.changeStatusDescription }, {
            onSuccess: () => {
                toast.success("Car status updated successfully");
                form.reset();
                refetch();
            },
            onError: (error: unknown) => {
                const message = getErrorMessage(error, "Failed to Update car listing status");
                toast.error(`Failed to update car status: ${message}`);
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Loading car details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !car) {
        return (
            <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-red-500 text-lg">Failed to load car details.</p>
                        <Button onClick={() => router.back()} className="mt-4">
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Process images
    const carImages = car.carImages?.map((img) =>
        img.startsWith("http") ? img : `${baseUrl}${img}`
    ) || [];

    const mainImage = carImages[selectedImageIndex] || "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&crop=center";

    const listingStatus = ['pending', 'changeRequested', 'approved', 'rejected'];

    // Helper to render boolean feature
    const FeatureItem = ({ label, value }: { label: string; value: boolean }) => (
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">{label}</span>
            {value ? (
                <Check className="w-5 h-5 text-green-600" />
            ) : (
                <X className="w-5 h-5 text-red-500" />
            )}
        </div>
    );

    return (
        <div className="flex-1 p-4 lg:p-8 h-full overflow-auto bg-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Listings
                    </Button>

                    <div className="flex items-center gap-3">
                        {isAdmin ? (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant={"secondary"}
                                        size={`lg`}
                                        className="flex-grow-[1] border border-green-600 text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer"
                                    >
                                        Change Status
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Car listing status change </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action changes listing status of {car.title}.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="status"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Status</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="w-full h-12">
                                                                    <SelectValue placeholder="Select a status" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {listingStatus.filter(status => status !== car.status).map(status => (
                                                                    <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="changeStatusDescription"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                            <TiptapEditor
                                                                value={field.value || ''}
                                                                onChange={field.onChange}
                                                                placeholder="Enter description for status change (minimum 10 characters)"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </form>
                                    </Form>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel disabled={isPending}>
                                            Cancel
                                        </AlertDialogCancel>
                                        <Button
                                            className="bg-black text-white hover:bg-gray-800"
                                            disabled={isPending}
                                            onClick={form.handleSubmit(onSubmit)}
                                        >
                                            {isPending ? "Updating..." : "Update Status"}
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        ) : null}

                        {(isOwner || isAdmin) ? (<Link href={`/dashboard/listing/${car.id}/edit`} className="flex gap-3">
                            <Button
                                size={`lg`}
                                className="flex-grow-[2] bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                                Edit Listing
                            </Button>
                        </Link>) : null}
                    </div>

                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Image Gallery Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 border-b border-gray-200">
                        {/* Main Image */}
                        <div className="lg:col-span-2">
                            <div className="relative h-96 lg:h-fullrounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={mainImage}
                                    alt={`${car.make} ${car.model}`}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&crop=center";
                                    }}
                                />
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 lg:grid-cols-3 place-content-start gap-3 max-h-[500px] overflow-y-auto cursor-pointer">
                            {carImages.map((img, index) => (
                                <Button
                                    key={index}
                                    variant={"ghost"}
                                    onClick={() => setSelectedImageIndex(index)}
                                    aria-label={`View image ${index + 1} of ${carImages.length}`}
                                    className={`relative h-24 rounded-lg overflow-hidden border-1 transition-all ${selectedImageIndex === index
                                        ? "border-black ring-1 ring-black"
                                        : "border-gray-200 hover:border-gray-400"
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${car.make} ${car.model} - Image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&crop=center";
                                        }}
                                    />
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Car Details */}
                    <div className="p-6">
                        {/* Title and Status */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 mb-2">
                                    {car.title}
                                </h1>

                                <p className="text-base text-gray-600">
                                    {car.make} - {car.model} - {car.year}
                                </p>
                            </div>
                            <Badge
                                variant={
                                    car.status === "approved"
                                        ? "default"
                                        : car.status === "rejected"
                                            ? "destructive"
                                            : car.status === "changeRequested"
                                                ? "outline"
                                                : "secondary"
                                }
                                className={`text-sm capitalize ${car.status === "approved"
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : car.status === "pending"
                                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                        : car.status === "changeRequested"
                                            ? "border-orange-500 text-orange-700"
                                            : ""
                                    }`}
                            >
                                {car.status === "changeRequested" ? "Change Requested" : car.status}
                            </Badge>
                        </div>

                        {/* Price */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Price per day (incl. 10% system charge)</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {car.currency} {car.pricePerDay.toLocaleString()}
                            </p>
                        </div>

                        {/* Description */}
                        {car.description && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Description
                                </h2>
                                <p className="text-gray-700 leading-relaxed">{car.description}</p>
                            </div>
                        )}

                        {/* Basic Specifications */}
                        <Collapsible
                            open={openSections.basicInfo}
                            onOpenChange={(open) => setOpenSections({ ...openSections, basicInfo: open })}
                            className="mb-6"
                        >
                            <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <CarIcon className="w-5 h-5" />
                                        Basic Information
                                    </h2>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform ${openSections.basicInfo ? "transform rotate-180" : ""
                                            }`}
                                    />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Body Type</p>
                                        <p className="text-lg font-semibold capitalize">{car.body}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Mileage</p>
                                        <p className="text-lg font-semibold">{car.mileage} km</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Fuel Type</p>
                                        <p className="text-lg font-semibold capitalize">{car.fuelType}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Transmission</p>
                                        <p className="text-lg font-semibold capitalize">{car.transition}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Engine Size</p>
                                        <p className="text-lg font-semibold">{car.engineSize}L</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Doors</p>
                                        <p className="text-lg font-semibold">{car.doors}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Color</p>
                                        <p className="text-lg font-semibold capitalize">{car.color}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Plate Number</p>
                                        <p className="text-lg font-semibold">{car.plateNumber}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Driver Type</p>
                                        <p className="text-lg font-semibold capitalize">{car.driverType}</p>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Location & Availability */}
                        <Collapsible
                            open={openSections.location}
                            onOpenChange={(open) => setOpenSections({ ...openSections, location: open })}
                            className="mb-6"
                        >
                            <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Location & Availability
                                    </h2>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform ${openSections.location ? "transform rotate-180" : ""
                                            }`}
                                    />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {car.pickUpLocation && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Pick-up Location</p>
                                            <p className="text-lg font-semibold">{car.pickUpLocation}</p>
                                        </div>
                                    )}

                                    {car.availabilityType && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Availability Type</p>
                                            <p className="text-lg font-semibold capitalize">{car.availabilityType.toLowerCase()}</p>
                                        </div>
                                    )}

                                    {car.availabilityType === "CUSTOM" && car.customDays && car.customDays.length > 0 && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Available Days</p>
                                            <p className="text-lg font-semibold">
                                                {typeof car.customDays === 'string'
                                                    ? car.customDays.split(',').join(', ')
                                                    : car.customDays.join(', ')
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Rental Terms */}
                        <Collapsible
                            open={openSections.rentalTerms}
                            onOpenChange={(open) => setOpenSections({ ...openSections, rentalTerms: open })}
                            className="mb-6"
                        >
                            <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Rental Terms
                                    </h2>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform ${openSections.rentalTerms ? "transform rotate-180" : ""
                                            }`}
                                    />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Security Deposit</p>
                                        <p className="text-lg font-semibold capitalize">{car.securityDeposit}</p>
                                        {car.securityDepositAmount > 0 && (
                                            <p className="text-md text-gray-700 mt-1">
                                                {car.currency} {car.securityDepositAmount.toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Fuel Policy</p>
                                        <p className="text-lg font-semibold capitalize">{car.fuelPolicy}</p>
                                    </div>
                                    {car.requiredDocs && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Required Documents</p>
                                            <p className="text-lg font-semibold capitalize">{car.requiredDocs}</p>
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Safety Features */}
                        <Collapsible
                            open={openSections.safety}
                            onOpenChange={(open) => setOpenSections({ ...openSections, safety: open })}
                            className="mb-6"
                        >
                            <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Safety Features
                                    </h2>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform ${openSections.safety ? "transform rotate-180" : ""
                                            }`}
                                    />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <FeatureItem label="Driver Air Bag" value={car.isDriverAirBag} />
                                    <FeatureItem label="Airbag Equipped" value={car.isAirbagEquipped} />
                                    <FeatureItem label="Anti-Lock Brakes (ABS)" value={car.isAntiLockBreaks} />
                                    <FeatureItem label="Brake Assist" value={car.isBreakeAssist} />
                                    <FeatureItem label="Traction Control" value={car.isTractionControl} />
                                    <FeatureItem label="Child Safety Locks" value={car.isChildSafetyLocks} />
                                    <FeatureItem label="Power Door Locks" value={car.isPowerDoorLocks} />
                                    <FeatureItem label="Backup Camera" value={car.isBackCameraEquipped} />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Comfort Features */}
                        <Collapsible
                            open={openSections.comfort}
                            onOpenChange={(open) => setOpenSections({ ...openSections, comfort: open })}
                            className="mb-6"
                        >
                            <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        Comfort Features
                                    </h2>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform ${openSections.comfort ? "transform rotate-180" : ""
                                            }`}
                                    />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <FeatureItem label="Power Steering" value={car.isPowerSteering} />
                                    <FeatureItem label="Cruise Control" value={car.isCruiseControl} />
                                    <FeatureItem label="Navigation System" value={car.isNavigation} />
                                    <FeatureItem label="Power Locks" value={car.isPowerLocks} />
                                    <FeatureItem label="Vanity Mirror" value={car.isVanityMirror} />
                                    <FeatureItem label="Trunk Light" value={car.isTrunkLight} />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Interior Features */}
                        <Collapsible
                            open={openSections.technology}
                            onOpenChange={(open) => setOpenSections({ ...openSections, technology: open })}
                            className="mb-6"
                        >
                            <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Settings className="w-5 h-5" />
                                        Interior Features
                                    </h2>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform ${openSections.technology ? "transform rotate-180" : ""
                                            }`}
                                    />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <FeatureItem label="Air Conditioner" value={car.isAirConditioner} />
                                    <FeatureItem label="Leather Seats" value={car.isLeatherSeats} />
                                    <FeatureItem label="Memory Seats" value={car.isMemorySeats} />
                                    <FeatureItem label="Heated Seats" value={car.isHeatedSeatEquipped} />
                                    <FeatureItem label="Radio Equipped" value={car.isRadioEquipped} />
                                    <FeatureItem label="Bluetooth Radio" value={car.isRadioBluetoothEnabled} />
                                    <FeatureItem label="Keyless Entry" value={car.isKeyLess} />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Exterior Features */}
                        <Collapsible
                            open={openSections.exterior}
                            onOpenChange={(open) => setOpenSections({ ...openSections, exterior: open })}
                            className="mb-6"
                        >
                            <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Box className="w-5 h-5" />
                                        Exterior Features
                                    </h2>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform ${openSections.exterior ? "transform rotate-180" : ""
                                            }`}
                                    />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <FeatureItem label="Fog Lights (Front)" value={car.isFogLightsFront} />
                                    <FeatureItem label="Rear Spoiler" value={car.isRearSpoiler} />
                                    <FeatureItem label="Rear Window Wiper" value={car.isRearWindow} />
                                    <FeatureItem label="Rain Sensing Wipers" value={car.isRainSensingWipe} />
                                    <FeatureItem label="Sunroof" value={car.isSunRoof} />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Equipment & Accessories */}
                        <Collapsible
                            open={openSections.other}
                            onOpenChange={(open) => setOpenSections({ ...openSections, other: open })}
                            className="mb-6"
                        >
                            <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Settings className="w-5 h-5" />
                                        Equipment & Accessories
                                    </h2>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform ${openSections.other ? "transform rotate-180" : ""
                                            }`}
                                    />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <FeatureItem label="Spare Tire Included" value={car.isSpareTireIncluded} />
                                    <FeatureItem label="Jack Included" value={car.isJackIncluded} />
                                    <FeatureItem label="Wheel Spanner Included" value={car.isWheelSpannerIncluded} />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Drive Type */}
                        <Collapsible
                            open={openSections.driveType}
                            onOpenChange={(open) => setOpenSections({ ...openSections, driveType: open })}
                            className="mb-6"
                        >
                            <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <CarIcon className="w-5 h-5" />
                                        Drive Type
                                    </h2>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform ${openSections.driveType ? "transform rotate-180" : ""
                                            }`}
                                    />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <FeatureItem label="Right Hand Drive" value={car.isRightHandDrive} />
                                    <FeatureItem label="Left Hand Drive" value={car.isLeftHandDrive} />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Owner Information */}
                        {car.owner && (
                            <Collapsible
                                open={openSections.owner}
                                onOpenChange={(open) => setOpenSections({ ...openSections, owner: open })}
                                className="mb-6"
                            >
                                <CollapsibleTrigger className="w-full">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <h2 className="text-lg font-semibold flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            Owner Information
                                        </h2>
                                        <ChevronDown
                                            className={`w-5 h-5 transition-transform ${openSections.owner ? "transform rotate-180" : ""
                                                }`}
                                        />
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            {car.owner.picture && (
                                                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                                                    <Image
                                                        src={car.owner.picture.startsWith("http") ? car.owner.picture : `${baseUrl}${car.owner.picture}`}
                                                        alt={`${car.owner.fName} ${car.owner.lName}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-lg font-semibold capitalize">
                                                    {car.owner.fName} {car.owner.lName}
                                                </p>
                                                <p className="text-gray-600">{car.owner.email}</p>
                                                {car.owner.phone && (
                                                    <p className="text-gray-600">{car.owner.phone}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        )}

                        {/* Timestamps */}
                        <div className="pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                    <p className="font-medium mb-1">Created At</p>
                                    <p>{new Date(car.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="font-medium mb-1">Last Updated</p>
                                    <p>{new Date(car.updatedAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
