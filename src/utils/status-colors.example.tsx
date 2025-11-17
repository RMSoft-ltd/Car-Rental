/**
 * USAGE EXAMPLES for status-colors.ts utility functions
 * 
 * This file demonstrates how to use the status color utilities in your components.
 * Copy and adapt these patterns to your own components.
 */

import { Badge } from "@/components/ui/badge";
import {
    getBookingStatusConfig,
    getPaymentStatusConfig,
    getDepositStatusConfig,
    getBookingStatusLabel,
    getPaymentStatusLabel,
    getDepositStatusLabel,
    getStatusIconName,
    getStatusConfig
} from "./status-colors";
import { CheckCircle, Clock, XCircle, RefreshCw, AlertCircle, AlertTriangle } from "lucide-react";

// ============================================
// EXAMPLE 1: Basic Badge with Status
// ============================================
export function BookingStatusBadge({ status }: { status: string }) {
    const { variant, className } = getBookingStatusConfig(status);
    const label = getBookingStatusLabel(status);

    return (
        <Badge variant={variant} className={className}>
            {label}
        </Badge>
    );
}

// ============================================
// EXAMPLE 2: Badge with Icon
// ============================================
export function PaymentStatusBadgeWithIcon({ status }: { status: string }) {
    const { variant, className } = getPaymentStatusConfig(status);
    const label = getPaymentStatusLabel(status);
    const iconName = getStatusIconName(status);

    // Map icon names to actual icon components
    const iconMap: Record<string, React.ReactNode> = {
        CheckCircle: <CheckCircle className="w-3 h-3" />,
        Clock: <Clock className="w-3 h-3" />,
        XCircle: <XCircle className="w-3 h-3" />,
        RefreshCw: <RefreshCw className="w-3 h-3" />,
        AlertCircle: <AlertCircle className="w-3 h-3" />,
        AlertTriangle: <AlertTriangle className="w-3 h-3" />,
    };

    const icon = iconMap[iconName] || <Clock className="w-3 h-3" />;

    return (
        <Badge variant={variant} className={className}>
            {icon}
            <span className="ml-1">{label}</span>
        </Badge>
    );
}

// ============================================
// EXAMPLE 3: Deposit Status Badge
// ============================================
export function DepositStatusBadge({ status }: { status: string }) {
    const { variant, className } = getDepositStatusConfig(status);
    const label = getDepositStatusLabel(status);

    return (
        <Badge variant={variant} className={className}>
            {label}
        </Badge>
    );
}

// ============================================
// EXAMPLE 4: Auto-detect Status Type
// ============================================
export function GenericStatusBadge({ status }: { status: string }) {
    // This automatically detects whether it's a booking, payment, or deposit status
    const { variant, className } = getStatusConfig(status);

    return (
        <Badge variant={variant} className={className}>
            {status}
        </Badge>
    );
}

// ============================================
// EXAMPLE 5: Status in a Table Cell
// ============================================
export function BookingTableRow({ booking }: { booking: any }) {
    const bookingConfig = getBookingStatusConfig(booking.bookingStatus);
    const paymentConfig = getPaymentStatusConfig(booking.paymentStatus);
    const depositConfig = getDepositStatusConfig(booking.depositStatus);

    return (
        <tr>
            <td>#{booking.id}</td>
            <td>
                <Badge variant={bookingConfig.variant} className={bookingConfig.className}>
                    {getBookingStatusLabel(booking.bookingStatus)}
                </Badge>
            </td>
            <td>
                <Badge variant={paymentConfig.variant} className={paymentConfig.className}>
                    {getPaymentStatusLabel(booking.paymentStatus)}
                </Badge>
            </td>
            <td>
                <Badge variant={depositConfig.variant} className={depositConfig.className}>
                    {getDepositStatusLabel(booking.depositStatus)}
                </Badge>
            </td>
        </tr>
    );
}

// ============================================
// EXAMPLE 6: Status List with All Variants
// ============================================
export function StatusShowcase() {
    const bookingStatuses = ["CONFIRMED", "PENDING", "PROCESSING", "CANCELLED", "COMPLETED", "EXPIRED"];
    const paymentStatuses = ["PAID", "UNPAID", "PENDING", "PROCESSING", "FAILED", "REFUNDED"];
    const depositStatuses = ["DEPOSITED", "PENDING", "PROCESSING", "PARTIALLY_DEPOSITED", "REFUNDED", "FAILED"];

    return (
        <div className="space-y-6 p-6">
            <div>
                <h3 className="font-semibold mb-3">Booking Statuses</h3>
                <div className="flex flex-wrap gap-2">
                    {bookingStatuses.map((status) => {
                        const { variant, className } = getBookingStatusConfig(status);
                        return (
                            <Badge key={status} variant={variant} className={className}>
                                {getBookingStatusLabel(status)}
                            </Badge>
                        );
                    })}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-3">Payment Statuses</h3>
                <div className="flex flex-wrap gap-2">
                    {paymentStatuses.map((status) => {
                        const { variant, className } = getPaymentStatusConfig(status);
                        return (
                            <Badge key={status} variant={variant} className={className}>
                                {getPaymentStatusLabel(status)}
                            </Badge>
                        );
                    })}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-3">Deposit Statuses</h3>
                <div className="flex flex-wrap gap-2">
                    {depositStatuses.map((status) => {
                        const { variant, className } = getDepositStatusConfig(status);
                        return (
                            <Badge key={status} variant={variant} className={className}>
                                {getDepositStatusLabel(status)}
                            </Badge>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ============================================
// QUICK REFERENCE
// ============================================
/*

BOOKING STATUSES:
- CONFIRMED (green)
- COMPLETED (blue)
- PENDING (yellow)
- PROCESSING (blue)
- CANCELLED (red)
- REJECTED (red)
- EXPIRED (gray outline)

PAYMENT STATUSES:
- PAID (green)
- UNPAID (red light)
- PENDING (yellow)
- PROCESSING (blue)
- FAILED (red)
- REFUNDED (purple outline)
- PARTIALLY_PAID (orange)

DEPOSIT STATUSES:
- DEPOSITED (green)
- PENDING (yellow)
- PROCESSING (blue)
- PARTIALLY_DEPOSITED (orange)
- REFUNDED (purple outline)
- FAILED (red)

*/
