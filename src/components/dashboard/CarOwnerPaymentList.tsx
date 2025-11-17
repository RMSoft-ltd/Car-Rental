"use client";

import { useState, useEffect } from "react";
import { BookingsPerOwnerList, CarOwnerPaymentFilters, DepositStatus, BookingDetail } from "@/types/payment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/utils/formatter";
import {
    getBookingStatusConfig,
    getPaymentStatusConfig,
    getDepositStatusConfig,
    getBookingStatusLabel,
    getPaymentStatusLabel,
    getDepositStatusLabel,
} from "@/utils/status-colors";
import { Search, Filter, X, ChevronLeft, ChevronRight, Eye, Calendar, CreditCard, User, Car } from "lucide-react";
import { useCarList } from "@/hooks/use-car-list";

interface CarOwnerPaymentListProps {
    data: BookingsPerOwnerList;
    onFilterChange?: (filters: CarOwnerPaymentFilters) => void;
    onPayOwner?: (carOwnerId: number, bookingIds: number[]) => void;
    isLoading?: boolean;
    totalPages?: number;
    currentPage?: number;
    isAdmin?: boolean;
    currentUserId?: number;
    isOwner?: boolean; // Indicates if the current user is a car owner
}

export function CarOwnerPaymentList({
    data,
    onFilterChange,
    onPayOwner,
    isLoading = false,
    totalPages = 1,
    currentPage = 0,
    isAdmin = false,
    currentUserId,
    isOwner = false,
}: CarOwnerPaymentListProps) {
    const [filters, setFilters] = useState<CarOwnerPaymentFilters>({
        skip: 0,
        limit: 10,
        depositStatus: "PENDING",
    });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedBookings, setSelectedBookings] = useState<Record<number, number[]>>({});
    const [detailsDialog, setDetailsDialog] = useState<{
        open: boolean;
        booking: BookingDetail | null;
    }>({
        open: false,
        booking: null,
    });

    const { data: carsResponse, isLoading: carsLoading } = useCarList({ limit: 1000 });

    const carOwners = data.map((owner) => ({
        id: owner.carOwnerId,
        name: `${owner.carOwnerDetails.fname} ${owner.carOwnerDetails.lname}`,
        email: owner.carOwnerDetails.email,
    }));

    const cars = carsResponse?.rows.map((car) => ({
        id: car.id,
        label: `${car.make} ${car.model} (${car.year}) - ${car.plateNumber}`,
    })) || [];

    useEffect(() => {
        if (!isAdmin && currentUserId) {
            let newFilters = { ...filters };
            let shouldUpdate = false;

            if (isOwner && filters.ownerId !== currentUserId) {
                newFilters.ownerId = currentUserId;
                shouldUpdate = true;
            }

            if (shouldUpdate) {
                setFilters(newFilters);
                onFilterChange?.(newFilters);
            }
        }
    }, [isAdmin, currentUserId, isOwner]);

    const handleFilterChange = (key: keyof CarOwnerPaymentFilters, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const clearFilters = () => {
        const defaultFilters: CarOwnerPaymentFilters = {
            skip: 0,
            limit: 10,
            depositStatus: "PENDING",
        };
        setFilters(defaultFilters);
        onFilterChange?.(defaultFilters);
    };

    const handlePageChange = (newPage: number) => {
        handleFilterChange("skip", newPage);
    };

    const toggleBookingSelection = (carOwnerId: number, bookingId: number) => {
        setSelectedBookings((prev) => {
            const ownerBookings = prev[carOwnerId] || [];
            const isSelected = ownerBookings.includes(bookingId);

            if (isSelected) {
                return {
                    ...prev,
                    [carOwnerId]: ownerBookings.filter((id) => id !== bookingId),
                };
            } else {
                return {
                    ...prev,
                    [carOwnerId]: [...ownerBookings, bookingId],
                };
            }
        });
    };

    const selectAllBookings = (carOwnerId: number, bookingIds: number[]) => {
        setSelectedBookings((prev) => ({
            ...prev,
            [carOwnerId]: bookingIds,
        }));
    };

    const deselectAllBookings = (carOwnerId: number) => {
        setSelectedBookings((prev) => {
            const updated = { ...prev };
            delete updated[carOwnerId];
            return updated;
        });
    };

    const handlePayOwner = (carOwnerId: number) => {
        const bookingIds = selectedBookings[carOwnerId] || [];
        if (bookingIds.length > 0) {
            onPayOwner?.(carOwnerId, bookingIds);
            // Clear selections after payment 
            deselectAllBookings(carOwnerId);
        }
    };

    const calculateSelectedAmount = (carOwnerId: number) => {
        const bookingIds = selectedBookings[carOwnerId] || [];
        const owner = data.find((o) => o.carOwnerId === carOwnerId);
        if (!owner) return 0;

        return owner.details
            .filter((booking) => bookingIds.includes(booking.id))
            .reduce((sum, booking) => sum + booking.totalAmount, 0);
    };

    const openBookingDetails = (booking: BookingDetail) => {
        setDetailsDialog({
            open: true,
            booking,
        });
    };

    const closeBookingDetails = () => {
        setDetailsDialog({
            open: false,
            booking: null,
        });
    };

    return (
        <div className="space-y-6">
            {/* Header with Filters */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Car Owner Payments</CardTitle>
                            <CardDescription>
                                Manage and track payments owed to car owners
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            {showFilters ? "Hide" : "Show"} Filters
                        </Button>
                    </div>
                </CardHeader>

                {showFilters && (
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bookingGroupId">Booking Group ID</Label>
                                <Input
                                    id="bookingGroupId"
                                    placeholder="Enter booking group ID"
                                    value={filters.bookingGroupId || ""}
                                    onChange={(e) => handleFilterChange("bookingGroupId", e.target.value)}
                                />
                            </div>

                            {/* Car Owner Filter - Only for Admins */}
                            {isAdmin && (
                                <div className="space-y-2">
                                    <Label htmlFor="ownerId">Car Owner</Label>
                                    <Select
                                        value={filters.ownerId?.toString() || "all"}
                                        onValueChange={(value) =>
                                            handleFilterChange("ownerId", value === "all" ? undefined : Number(value))
                                        }
                                    >
                                        <SelectTrigger id="ownerId">
                                            <SelectValue placeholder="Select car owner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Owners</SelectItem>
                                            {carOwners.length === 0 ? (
                                                <SelectItem value="none" disabled>
                                                    No owners available
                                                </SelectItem>
                                            ) : (
                                                carOwners.map((owner) => (
                                                    <SelectItem key={owner.id} value={owner.id.toString()}>
                                                        {owner.name} ({owner.email})
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Car Filter - Dropdown for better UX */}
                            <div className="space-y-2">
                                <Label htmlFor="carId">Car</Label>
                                <Select
                                    value={filters.carId?.toString() || "all"}
                                    onValueChange={(value) =>
                                        handleFilterChange("carId", value === "all" ? undefined : Number(value))
                                    }
                                >
                                    <SelectTrigger id="carId">
                                        <SelectValue placeholder="Select car" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Cars</SelectItem>
                                        {carsLoading ? (
                                            <SelectItem value="loading" disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : cars.length === 0 ? (
                                            <SelectItem value="none" disabled>
                                                No cars available
                                            </SelectItem>
                                        ) : (
                                            cars.map((car) => (
                                                <SelectItem key={car.id} value={car.id.toString()}>
                                                    {car.label}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="depositStatus">Deposit Status</Label>
                                <Select
                                    value={filters.depositStatus || "PENDING"}
                                    onValueChange={(value) => handleFilterChange("depositStatus", value as DepositStatus)}
                                >
                                    <SelectTrigger id="depositStatus">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="PARTIALLY_DEPOSITED">Partially Deposited</SelectItem>
                                        <SelectItem value="DEPOSITED">Deposited</SelectItem>
                                        <SelectItem value="REFUNDED">Refunded</SelectItem>
                                        <SelectItem value="FAILED">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="totalDays">Exact Total Days</Label>
                                <Input
                                    id="totalDays"
                                    type="number"
                                    placeholder="Enter exact days"
                                    value={filters.totalDays || ""}
                                    onChange={(e) =>
                                        handleFilterChange("totalDays", e.target.value ? Number(e.target.value) : undefined)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="totalAmount">Exact Total Amount</Label>
                                <Input
                                    id="totalAmount"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={filters.totalAmount || ""}
                                    onChange={(e) =>
                                        handleFilterChange("totalAmount", e.target.value ? Number(e.target.value) : undefined)
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                <X className="mr-2 h-4 w-4" />
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Payment List */}
            {isLoading ? (
                <Card>
                    <CardContent className="py-10">
                        <div className="text-center text-muted-foreground">Loading...</div>
                    </CardContent>
                </Card>
            ) : data.length === 0 ? (
                <Card>
                    <CardContent className="py-10">
                        <div className="text-center text-muted-foreground">
                            No payment records found
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {data.map((owner) => {
                        const selectedCount = selectedBookings[owner.carOwnerId]?.length || 0;
                        const selectedAmount = calculateSelectedAmount(owner.carOwnerId);

                        return (
                            <Card key={owner.carOwnerId}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg">
                                                {owner.carOwnerDetails.fname} {owner.carOwnerDetails.lname}
                                            </CardTitle>
                                            <CardDescription>{owner.carOwnerDetails.email}</CardDescription>
                                            <div className="flex gap-4 text-sm mt-2">
                                                <span>
                                                    <strong>Total Bookings:</strong> {owner.totalBookings}
                                                </span>
                                                <span>
                                                    <strong>Total Amount Owed:</strong>{" "}
                                                    {formatCurrency(owner.totalAmountOwed)}
                                                </span>
                                            </div>
                                        </div>
                                        {selectedCount > 0 && (
                                            <div className="flex gap-2 items-center">
                                                <div className="text-right text-sm">
                                                    <div className="font-medium">
                                                        {selectedCount} booking{selectedCount > 1 ? "s" : ""} selected
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        {formatCurrency(selectedAmount)}
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handlePayOwner(owner.carOwnerId)}
                                                >
                                                    Pay Selected
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="bookings">
                                            <AccordionTrigger className="text-sm hover:no-underline py-2 cursor-pointer">
                                                View Booking Details ({owner.details.length})
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                selectAllBookings(
                                                                    owner.carOwnerId,
                                                                    owner.details.map((b) => b.id)
                                                                )
                                                            }
                                                        >
                                                            Select All
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deselectAllBookings(owner.carOwnerId)}
                                                        >
                                                            Deselect All
                                                        </Button>
                                                    </div>

                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead className="w-12">Select</TableHead>
                                                                    <TableHead>Booking ID</TableHead>
                                                                    <TableHead>Period</TableHead>
                                                                    <TableHead>Days</TableHead>
                                                                    <TableHead>Amount</TableHead>
                                                                    <TableHead>Deposit Status</TableHead>
                                                                    <TableHead className="text-right">Actions</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {owner.details.map((booking) => {
                                                                    const isSelected = selectedBookings[
                                                                        owner.carOwnerId
                                                                    ]?.includes(booking.id);

                                                                    return (
                                                                        <TableRow
                                                                            key={booking.id}
                                                                            className={isSelected ? "bg-muted/50" : ""}
                                                                        >
                                                                            <TableCell>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={isSelected}
                                                                                    onChange={() =>
                                                                                        toggleBookingSelection(
                                                                                            owner.carOwnerId,
                                                                                            booking.id
                                                                                        )
                                                                                    }
                                                                                    className="h-4 w-4 rounded border-gray-300"
                                                                                    aria-label={`Select booking ${booking.id}`}
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell className="font-mono text-xs">
                                                                                #{booking.id}
                                                                            </TableCell>
                                                                            <TableCell className="text-sm">
                                                                                <div className="flex flex-col gap-1">
                                                                                    <span>{formatDate(booking.pickUpDate)}</span>
                                                                                    <span className="text-muted-foreground text-xs">
                                                                                        to {formatDate(booking.dropOffDate)}
                                                                                    </span>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Badge variant="outline">{booking.totalDays} days</Badge>
                                                                            </TableCell>
                                                                            <TableCell className="font-medium">
                                                                                {formatCurrency(booking.totalAmount)}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Badge
                                                                                    variant={getDepositStatusConfig(booking.depositStatus).variant}
                                                                                    className={getDepositStatusConfig(booking.depositStatus).className}
                                                                                >
                                                                                    {getDepositStatusLabel(booking.depositStatus)}
                                                                                </Badge>
                                                                            </TableCell>
                                                                            <TableCell className="text-right">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() => openBookingDetails(booking)}
                                                                                >
                                                                                    <Eye className="h-4 w-4 mr-1" />
                                                                                    Details
                                                                                </Button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Card>
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Page {currentPage + 1} of {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 0}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage >= totalPages - 1}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Booking Details Dialog */}
            <Dialog open={detailsDialog.open} onOpenChange={(open) => !open && closeBookingDetails()}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                        <DialogDescription>
                            Complete information for booking #{detailsDialog.booking?.id}
                        </DialogDescription>
                    </DialogHeader>

                    {detailsDialog.booking && (
                        <div className="space-y-6 py-4">
                            <Separator />

                            {/* Rental Period */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <Label className="text-xs">Rental Period</Label>
                                </div>
                                <div className="bg-muted p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Pick Up:</span>
                                        <span className="font-medium">{formatDate(detailsDialog.booking.pickUpDate)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Drop Off:</span>
                                        <span className="font-medium">{formatDate(detailsDialog.booking.dropOffDate)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total Days:</span>
                                        <Badge variant="outline" className="font-semibold">
                                            {detailsDialog.booking.totalDays} days
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Payment Information */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CreditCard className="h-4 w-4" />
                                    <Label className="text-xs">Payment Information</Label>
                                </div>
                                <div className="bg-muted p-4 rounded-lg space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total Amount:</span>
                                        <span className="text-xl font-bold text-primary">
                                            {formatCurrency(detailsDialog.booking.totalAmount)}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Booking Status</p>
                                            <Badge
                                                variant={getBookingStatusConfig(detailsDialog.booking.bookingStatus).variant}
                                                className={getBookingStatusConfig(detailsDialog.booking.bookingStatus).className}
                                            >
                                                {getBookingStatusLabel(detailsDialog.booking.bookingStatus)}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Payment Status</p>
                                            <Badge
                                                variant={getPaymentStatusConfig(detailsDialog.booking.paymentStatus).variant}
                                                className={getPaymentStatusConfig(detailsDialog.booking.paymentStatus).className}
                                            >
                                                {getPaymentStatusLabel(detailsDialog.booking.paymentStatus)}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Deposit Status</p>
                                            <Badge
                                                variant={getDepositStatusConfig(detailsDialog.booking.depositStatus).variant}
                                                className={getDepositStatusConfig(detailsDialog.booking.depositStatus).className}
                                            >
                                                {getDepositStatusLabel(detailsDialog.booking.depositStatus)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button variant="outline" onClick={closeBookingDetails}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
