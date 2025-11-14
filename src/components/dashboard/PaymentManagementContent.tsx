"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService } from "@/services/payment.service";
import {
    BookingsPerOwnerList,
    BookingPerOwner,
    BookingDetail,
} from "@/types/payment";
import {
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    Calendar,
    User,
    Download,
    Send,
    Eye,
    Filter,
    CreditCard,
    Smartphone,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function PaymentManagementContent() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    const [bookingsData, setBookingsData] = useState<BookingsPerOwnerList>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<string>("all");
    const [expandedOwners, setExpandedOwners] = useState<Set<number>>(new Set());
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState<BookingPerOwner | null>(null);
    const [depositDetails, setDepositDetails] = useState({
        amount: "",
        paymentMethod: "bank" as "bank" | "momo",
        bankName: "",
        accountNumber: "",
        accountName: "",
        phoneNumber: "",
        provider: "MTN" as "MTN" | "Airtel",
        notes: "",
    });

    // Fetch bookings data on component mount
    useEffect(() => {
        fetchBookingsData();
    }, []);

    const fetchBookingsData = async () => {
        try {
            setLoading(true);
            setError(null);

            if (isAdmin) {
                // Admin: Get all car owners' bookings
                const data = await paymentService.getUnpaidBookingsPerOwner();
                setBookingsData(data);
            } else if (user?.id) {
                // Car Owner: Get only their bookings
                const data = await paymentService.getOwnerUnpaidBookings(user.id);
                setBookingsData([data]);
            }
        } catch (err) {
            console.error("Error fetching bookings:", err);
            setError("Failed to load bookings data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const stats = {
        totalAmountOwed: bookingsData.reduce(
            (sum, owner) => sum + owner.totalAmountOwed,
            0
        ),
        walletBalance: 0, // This should come from the API - current available balance
        totalBookings: bookingsData.reduce((sum, owner) => sum + owner.totalBookings, 0),
        completedPayouts: bookingsData.reduce(
            (sum, owner) => sum + owner.details.filter((b) => b.depositStatus === "PAID").length,
            0
        ),
    };    // Filter bookings based on deposit status
    const filteredBookings =
        selectedFilter === "all"
            ? bookingsData
            : bookingsData.filter((owner) =>
                owner.details.some((booking) => booking.depositStatus === selectedFilter.toUpperCase())
            );

    const toggleOwnerExpand = (ownerId: number) => {
        setExpandedOwners((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(ownerId)) {
                newSet.delete(ownerId);
            } else {
                newSet.add(ownerId);
            }
            return newSet;
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-RW", {
            style: "currency",
            currency: "RWF",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status.toUpperCase()) {
            case "PAID":
            case "CONFIRMED":
            case "COMPLETED":
                return "default"; // green
            case "PENDING":
                return "secondary"; // yellow-ish
            case "REFUNDED":
                return "outline"; // blue-ish
            case "FAILED":
            case "CANCELLED":
                return "destructive"; // red
            default:
                return "outline";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case "PAID":
                return "bg-green-100 text-green-800";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "REFUNDED":
                return "bg-blue-100 text-blue-800";
            case "FAILED":
                return "bg-red-100 text-red-800";
            case "CONFIRMED":
                return "bg-green-100 text-green-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            case "COMPLETED":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleInitiateDeposit = (owner: BookingPerOwner) => {
        setSelectedOwner(owner);
        setDepositDetails({
            ...depositDetails,
            amount: owner.totalAmountOwed.toString(),
        });
        setShowDepositModal(true);
    };

    const handleSubmitDeposit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedOwner) return;

        try {
            await paymentService.initiateDeposit({
                carOwnerId: selectedOwner.carOwnerId.toString(),
                amount: parseFloat(depositDetails.amount),
                paymentMethod: depositDetails.paymentMethod,
                bankDetails:
                    depositDetails.paymentMethod === "bank"
                        ? {
                            bankName: depositDetails.bankName,
                            accountNumber: depositDetails.accountNumber,
                            accountName: depositDetails.accountName,
                        }
                        : undefined,
                momoDetails:
                    depositDetails.paymentMethod === "momo"
                        ? {
                            phoneNumber: depositDetails.phoneNumber,
                            provider: depositDetails.provider,
                        }
                        : undefined,
                notes: depositDetails.notes,
            });

            // Refresh data
            await fetchBookingsData();
            setShowDepositModal(false);

            // Reset form
            setDepositDetails({
                amount: "",
                paymentMethod: "bank",
                bankName: "",
                accountNumber: "",
                accountName: "",
                phoneNumber: "",
                provider: "MTN",
                notes: "",
            });
        } catch (err) {
            console.error("Error initiating deposit:", err);
            alert("Failed to initiate deposit. Please try again.");
        }
    };

    // Loading state
    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center h-64 py-12">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-muted-foreground animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading bookings data...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Error state
    if (error) {
        return (
            <Card className="border-destructive">
                <CardContent className="py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={fetchBookingsData} variant="destructive">
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
                                <p className="text-2xl font-bold">{stats.totalBookings}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Amount Owed</p>
                                <p className="text-2xl font-bold">
                                    {formatCurrency(stats.totalAmountOwed)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Wallet Balance</p>
                                <p className="text-2xl font-bold">
                                    {formatCurrency(stats.walletBalance)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Completed Payouts</p>
                                <p className="text-2xl font-bold">{stats.completedPayouts}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Actions */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-muted-foreground" />
                            <Label htmlFor="deposit-status-filter" className="text-sm font-medium">
                                Deposit Status:
                            </Label>
                            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                <SelectTrigger id="deposit-status-filter" className="w-[180px]">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button>
                            <Download />
                            Export Report
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Bookings Per Owner */}
            <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                No bookings found
                            </h3>
                            <p className="text-muted-foreground">
                                {selectedFilter !== "all"
                                    ? `No ${selectedFilter} bookings to display.`
                                    : "No bookings available at the moment."}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredBookings.map((owner) => (
                        <Collapsible
                            key={owner.carOwnerId}
                            open={expandedOwners.has(owner.carOwnerId)}
                            onOpenChange={() => toggleOwnerExpand(owner.carOwnerId)}
                        >
                            <Card>
                                {/* Owner Header */}
                                <div className="bg-muted/50 border-b p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <CollapsibleTrigger asChild>
                                                <Button variant="ghost" size="icon-sm">
                                                    {expandedOwners.has(owner.carOwnerId) ? (
                                                        <ChevronUp className="w-5 h-5" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5" />
                                                    )}
                                                </Button>
                                            </CollapsibleTrigger>

                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                                    <User className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold">
                                                        {owner.carOwnerDetails.fname} {owner.carOwnerDetails.lname}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {owner.carOwnerDetails.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">Total Bookings</p>
                                                <p className="text-xl font-bold">
                                                    {owner.totalBookings}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">Amount Owed</p>
                                                <p className="text-xl font-bold text-green-600">
                                                    {formatCurrency(owner.totalAmountOwed)}
                                                </p>
                                            </div>

                                            {isAdmin && owner.totalAmountOwed > 0 && (
                                                <Button onClick={() => handleInitiateDeposit(owner)}>
                                                    <Send />
                                                    Pay Owner
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bookings Details Table */}
                                <CollapsibleContent>
                                    <CardContent className="pt-6">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Booking ID</TableHead>
                                                    <TableHead>Car ID</TableHead>
                                                    <TableHead>Rental Period</TableHead>
                                                    <TableHead>Days</TableHead>
                                                    <TableHead>Amount</TableHead>
                                                    <TableHead>Booking Status</TableHead>
                                                    <TableHead>Payment Status</TableHead>
                                                    <TableHead>Deposit Status</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {owner.details.map((booking) => (
                                                    <TableRow key={booking.id}>
                                                        <TableCell>
                                                            <div className="text-sm font-medium">
                                                                #{booking.id}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {booking.bookingGroupId.slice(0, 8)}...
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm">
                                                                Car #{booking.carId}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1 text-sm">
                                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                                <div>
                                                                    <div>{formatDate(booking.pickUpDate)}</div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        to {formatDate(booking.dropOffDate)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm font-medium">
                                                                {booking.totalDays} days
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm font-bold text-green-600">
                                                                {formatCurrency(booking.totalAmount)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={getStatusVariant(booking.bookingStatus)} className="gap-1">
                                                                {booking.bookingStatus === "CONFIRMED" && (
                                                                    <CheckCircle className="w-3 h-3" />
                                                                )}
                                                                {booking.bookingStatus === "PENDING" && (
                                                                    <Clock className="w-3 h-3" />
                                                                )}
                                                                {booking.bookingStatus === "CANCELLED" && (
                                                                    <XCircle className="w-3 h-3" />
                                                                )}
                                                                {booking.bookingStatus}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={getStatusVariant(booking.paymentStatus)} className="gap-1">
                                                                {booking.paymentStatus === "PAID" && (
                                                                    <CheckCircle className="w-3 h-3" />
                                                                )}
                                                                {booking.paymentStatus === "PENDING" && (
                                                                    <Clock className="w-3 h-3" />
                                                                )}
                                                                {booking.paymentStatus}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={getStatusVariant(booking.depositStatus)} className="gap-1">
                                                                {booking.depositStatus === "PAID" && (
                                                                    <CheckCircle className="w-3 h-3" />
                                                                )}
                                                                {booking.depositStatus === "PENDING" && (
                                                                    <Clock className="w-3 h-3" />
                                                                )}
                                                                {booking.depositStatus}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                title="View Details"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>
                    ))
                )}
            </div>

            {/* Deposit Modal */}
            <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Initiate Deposit to Car Owner</DialogTitle>
                        <DialogDescription>
                            Transfer funds to{" "}
                            <span className="font-semibold">
                                {selectedOwner?.carOwnerDetails.fname}{" "}
                                {selectedOwner?.carOwnerDetails.lname}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmitDeposit} className="space-y-6">
                        {/* Amount */}
                        <div className="space-y-2">
                            <Label htmlFor="deposit-amount">Amount (RWF)</Label>
                            <Input
                                id="deposit-amount"
                                type="number"
                                value={depositDetails.amount}
                                onChange={(e) =>
                                    setDepositDetails({ ...depositDetails, amount: e.target.value })
                                }
                                placeholder="Enter amount"
                                required
                            />
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-2">
                            <Label>Payment Method</Label>
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant={depositDetails.paymentMethod === "bank" ? "default" : "outline"}
                                    className="flex-1"
                                    onClick={() =>
                                        setDepositDetails({ ...depositDetails, paymentMethod: "bank" })
                                    }
                                >
                                    <CreditCard />
                                    Bank Transfer
                                </Button>
                                <Button
                                    type="button"
                                    variant={depositDetails.paymentMethod === "momo" ? "default" : "outline"}
                                    className="flex-1"
                                    onClick={() =>
                                        setDepositDetails({ ...depositDetails, paymentMethod: "momo" })
                                    }
                                >
                                    <Smartphone />
                                    Mobile Money
                                </Button>
                            </div>
                        </div>

                        {/* Bank Details */}
                        {depositDetails.paymentMethod === "bank" && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bank-name">Bank Name</Label>
                                    <Input
                                        id="bank-name"
                                        type="text"
                                        value={depositDetails.bankName}
                                        onChange={(e) =>
                                            setDepositDetails({
                                                ...depositDetails,
                                                bankName: e.target.value,
                                            })
                                        }
                                        placeholder="Enter bank name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="account-number">Account Number</Label>
                                    <Input
                                        id="account-number"
                                        type="text"
                                        value={depositDetails.accountNumber}
                                        onChange={(e) =>
                                            setDepositDetails({
                                                ...depositDetails,
                                                accountNumber: e.target.value,
                                            })
                                        }
                                        placeholder="Enter account number"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="account-name">Account Name</Label>
                                    <Input
                                        id="account-name"
                                        type="text"
                                        value={depositDetails.accountName}
                                        onChange={(e) =>
                                            setDepositDetails({
                                                ...depositDetails,
                                                accountName: e.target.value,
                                            })
                                        }
                                        placeholder="Enter account name"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Mobile Money Details */}
                        {depositDetails.paymentMethod === "momo" && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="momo-provider">Provider</Label>
                                    <Select
                                        value={depositDetails.provider}
                                        onValueChange={(value) =>
                                            setDepositDetails({
                                                ...depositDetails,
                                                provider: value as "MTN" | "Airtel",
                                            })
                                        }
                                    >
                                        <SelectTrigger id="momo-provider">
                                            <SelectValue placeholder="Select provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MTN">MTN Mobile Money</SelectItem>
                                            <SelectItem value="Airtel">Airtel Money</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="momo-phone">Phone Number</Label>
                                    <Input
                                        id="momo-phone"
                                        type="tel"
                                        value={depositDetails.phoneNumber}
                                        onChange={(e) =>
                                            setDepositDetails({
                                                ...depositDetails,
                                                phoneNumber: e.target.value,
                                            })
                                        }
                                        placeholder="+250 xxx xxx xxx"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="deposit-notes">Notes (Optional)</Label>
                            <textarea
                                id="deposit-notes"
                                value={depositDetails.notes}
                                onChange={(e) =>
                                    setDepositDetails({ ...depositDetails, notes: e.target.value })
                                }
                                rows={3}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Add any additional notes..."
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowDepositModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                <Send />
                                Initiate Deposit
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
