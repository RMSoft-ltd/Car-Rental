import ExcelJS from "exceljs";
import { BookingDetail } from "@/types/payment";
import { BookingsPerOwnerList } from "@/types/payment";
import { formatCurrency, formatDate } from "@/utils/formatter";

/**
 * Export booking history to Excel
 */
export async function exportBookingHistoryToExcel(
  bookings: BookingDetail[],
  filename: string = "booking-history.xlsx"
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Booking History");

  // Define columns
  worksheet.columns = [
    { header: "Booking ID", key: "id", width: 12 },
    { header: "Booking Group ID", key: "bookingGroupId", width: 20 },
    { header: "Renter Name", key: "renterName", width: 25 },
    { header: "Renter Email", key: "renterEmail", width: 30 },
    { header: "Car Owner Name", key: "ownerName", width: 25 },
    { header: "Car Owner Email", key: "ownerEmail", width: 30 },
    { header: "Car", key: "car", width: 30 },
    { header: "Plate Number", key: "plateNumber", width: 15 },
    { header: "Pick Up Date", key: "pickUpDate", width: 15 },
    { header: "Drop Off Date", key: "dropOffDate", width: 15 },
    { header: "Total Days", key: "totalDays", width: 12 },
    { header: "Price Per Day", key: "pricePerDay", width: 15 },
    { header: "Rate (%)", key: "rate", width: 12 },
    { header: "Total Amount", key: "totalAmount", width: 15 },
    { header: "Deposit Amount", key: "depositAmount", width: 15 },
    { header: "Booking Status", key: "bookingStatus", width: 15 },
    { header: "Payment Status", key: "paymentStatus", width: 15 },
    { header: "Deposit Status", key: "depositStatus", width: 18 },
    { header: "Created At", key: "createdAt", width: 20 },
    { header: "Updated At", key: "updatedAt", width: 20 },
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };

  // Add data rows
  bookings.forEach((booking) => {
    worksheet.addRow({
      id: booking.id,
      bookingGroupId: booking.bookingGroupId,
      renterName: booking.user
        ? `${booking.user.fName} ${booking.user.lName}`
        : "N/A",
      renterEmail: booking.user?.email || "N/A",
      ownerName: booking.car?.owner
        ? `${booking.car.owner.fName} ${booking.car.owner.lName}`
        : "N/A",
      ownerEmail: booking.car?.owner?.email || "N/A",
      car: booking.car
        ? `${booking.car.make} ${booking.car.model} (${booking.car.year})`
        : "N/A",
      plateNumber: booking.car?.plateNumber || "N/A",
      pickUpDate: formatDate(booking.pickUpDate),
      dropOffDate: formatDate(booking.dropOffDate),
      totalDays: booking.totalDays,
      pricePerDay: booking.pricePerDay,
      rate: booking.rate,
      totalAmount: booking.totalAmount,
      depositAmount: booking.depositAmount ?? 0,
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      depositStatus: booking.depositStatus,
      createdAt: formatDate(booking.createdAt),
      updatedAt: formatDate(booking.updatedAt),
    });
  });

  // Format currency columns
  const totalAmountCol = worksheet.getColumn("totalAmount");
  const depositAmountCol = worksheet.getColumn("depositAmount");
  const pricePerDayCol = worksheet.getColumn("pricePerDay");

  [totalAmountCol, depositAmountCol, pricePerDayCol].forEach((col) => {
    col.numFmt = "#,##0.00";
  });

  // Auto-fit columns
  worksheet.columns.forEach((column) => {
    if (column.width) {
      column.width = Math.min(column.width || 10, 50);
    }
  });

  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Export car owner payments to Excel
 */
export async function exportPaymentsToExcel(
  payments: BookingsPerOwnerList,
  filename: string = "car-owner-payments.xlsx"
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const summarySheet = workbook.addWorksheet("Summary");
  const detailsSheet = workbook.addWorksheet("Payment Details");

  // Summary sheet
  summarySheet.columns = [
    { header: "Owner ID", key: "ownerId", width: 12 },
    { header: "Owner Name", key: "ownerName", width: 25 },
    { header: "Owner Email", key: "ownerEmail", width: 30 },
    { header: "Total Bookings", key: "totalBookings", width: 15 },
    { header: "Total Amount Owed", key: "totalAmountOwed", width: 18 },
  ];

  summarySheet.getRow(1).font = { bold: true };
  summarySheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };

  // Details sheet
  detailsSheet.columns = [
    { header: "Owner ID", key: "ownerId", width: 12 },
    { header: "Owner Name", key: "ownerName", width: 25 },
    { header: "Owner Email", key: "ownerEmail", width: 30 },
    { header: "Booking ID", key: "bookingId", width: 12 },
    { header: "Booking Group ID", key: "bookingGroupId", width: 20 },
    { header: "Pick Up Date", key: "pickUpDate", width: 15 },
    { header: "Drop Off Date", key: "dropOffDate", width: 15 },
    { header: "Total Days", key: "totalDays", width: 12 },
    { header: "Total Amount", key: "totalAmount", width: 15 },
    { header: "Deposit Amount", key: "depositAmount", width: 15 },
    { header: "Booking Status", key: "bookingStatus", width: 15 },
    { header: "Payment Status", key: "paymentStatus", width: 15 },
    { header: "Deposit Status", key: "depositStatus", width: 18 },
    { header: "Created At", key: "createdAt", width: 20 },
  ];

  detailsSheet.getRow(1).font = { bold: true };
  detailsSheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };

  // Add data
  payments.forEach((owner) => {
    // Add to summary
    summarySheet.addRow({
      ownerId: owner.carOwnerId,
      ownerName: `${owner.carOwnerDetails.fname} ${owner.carOwnerDetails.lname}`,
      ownerEmail: owner.carOwnerDetails.email,
      totalBookings: owner.totalBookings,
      totalAmountOwed: owner.totalAmountOwed,
    });

    // Add booking details
    owner.details.forEach((booking) => {
      detailsSheet.addRow({
        ownerId: owner.carOwnerId,
        ownerName: `${owner.carOwnerDetails.fname} ${owner.carOwnerDetails.lname}`,
        ownerEmail: owner.carOwnerDetails.email,
        bookingId: booking.id,
        bookingGroupId: booking.bookingGroupId,
        pickUpDate: formatDate(booking.pickUpDate),
        dropOffDate: formatDate(booking.dropOffDate),
        totalDays: booking.totalDays,
        totalAmount: booking.totalAmount,
        depositAmount: booking.depositAmount ?? 0,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        depositStatus: booking.depositStatus,
        createdAt: formatDate(booking.createdAt),
      });
    });
  });

  // Format currency columns in summary
  const summaryAmountCol = summarySheet.getColumn("totalAmountOwed");
  summaryAmountCol.numFmt = "#,##0.00";

  // Format currency columns in details
  const detailsTotalAmountCol = detailsSheet.getColumn("totalAmount");
  const detailsDepositAmountCol = detailsSheet.getColumn("depositAmount");
  [detailsTotalAmountCol, detailsDepositAmountCol].forEach((col) => {
    col.numFmt = "#,##0.00";
  });

  // Auto-fit columns
  [summarySheet, detailsSheet].forEach((sheet) => {
    sheet.columns.forEach((column) => {
      if (column.width) {
        column.width = Math.min(column.width || 10, 50);
      }
    });
  });

  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

