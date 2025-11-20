import BookingContent from "@/components/dashboard/BookingContent";

interface BookingByIdPageProps {
  params: {
    bookingId: string;
  };
}

export default function BookingByIdPage({ params }: BookingByIdPageProps) {
  const parsedBookingId = Number(params.bookingId);
  const initialBookingId = Number.isNaN(parsedBookingId) ? null : parsedBookingId;

  return <BookingContent initialBookingId={initialBookingId} />;
}

