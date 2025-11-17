"use client";

import { AiOutlineClear } from "react-icons/ai";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency, formatDate } from "@/utils/formatter";
import { useBookingHistory } from "@/hooks/use-booking-history";
import { BookingHistoryFilters } from "@/types/payment";
import {
    getBookingStatusConfig,
    getPaymentStatusConfig,
    getDepositStatusConfig,
    getBookingStatusLabel,
    getPaymentStatusLabel,
    getDepositStatusLabel,
    getStatusIconName,
} from "@/utils/status-colors";
import { Calendar, Car, CheckCircle, Clock, CreditCard, Filter, User, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useCarList } from "@/hooks/use-car-list";
import { LuX } from "react-icons/lu";

interface PaymentHistoryContentProps {
    userId?: number;
    isAdmin?: boolean;
}

export default function HistoryContent({
    userId,
    isAdmin = false
}: PaymentHistoryContentProps) {
    const [filters, setFilters] = useState<BookingHistoryFilters>({
        bookingStatus: undefined,
        paymentStatus: undefined,
        userId: !isAdmin && userId ? userId : undefined,
    });
    const [showFilters, setShowFilters] = useState<boolean>(true);

    // Fetch booking history with filters
    const { data, isLoading } = useBookingHistory(filters);

    // Fetch cars for car filter dropdown
    const { data: carsResponse, isLoading: carsLoading } = useCarList({ limit: 1000 });

    // Calculate statistics from the data
    const statistics = useMemo(() => {
        if (!data?.rows) return {
            totalBookings: 0,
            confirmedBookings: 0,
            totalAmount: 0,
            paidBookings: 0,
        };

        const bookings = data.rows;
        return {
            totalBookings: data.count,
            confirmedBookings: bookings.filter(b => b.bookingStatus === "CONFIRMED").length,
            totalAmount: bookings.reduce((sum, b) => sum + b.totalAmount, 0),
            paidBookings: bookings.filter(b => b.paymentStatus === "PAID").length,
        };
    }, [data]);

    const handleFilterChange = (key: keyof BookingHistoryFilters, value: string | number | boolean | undefined) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
    };

    const clearFilters = () => {
        const defaultFilters: BookingHistoryFilters = {
            bookingStatus: undefined,
            paymentStatus: undefined,
            userId: !isAdmin && userId ? userId : undefined,
        };
        setFilters(defaultFilters);
    };

    const getStatusVariant = (status: string) => {
        // Auto-detect status type and return appropriate variant
        const normalizedStatus = status.toUpperCase();

        if (["CONFIRMED", "COMPLETED", "EXPIRED", "REJECTED"].includes(normalizedStatus)) {
            return getBookingStatusConfig(status).variant;
        }
        if (["PAID", "UNPAID", "PARTIALLY_PAID"].includes(normalizedStatus)) {
            return getPaymentStatusConfig(status).variant;
        }
        if (["DEPOSITED", "PARTIALLY_DEPOSITED"].includes(normalizedStatus)) {
            return getDepositStatusConfig(status).variant;
        }

        // Default for common statuses (PENDING, PROCESSING, FAILED, etc.)
        return getPaymentStatusConfig(status).variant;
    };

    const getStatusClassName = (status: string) => {
        const normalizedStatus = status.toUpperCase();

        if (["CONFIRMED", "COMPLETED", "EXPIRED", "REJECTED"].includes(normalizedStatus)) {
            return getBookingStatusConfig(status).className;
        }
        if (["PAID", "UNPAID", "PARTIALLY_PAID"].includes(normalizedStatus)) {
            return getPaymentStatusConfig(status).className;
        }
        if (["DEPOSITED", "PARTIALLY_DEPOSITED"].includes(normalizedStatus)) {
            return getDepositStatusConfig(status).className;
        }

        return getPaymentStatusConfig(status).className;
    };

    const getStatusIcon = (status: string) => {
        const iconName = getStatusIconName(status);

        switch (iconName) {
            case "CheckCircle":
                return <CheckCircle className="w-3 h-3" />;
            case "Clock":
                return <Clock className="w-3 h-3" />;
            case "XCircle":
                return <XCircle className="w-3 h-3" />;
            default:
                return <Clock className="w-3 h-3" />;
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-16rem)] space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-shrink-0">
                <Card>
                    <CardContent className="pt-6">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">
                                Total Bookings
                            </p>
                            <p className="text-lg font-bold">{statistics.totalBookings}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Confirmed Bookings</p>
                            <p className="text-lg font-bold">{statistics.confirmedBookings}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">
                                Total Amount
                            </p>
                            <p className="text-lg font-bold">
                                {formatCurrency(statistics.totalAmount)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Show and Hide Filters Button */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowFilters(!showFilters)}
                >

                    {showFilters ? <>
                        <Filter className="mr-2 h-4 w-4" />
                        Hide
                    </> : <>
                        <LuX className="mr-2 h-4 w-4" />
                        Show
                    </>} Filters
                </Button>
            </div>

            {/* Filters - Modern inline design */}
            <div className={`space-y-4 flex-shrink-0 p-2 border border-dashed rounded-lg ${showFilters ? "block" : "hidden"}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                    {/* Car Filter */}
                    <div className="space-y-2">
                        <Label htmlFor="carId" className="text-xs text-muted-foreground">Car</Label>
                        <Select
                            value={filters.carId?.toString() || "all"}
                            onValueChange={(value) =>
                                handleFilterChange("carId", value === "all" ? undefined : Number(value))
                            }
                        >
                            <SelectTrigger size="md" id="carId" className="h-10 w-full">
                                <SelectValue placeholder="All Cars" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Cars</SelectItem>
                                {carsLoading ? (
                                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                                ) : carsResponse?.rows?.length === 0 ? (
                                    <SelectItem value="none" disabled>No cars available</SelectItem>
                                ) : (
                                    carsResponse?.rows?.map((car) => (
                                        <SelectItem key={car.id} value={car.id.toString()}>
                                            {car.make} {car.model} ({car.year}) - {car.plateNumber}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Booking Status */}
                    <div className="space-y-2">
                        <Label htmlFor="bookingStatus" className="text-xs text-muted-foreground">Booking Status</Label>
                        <Select
                            value={filters.bookingStatus || "all"}
                            onValueChange={(value) =>
                                handleFilterChange("bookingStatus", value === "all" ? undefined : value)
                            }
                        >
                            <SelectTrigger size="md" id="bookingStatus" className="h-10 w-full">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Booking Statuses</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PROCESSING">Processing</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payment Status */}
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="paymentStatus" className="text-xs text-muted-foreground">Booking Payment Status</Label>
                        <Select
                            value={filters.paymentStatus || "all"}
                            onValueChange={(value) =>
                                handleFilterChange("paymentStatus", value === "all" ? undefined : value)
                            }
                        >
                            <SelectTrigger size="md" id="paymentStatus" className="h-10 w-full">
                                <SelectValue placeholder="All Payment Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Payment Statuses</SelectItem>
                                <SelectItem value="UNPAID">Unpaid</SelectItem>
                                <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="PROCESSING">Processing</SelectItem>
                                <SelectItem value="REFUNDED">Refunded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Pick Up Date From */}
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="pickUpDateFrom" className="text-xs text-muted-foreground">Pick Up Date</Label>
                        <Input
                            id="pickUpDateFrom"
                            type="date"
                            value={filters.pickUpDateFrom || ""}
                            onChange={(e) => handleFilterChange("pickUpDateFrom", e.target.value || undefined)}
                            className="h-10"
                        />
                    </div>

                    {/* Pick Up Date To */}
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="pickUpDateTo" className="text-xs text-muted-foreground">Pick Up Date</Label>
                        <Input
                            id="pickUpDateTo"
                            type="date"
                            value={filters.pickUpDateTo || ""}
                            onChange={(e) => handleFilterChange("pickUpDateTo", e.target.value || undefined)}
                            className="h-10"
                        />
                    </div>

                    {/* Drop Off Date From */}
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="dropOffDateFrom" className="text-xs text-muted-foreground">Drop Off Date</Label>
                        <Input
                            id="dropOffDateFrom"
                            type="date"
                            value={filters.dropOffDateFrom || ""}
                            onChange={(e) => handleFilterChange("dropOffDateFrom", e.target.value || undefined)}
                            className="h-10"
                        />
                    </div>

                    {/* Drop Off Date To */}
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="dropOffDateTo" className="text-xs text-muted-foreground">Drop Off Date</Label>
                        <Input
                            id="dropOffDateTo"
                            type="date"
                            value={filters.dropOffDateTo || ""}
                            onChange={(e) => handleFilterChange("dropOffDateTo", e.target.value || undefined)}
                            className="h-10"
                        />
                    </div>

                    {/* Total Days */}
                    <div className="space-y-2">
                        <Label htmlFor="totalDays" className="text-xs text-muted-foreground">Total Days</Label>
                        <Input
                            id="totalDays"
                            type="number"
                            placeholder="Exact days"
                            value={filters.totalDays || ""}
                            onChange={(e) =>
                                handleFilterChange("totalDays", e.target.value ? Number(e.target.value) : undefined)
                            }
                            className="h-10"
                        />
                    </div>

                    {/* Total Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="totalAmount" className="text-xs text-muted-foreground">Total Booking Amount</Label>
                        <Input
                            id="totalAmount"
                            type="number"
                            placeholder="Exact amount"
                            value={filters.totalAmount || ""}
                            onChange={(e) =>
                                handleFilterChange("totalAmount", e.target.value ? Number(e.target.value) : undefined)
                            }
                            className="h-10"
                        />
                    </div>

                    {/* Is Upcoming */}
                    <div className="flex items-center space-x-2 pt-6">
                        <Checkbox
                            id="isUpcoming"
                            checked={filters.isUpcoming || false}
                            onCheckedChange={(checked) =>
                                handleFilterChange("isUpcoming", checked === true ? true : undefined)
                            }
                        />
                        <Label
                            htmlFor="isUpcoming"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Upcoming only
                        </Label>
                    </div>
                </div>

                {/* Clear Filters Button */}
                {(filters.carId || filters.bookingStatus || filters.paymentStatus ||
                    filters.pickUpDateFrom || filters.pickUpDateTo || filters.dropOffDateFrom || filters.dropOffDateTo ||
                    filters.totalDays || filters.totalAmount || filters.isUpcoming) && (
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="flex items-center gap-2"
                            >
                                <AiOutlineClear className="w-4 h-4" />
                                Clear All Filters
                            </Button>
                        </div>
                    )}
            </div>

            {/* Bookings List - Scrollable Container  overflow-y-auto */}
            <div className="flex-1 pr-2">
                {isLoading ? (
                    <Card>
                        <CardContent className="py-10">
                            <div className="text-center text-muted-foreground">Loading bookings...</div>
                        </CardContent>
                    </Card>
                ) : !data?.rows || data.rows.length === 0 ? (
                    <Card>
                        <CardContent className="py-10">
                            <div className="text-center">
                                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
                                <p className="text-muted-foreground">
                                    {!isAdmin
                                        ? "You haven't made any bookings yet."
                                        : "No bookings match your current filters."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4 pb-4">
                        {data.rows.map((booking) => (
                            <Card key={booking.id}>
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="space-y-1 flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <CardTitle className="text-lg">
                                                    Booking #{booking.id}
                                                </CardTitle>
                                                <Badge
                                                    variant={getStatusVariant(booking.bookingStatus)}
                                                    className={getStatusClassName(booking.bookingStatus)}
                                                >
                                                    {getStatusIcon(booking.bookingStatus)}
                                                    <span className="ml-1">{getBookingStatusLabel(booking.bookingStatus)}</span>
                                                </Badge>
                                                <Badge
                                                    variant={getStatusVariant(booking.paymentStatus)}
                                                    className={getStatusClassName(booking.paymentStatus)}
                                                >
                                                    {getStatusIcon(booking.paymentStatus)}
                                                    <span className="ml-1">{getPaymentStatusLabel(booking.paymentStatus)}</span>
                                                </Badge>
                                            </div>
                                            <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                                                <span className="flex items-center gap-1">
                                                    <Car className="w-4 h-4" />
                                                    {booking.car?.title || "N/A"}
                                                </span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(booking.pickUpDate).toLocaleDateString()} - {new Date(booking.dropOffDate).toLocaleDateString()}
                                                </span>
                                            </CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-primary">
                                                {formatCurrency(booking.totalAmount)}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Renter</p>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm truncate capitalize">
                                                        {booking.user?.fName} {booking.user?.lName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Owner</p>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm truncate capitalize">
                                                        {booking.car?.owner?.fName} {booking.car?.owner?.lName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Car Details</p>
                                            <p className="font-medium text-sm">{booking.car?.plateNumber}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {booking.car?.make} {booking.car?.model} ({booking.car?.year})
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Deposit Status</p>
                                            <Badge
                                                variant={getStatusVariant(booking.depositStatus)}
                                                className={getStatusClassName(booking.depositStatus)}
                                            >
                                                {getDepositStatusLabel(booking.depositStatus)}
                                            </Badge>
                                        </div>
                                    </div>

                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="details" className="border-none">
                                            <AccordionTrigger className="text-sm hover:no-underline py-2 cursor-pointer">
                                                View Full Details
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <Separator className="my-4" />
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">

                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Car className="h-4 w-4" />
                                                            <Label className="text-xs font-semibold">Car Information</Label>
                                                        </div>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Title:</span>
                                                                <span className="font-medium">{booking.car?.title || "N/A"}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Make & Model:</span>
                                                                <span className="font-medium">{booking.car?.make} {booking.car?.model}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Year:</span>
                                                                <span className="font-medium">{booking.car?.year}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Color:</span>
                                                                <span className="font-medium">{booking.car?.color}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Price/Day:</span>
                                                                <span className="font-medium">{formatCurrency(booking.car?.pricePerDay || 0)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <CreditCard className="h-4 w-4" />
                                                            <Label className="text-xs font-semibold">Payment Details</Label>
                                                        </div>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Total Days:</span>
                                                                <span className="font-medium">{booking.totalDays} days</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Pickup Date - DropOff Date:</span>
                                                                <span className="font-medium">{formatDate(booking.pickUpDate)} - {formatDate(booking.dropOffDate)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Total Amount:</span>
                                                                <span className="font-semibold text-primary">{formatCurrency(booking.totalAmount)}</span>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-muted-foreground">Booking Status:</span>
                                                                    <Badge
                                                                        variant={getStatusVariant(booking.bookingStatus)}
                                                                        className={getStatusClassName(booking.bookingStatus)}
                                                                    >
                                                                        {getBookingStatusLabel(booking.bookingStatus)}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-muted-foreground">Booking Payment Status:</span>
                                                                    <Badge
                                                                        variant={getStatusVariant(booking.paymentStatus)}
                                                                        className={getStatusClassName(booking.paymentStatus)}
                                                                    >
                                                                        {getPaymentStatusLabel(booking.paymentStatus)}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-muted-foreground">Deposit Status:</span>
                                                                    <Badge
                                                                        variant={getStatusVariant(booking.depositStatus)}
                                                                        className={getStatusClassName(booking.depositStatus)}
                                                                    >
                                                                        {getDepositStatusLabel(booking.depositStatus)}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator className="my-4" />

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-semibold">Renter Contact</Label>
                                                        <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                                                            <p className="font-medium capitalize">{booking.user?.fName} {booking.user?.lName}</p>
                                                            <p className="text-muted-foreground">{booking.user?.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-semibold">Owner Contact</Label>
                                                        <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                                                            <p className="font-medium">{booking.car?.owner?.fName} {booking.car?.owner?.lName}</p>
                                                            <p className="text-muted-foreground">{booking.car?.owner?.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
