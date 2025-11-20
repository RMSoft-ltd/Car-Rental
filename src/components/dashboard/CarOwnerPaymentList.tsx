"use client";

import { useState, useEffect, useMemo } from "react";
import { BookingsPerOwnerList, CarOwnerPaymentFilters, BookingDetail } from "@/types/payment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
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
import { Filter, ChevronLeft, ChevronRight, Eye, Calendar, CreditCard } from "lucide-react";
import { useCarList } from "@/hooks/use-car-list";
import { LuX } from "react-icons/lu";
import { Combobox, ComboboxOption } from "@/components/forms/FormComponents";
import { AiOutlineClear } from "react-icons/ai";

// Zod schema for deposit payment form
const depositPaymentSchema = z.object({
    mobilephone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must not exceed 15 digits")
        .regex(/^[0-9]+$/, "Phone number must contain only digits")
        .refine((val) => val.startsWith("250"), {
            message: "Phone number must start with 250 (Rwanda)",
        }),
    reason: z
        .string()
        .min(5, "Reason must be at least 5 characters")
        .max(200, "Reason must not exceed 200 characters"),
    amount: z
        .number()
        .positive("Amount must be positive")
        .min(1, "Amount must be at least 1 RWF"),
});

type DepositPaymentFormValues = z.infer<typeof depositPaymentSchema>;

interface CarOwnerPaymentListProps {
    data: BookingsPerOwnerList;
    onFilterChange?: (filters: CarOwnerPaymentFilters) => void;
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
    });
    const [showFilters, setShowFilters] = useState(true);
    const [selectedBookings, setSelectedBookings] = useState<Record<number, number[]>>({});
    const [detailsDialog, setDetailsDialog] = useState<{
        open: boolean;
        booking: BookingDetail | null;
    }>({
        open: false,
        booking: null,
    });
    const [paymentDialog, setPaymentDialog] = useState<{
        open: boolean;
        carOwnerId: number | null;
        ownerName: string;
        ownerEmail: string;
        bookingIds: number[];
        totalAmount: number;
    }>({
        open: false,
        carOwnerId: null,
        ownerName: "",
        ownerEmail: "",
        bookingIds: [],
        totalAmount: 0,
    });

    const { data: carsResponse, isLoading: carsLoading } = useCarList({ limit: 1000 });

    const ownerOptions: ComboboxOption[] = useMemo(() => {
        if (!data) return [];

        // Create a map to ensure unique owners
        const ownersMap = new Map<number, ComboboxOption>();

        data.forEach((owner) => {
            if (!ownersMap.has(owner.carOwnerId)) {
                ownersMap.set(owner.carOwnerId, {
                    value: owner.carOwnerId.toString(),
                    label: `${owner.carOwnerDetails.fname} ${owner.carOwnerDetails.lname}`,
                    description: owner.carOwnerDetails.email,
                });
            }
        });

        return Array.from(ownersMap.values());
    }, [data]);

    const statistics = useMemo(() => {
        if (!data) return {
            totalOwners: 0,
            totalAmountOwed: 0,
            totalAmountPaid: 0,
            totalAmount: 0
        };

        const totalOwners = data.length;
        const calculatedTotalAmount = data.reduce((sum, owner) => sum + owner.totalAmountOwed, 0);
        return {
            totalOwners,
            totalAmountOwed: data.reduce((sum, owner) => sum + owner.totalAmountOwed, 0),
            totalAmountPaid: data.reduce((sum, owner) => sum + owner.totalAmountOwed, 0),
            totalAmount: calculatedTotalAmount
        }
    }, [data]);


    const handleFilterChange = (key: keyof CarOwnerPaymentFilters, value: string | number | boolean | undefined) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
    };

    const applyFilters = () => {
        onFilterChange?.(filters);
        setShowFilters(false);
    };

    const clearFilters = () => {
        const defaultFilters: CarOwnerPaymentFilters = {
            skip: 0,
            limit: 10,
        };

        // Preserve ownerId if user is a car owner (not admin)
        if (!isAdmin && isOwner && currentUserId) {
            defaultFilters.ownerId = currentUserId;
        }

        setFilters(defaultFilters);
        onFilterChange?.(defaultFilters);
    };

    const handlePageChange = (newPage: number) => {
        const newFilters = { ...filters, skip: newPage };
        setFilters(newFilters);
        onFilterChange?.(newFilters);
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
            const owner = data.find((o) => o.carOwnerId === carOwnerId);
            if (owner) {
                const totalAmount = calculateSelectedAmount(carOwnerId);
                setPaymentDialog({
                    open: true,
                    carOwnerId,
                    ownerName: `${owner.carOwnerDetails.fname} ${owner.carOwnerDetails.lname}`,
                    ownerEmail: owner.carOwnerDetails.email,
                    bookingIds,
                    totalAmount,
                });
            }
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

    // Initialize payment form
    const form = useForm<DepositPaymentFormValues>({
        resolver: zodResolver(depositPaymentSchema),
        defaultValues: {
            mobilephone: "",
            reason: "Security deposit",
            amount: 0,
        },
    });

    // Update form amount when dialog opens
    useEffect(() => {
        if (paymentDialog.open && paymentDialog.totalAmount > 0) {
            form.setValue("amount", paymentDialog.totalAmount);
        }
    }, [paymentDialog.open, paymentDialog.totalAmount, form]);

    const closePaymentDialog = () => {
        setPaymentDialog({
            open: false,
            carOwnerId: null,
            ownerName: "",
            ownerEmail: "",
            bookingIds: [],
            totalAmount: 0,
        });
        form.reset();
    };

    const onSubmitPayment = async () => {
        if (!paymentDialog.carOwnerId) return;

        try {

            deselectAllBookings(paymentDialog.carOwnerId);
            closePaymentDialog();
        } catch (error) {
            console.error("Payment error:", error);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-16rem)] space-y-6">

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
                <Card>
                    <CardContent>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">
                                Total Owners
                            </p>
                            <p className="text-lg font-bold">{data.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">
                                Total Amount Owed
                            </p>
                            <p className="text-lg font-bold">
                                {formatCurrency(statistics.totalAmountOwed)}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Amount Paid</p>
                            <p className="text-lg font-bold">{formatCurrency(statistics.totalAmountPaid)}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
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
                        <LuX className="mr-2 h-4 w-4" />
                        Hide
                    </> : <>
                        <Filter className="mr-2 h-4 w-4" />
                        Show
                    </>} Filters
                </Button>
            </div>

            {(showFilters || data.length === 0) && (
                <Card className="flex-shrink-0">
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                            {/* Car Owner Filter */}
                            {isAdmin && (
                                <div className="space-y-2 ">
                                    <Label htmlFor="ownerId" className="text-xs text-muted-foreground">Car Owner</Label>
                                    <Combobox
                                        options={ownerOptions}
                                        value={filters.ownerId?.toString() || ""}
                                        onChange={(value) =>
                                            handleFilterChange("ownerId", value ? Number(value) : undefined)
                                        }
                                        placeholder="Select Car Owner..."
                                        emptyText="No car owner found"
                                        searchPlaceholder="Search car owner..."
                                    />
                                </div>
                            )}

                            {/* Car Filter */}
                            <div className="space-y-2 ">
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

                            {/* Deposit Status Filter */}
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="depositStatus" className="text-xs text-muted-foreground">Deposit Status</Label>
                                <Select
                                    value={filters.depositStatus || "all"}
                                    onValueChange={(value) =>
                                        handleFilterChange("depositStatus", value === "all" ? undefined : value)
                                    }
                                >
                                    <SelectTrigger size="md" id="depositStatus" className="h-10 w-full">
                                        <SelectValue placeholder="All Deposit Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Deposit Statuses</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="PARTIALLY_DEPOSITED">Partially Deposited</SelectItem>
                                        <SelectItem value="DEPOSITED">Deposited</SelectItem>
                                        <SelectItem value="REFUNDED">Refunded</SelectItem>
                                        <SelectItem value="FAILED">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Pick Up Date From */}
                            <div className="space-y-2">
                                <Label htmlFor="pickUpDateFrom" className="text-xs text-muted-foreground">Pick Up Date From</Label>
                                <Input
                                    id="pickUpDateFrom"
                                    type="date"
                                    value={filters.pickUpDateFrom || ""}
                                    onChange={(e) => handleFilterChange("pickUpDateFrom", e.target.value || undefined)}
                                    className="h-10"
                                />
                            </div>

                            {/* Pick Up Date To */}
                            <div className="space-y-2">
                                <Label htmlFor="pickUpDateTo" className="text-xs text-muted-foreground">Pick Up Date To</Label>
                                <Input
                                    id="pickUpDateTo"
                                    type="date"
                                    value={filters.pickUpDateTo || ""}
                                    onChange={(e) => handleFilterChange("pickUpDateTo", e.target.value || undefined)}
                                    className="h-10"
                                />
                            </div>

                            {/* Drop Off Date From */}
                            <div className="space-y-2">
                                <Label htmlFor="dropOffDateFrom" className="text-xs text-muted-foreground">Drop Off Date From</Label>
                                <Input
                                    id="dropOffDateFrom"
                                    type="date"
                                    value={filters.dropOffDateFrom || ""}
                                    onChange={(e) => handleFilterChange("dropOffDateFrom", e.target.value || undefined)}
                                    className="h-10"
                                />
                            </div>

                            {/* Drop Off Date To */}
                            <div className="space-y-2">
                                <Label htmlFor="dropOffDateTo" className="text-xs text-muted-foreground">Drop Off Date To</Label>
                                <Input
                                    id="dropOffDateTo"
                                    type="date"
                                    value={filters.dropOffDateTo || ""}
                                    onChange={(e) => handleFilterChange("dropOffDateTo", e.target.value || undefined)}
                                    className="h-10"
                                />
                            </div>

                            {/* Booking Date From */}
                            <div className="space-y-2">
                                <Label htmlFor="bookingDateFrom" className="text-xs text-muted-foreground">Booking Date From</Label>
                                <Input
                                    id="bookingDateFrom"
                                    type="date"
                                    value={filters.bookingDateFrom || ""}
                                    onChange={(e) => handleFilterChange("bookingDateFrom", e.target.value || undefined)}
                                    className="h-10"
                                />
                            </div>

                            {/* Booking Date To */}
                            <div className="space-y-2">
                                <Label htmlFor="bookingDateTo" className="text-xs text-muted-foreground">Booking Date To</Label>
                                <Input
                                    id="bookingDateTo"
                                    type="date"
                                    value={filters.bookingDateTo || ""}
                                    onChange={(e) => handleFilterChange("bookingDateTo", e.target.value || undefined)}
                                    className="h-10"
                                />
                            </div>

                        </div>

                        <div className="flex justify-between items-center mt-4">
                            {(filters.ownerId || filters.carId || filters.dropOffDateFrom || filters.dropOffDateTo || filters.bookingDateFrom || filters.bookingDateTo || filters.depositStatus || filters.pickUpDateFrom || filters.pickUpDateTo) && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="flex items-center gap-2"
                                >
                                    <AiOutlineClear className="w-4 h-4" />
                                    Clear All Filters
                                </Button>
                            )}
                            <Button
                                onClick={applyFilters}
                                className="flex items-center gap-2 ml-auto"
                            >
                                <Filter className="w-4 h-4" />
                                Apply Filters
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            )}

            {/* Payment List - Scrollable Container overflow-y-auto */}
            <div className="flex-1 pr-2">
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
                    <div className="space-y-4 pb-4">
                        {data.map((owner) => {
                            const selectedCount = selectedBookings[owner.carOwnerId]?.length || 0;
                            const selectedAmount = calculateSelectedAmount(owner.carOwnerId);

                            return (
                                <Card key={owner.carOwnerId}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg capitalize">
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
                                                                        ]?.includes(booking.id) ?? false;

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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Card className="flex-shrink-0">
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
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto backdrop-blur-3xl">
                    <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                        <DialogDescription>
                            Complete information for booking #{detailsDialog.booking?.id}
                        </DialogDescription>
                    </DialogHeader>

                    {detailsDialog.booking && (
                        <div className="space-y-6 py-4">
                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <Label className="text-xs">Rental Information</Label>
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

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Price per day:</span>
                                        <span className="font-medium">{formatCurrency(detailsDialog.booking.pricePerDay)}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Rate:</span>
                                        <span className="font-medium">{detailsDialog.booking.rate} %</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total Days:</span>
                                        <Badge variant="outline" className="font-semibold">
                                            {detailsDialog.booking.totalDays} days
                                        </Badge>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total Amount:</span>
                                        <span className="font-medium">{formatCurrency(detailsDialog.booking.totalAmount)}</span>
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
                                        <span className="text-lg font-bold text-primary">
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

            {/* Payment Dialog */}
            <Dialog open={paymentDialog.open} onOpenChange={(open) => !open && closePaymentDialog()}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto] backdrop-blur-3xl">
                    <DialogHeader>
                        <DialogTitle>Make Deposit Payment</DialogTitle>
                        <DialogDescription>
                            Process mobile money payment to {paymentDialog.ownerName}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Owner Information */}
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Owner:</span>
                                <span className="font-medium">{paymentDialog.ownerName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Email:</span>
                                <span className="font-medium text-sm">{paymentDialog.ownerEmail}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Bookings Selected:</span>
                                <Badge variant="outline">{paymentDialog.bookingIds.length} booking(s)</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Total Amount:</span>
                                <span className="text-xl font-bold text-primary">
                                    {formatCurrency(paymentDialog.totalAmount)}
                                </span>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmitPayment)} className="space-y-4">
                                {/* Mobile Phone Number */}
                                <FormField
                                    control={form.control}
                                    name="mobilephone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mobile Money Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="250787299001"
                                                    {...field}
                                                    className="font-mono"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter MTN or Airtel mobile money number (must start with 250)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Amount */}
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount (RWF)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                    disabled
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Payment amount in Rwandan Francs
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Reason */}
                                <FormField
                                    control={form.control}
                                    name="reason"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Reason</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter payment reason..."
                                                    className="resize-none"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Brief description of the payment (5-200 characters)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={closePaymentDialog}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={form.formState.isSubmitting}
                                    >
                                        {form.formState.isSubmitting ? "Processing..." : "Make Payment"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
