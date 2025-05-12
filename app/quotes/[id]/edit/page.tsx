import { getQuoteById } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { EditQuoteForm } from "@/components/edit-quote-form";
import Link from "next/link";

interface EditQuotePageProps {
  params: {
    id: string;
  };
}

export default async function EditQuotePage({ params }: EditQuotePageProps) {
  const { id } = params;

  let quote;
  try {
    quote = await getQuoteById(id);
  } catch (error) {
    console.error("Error fetching quote:", error);
    return notFound();
  }

  if (!quote) {
    return notFound();
  }

  // Transform the quote data from database format to component format
  const quoteData = {
    id: quote.id,
    guestName: quote.guest_name,
    email: quote.email,
    phone: quote.phone,
    checkIn: new Date(quote.check_in),
    checkOut: new Date(quote.check_out),
    nights: quote.nights,
    adults: quote.adults,
    children: quote.children,
    roomType: quote.room_type,
    pricePerNight: quote.price_per_night,
    additionalFees: quote.additional_fees || 0,
    notes: quote.notes || "",
    bookingId: quote.booking_id || "",
    childrenDetails: quote.children_details || "",
    specialRequests: quote.special_requests || "",
    additionalServices: quote.additional_services || "",
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col mb-8">
        <Link
          href={`/quotes/${id}`}
          className="text-sky-600 hover:underline mb-2"
        >
          ← Back to Quote Details
        </Link>
        <h1 className="text-3xl font-bold">Edit Quote</h1>
        <p className="text-gray-500">
          Update the quote information for {quote.guest_name}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden p-6">
        <EditQuoteForm quoteData={quoteData} />
      </div>
    </div>
  );
}
