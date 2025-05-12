import { Suspense } from "react";
import { getQuotes } from "@/lib/supabase";
import { format } from "date-fns";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function QuotesList() {
  const quotes = await getQuotes();

  if (!quotes || quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-2xl font-bold mb-4">No saved quotes found</h2>
        <p className="text-gray-500 mb-8">
          You haven&apos;t saved any quotes yet. Create a new quote and save it
          to see it here.
        </p>
        <Link href="/">
          <Button>Create New Quote</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {quotes.map((quote) => (
        <Card key={quote.id} className="overflow-hidden">
          <CardHeader className="bg-sky-50 dark:bg-sky-950">
            <CardTitle className="truncate">{quote.guest_name}</CardTitle>
            <CardDescription>
              {format(new Date(quote.created_at), "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Check-in:</span>
                <span>{format(new Date(quote.check_in), "PP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Check-out:</span>
                <span>{format(new Date(quote.check_out), "PP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Nights:</span>
                <span>{quote.nights}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Room:</span>
                <span className="truncate max-w-[180px]">
                  {quote.room_type}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    quote.price_per_night * quote.nights +
                      (quote.additional_fees || 0)
                  )}
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Link href={`/quotes/${quote.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
              <Link href={`/quotes/${quote.id}/edit`} className="flex-1">
                <Button variant="secondary" className="w-full">
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function QuotesPage() {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Saved Quotes</h1>
        <Link href="/">
          <Button>Create New Quote</Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading saved quotes...</div>}>
        <QuotesList />
      </Suspense>
    </div>
  );
}
