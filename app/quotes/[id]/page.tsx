import { getQuoteById } from "@/lib/supabase";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DeleteQuoteButton } from "@/components/delete-quote-button";

interface QuoteDetailPageProps {
  params: {
    id: string;
  };
}

export default async function QuoteDetailPage({
  params,
}: QuoteDetailPageProps) {
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

  // Calculate total price
  const totalPrice =
    quote.price_per_night * quote.nights + (quote.additional_fees || 0);

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href="/quotes"
            className="text-sky-600 hover:underline mb-2 inline-block"
          >
            ← Back to Quotes
          </Link>
          <h1 className="text-3xl font-bold">Quote for {quote.guest_name}</h1>
          <p className="text-gray-500">
            Created on {format(new Date(quote.created_at), "PPP")}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/quotes/${id}/edit`}>
            <Button variant="outline">Edit Quote</Button>
          </Link>
          <DeleteQuoteButton quoteId={id} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-sky-50 dark:bg-sky-950">
          <h2 className="text-xl font-semibold mb-4">Guest Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Guest Name</p>
              <p className="font-medium">{quote.guest_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Booking ID</p>
              <p className="font-medium">{quote.booking_id || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium">{quote.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="font-medium">{quote.phone}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Check-in</p>
              <p className="font-medium">
                {format(new Date(quote.check_in), "PPP")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Check-out</p>
              <p className="font-medium">
                {format(new Date(quote.check_out), "PPP")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Nights</p>
              <p className="font-medium">{quote.nights}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Room Type</p>
              <p className="font-medium">{quote.room_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Adults</p>
              <p className="font-medium">{quote.adults}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Children</p>
              <p className="font-medium">{quote.children}</p>
            </div>
            {quote.children_details && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Children Details</p>
                <p className="font-medium">{quote.children_details}</p>
              </div>
            )}
            {quote.special_requests && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Special Requests</p>
                <p className="font-medium">{quote.special_requests}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4">Pricing Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Price per night</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(quote.price_per_night)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Number of nights</span>
              <span>{quote.nights}</span>
            </div>
            <div className="flex justify-between">
              <span>Room cost ({quote.nights} nights)</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(quote.price_per_night * quote.nights)}
              </span>
            </div>
            {quote.additional_fees > 0 && (
              <div className="flex justify-between">
                <span>Additional fees</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(quote.additional_fees)}
                </span>
              </div>
            )}
            {quote.additional_services && (
              <div className="flex justify-between">
                <span>Additional services</span>
                <span>{quote.additional_services}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700 font-bold">
              <span>Total Price</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {quote.notes && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notes</h2>
            <p className="whitespace-pre-wrap">{quote.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
