/**
 * Utility functions for consistent status badge styling across the application
 */

/**
 * Badge variant type - matches shadcn/ui Badge component variants
 */
export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

/**
 * Status color configuration
 */
interface StatusConfig {
  variant: BadgeVariant;
  className?: string;
}

/**
 * Booking status types
 */
export type BookingStatus =
  | "CONFIRMED"
  | "PENDING"
  | "PROCESSING"
  | "CANCELLED"
  | "COMPLETED"
  | "EXPIRED"
  | "REJECTED";

/**
 * Payment status types
 */
export type PaymentStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "REFUNDED"
  | "PROCESSING";

/**
 * Deposit status types
 */
export type DepositStatus =
  | "PENDING"
  | "DEPOSITED"
  | "PARTIALLY_DEPOSITED"
  | "REFUNDED"
  | "FAILED"
  | "PROCESSING";

/**
 * Get badge variant and className for booking status
 *
 * @param status - The booking status
 * @returns Object with variant and optional className
 *
 * @example
 * ```tsx
 * const { variant, className } = getBookingStatusConfig("CONFIRMED");
 * <Badge variant={variant} className={className}>Confirmed</Badge>
 * ```
 */
export function getBookingStatusConfig(status: string): StatusConfig {
  const normalizedStatus = status.toUpperCase() as BookingStatus;

  const configs: Record<BookingStatus, StatusConfig> = {
    CONFIRMED: {
      variant: "default",
      className: "bg-green-500 hover:bg-green-600 text-white",
    },
    COMPLETED: {
      variant: "default",
      className: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    PENDING: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    },
    PROCESSING: {
      variant: "secondary",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    },
    CANCELLED: {
      variant: "destructive",
      className: "bg-red-500 hover:bg-red-600 text-white",
    },
    REJECTED: {
      variant: "destructive",
      className: "bg-red-500 hover:bg-red-600 text-white",
    },
    EXPIRED: {
      variant: "outline",
      className: "border-gray-400 text-gray-600 hover:bg-gray-100",
    },
  };

  return (
    configs[normalizedStatus] || {
      variant: "outline",
      className: "border-gray-300 text-gray-600",
    }
  );
}

/**
 * Get badge variant and className for payment status
 *
 * @param status - The payment status
 * @returns Object with variant and optional className
 *
 * @example
 * ```tsx
 * const { variant, className } = getPaymentStatusConfig("PAID");
 * <Badge variant={variant} className={className}>Paid</Badge>
 * ```
 */
export function getPaymentStatusConfig(status: string): StatusConfig {
  const normalizedStatus = status.toUpperCase() as PaymentStatus;

  const configs: Record<PaymentStatus, StatusConfig> = {
    PAID: {
      variant: "default",
      className: "bg-green-500 hover:bg-green-600 text-white",
    },
    UNPAID: {
      variant: "destructive",
      className: "bg-red-100 text-red-800 hover:bg-red-200",
    },
    PROCESSING: {
      variant: "secondary",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    },
    REFUNDED: {
      variant: "outline",
      className: "border-purple-400 text-purple-700 hover:bg-purple-50",
    },
    PARTIALLY_PAID: {
      variant: "secondary",
      className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    },
  };

  return (
    configs[normalizedStatus] || {
      variant: "secondary",
      className: "bg-gray-100 text-gray-800",
    }
  );
}

/**
 * Get badge variant and className for deposit status
 *
 * @param status - The deposit status
 * @returns Object with variant and optional className
 *
 * @example
 * ```tsx
 * const { variant, className } = getDepositStatusConfig("DEPOSITED");
 * <Badge variant={variant} className={className}>Deposited</Badge>
 * ```
 */
export function getDepositStatusConfig(status: string): StatusConfig {
  const normalizedStatus = status.toUpperCase() as DepositStatus;

  const configs: Record<DepositStatus, StatusConfig> = {
    DEPOSITED: {
      variant: "default",
      className: "bg-green-500 hover:bg-green-600 text-white",
    },
    PENDING: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    },
    PROCESSING: {
      variant: "secondary",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    },
    PARTIALLY_DEPOSITED: {
      variant: "secondary",
      className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    },
    REFUNDED: {
      variant: "outline",
      className: "border-purple-400 text-purple-700 hover:bg-purple-50",
    },
    FAILED: {
      variant: "destructive",
      className: "bg-red-500 hover:bg-red-600 text-white",
    },
  };

  return (
    configs[normalizedStatus] || {
      variant: "secondary",
      className: "bg-gray-100 text-gray-800",
    }
  );
}

/**
 * Get user-friendly label for booking status
 *
 * @param status - The booking status
 * @returns Formatted status label
 */
export function getBookingStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    CONFIRMED: "Confirmed",
    PENDING: "Pending",
    PROCESSING: "Processing",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
    EXPIRED: "Expired",
    REJECTED: "Rejected",
  };

  return labels[status.toUpperCase()] || status;
}

/**
 * Get user-friendly label for payment status
 *
 * @param status - The payment status
 * @returns Formatted status label
 */
export function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    UNPAID: "Unpaid",
    PARTIALLY_PAID: "Partially Paid",
    PAID: "Paid",
    PROCESSING: "Processing",
    REFUNDED: "Refunded",
  };

  return labels[status.toUpperCase()] || status;
}

/**
 * Get user-friendly label for deposit status
 *
 * @param status - The deposit status
 * @returns Formatted status label
 */
export function getDepositStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Pending",
    DEPOSITED: "Deposited",
    PARTIALLY_DEPOSITED: "Partially Deposited",
    REFUNDED: "Refunded",
    FAILED: "Failed",
    PROCESSING: "Processing",
  };

  return labels[status.toUpperCase()] || status;
}

/**
 * Get icon component name for status (to be used with lucide-react icons)
 *
 * @param status - Any status string
 * @returns Icon name suggestion
 */
export function getStatusIconName(status: string): string {
  const normalizedStatus = status.toUpperCase();

  if (
    ["CONFIRMED", "COMPLETED", "PAID", "DEPOSITED"].includes(normalizedStatus)
  ) {
    return "CheckCircle";
  }
  if (["PENDING", "UNPAID", "PROCESSING"].includes(normalizedStatus)) {
    return "Clock";
  }
  if (["CANCELLED", "REJECTED"].includes(normalizedStatus)) {
    return "XCircle";
  }
  if (["REFUNDED"].includes(normalizedStatus)) {
    return "RefreshCw";
  }
  if (["PARTIALLY_PAID", "PARTIALLY_DEPOSITED"].includes(normalizedStatus)) {
    return "AlertCircle";
  }
  if (["EXPIRED"].includes(normalizedStatus)) {
    return "AlertTriangle";
  }

  return "Circle";
}

/**
 * Combined status config getter - auto-detects status type
 *
 * @param status - Any status string
 * @param type - Optional type hint ('booking', 'payment', 'deposit')
 * @returns Status configuration
 */
export function getStatusConfig(
  status: string,
  type?: "booking" | "payment" | "deposit"
): StatusConfig {
  if (type === "booking") {
    return getBookingStatusConfig(status);
  }
  if (type === "payment") {
    return getPaymentStatusConfig(status);
  }
  if (type === "deposit") {
    return getDepositStatusConfig(status);
  }

  // Auto-detect based on common patterns
  const normalizedStatus = status.toUpperCase();

  // Booking-specific statuses
  if (
    ["CONFIRMED", "COMPLETED", "EXPIRED", "REJECTED"].includes(normalizedStatus)
  ) {
    return getBookingStatusConfig(status);
  }

  // Payment-specific statuses
  if (["PAID", "UNPAID", "PARTIALLY_PAID"].includes(normalizedStatus)) {
    return getPaymentStatusConfig(status);
  }

  // Deposit-specific statuses
  if (["DEPOSITED", "PARTIALLY_DEPOSITED"].includes(normalizedStatus)) {
    return getDepositStatusConfig(status);
  }

  // Default to payment status for common statuses
  return getPaymentStatusConfig(status);
}
