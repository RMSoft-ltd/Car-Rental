import BookingContent from "@/components/dashboard/BookingContent";

type BookingByIdParams = {
  bookingId: string;
};

export default async function BookingByIdPage({
  params,
}: {
  params: Promise<BookingByIdParams>;
}) {
  const resolvedParams = await params;
  const parsedBookingId = Number(resolvedParams.bookingId);
  const initialBookingId = Number.isNaN(parsedBookingId) ? null : parsedBookingId;

  return <BookingContent initialBookingId={initialBookingId} />;
}

