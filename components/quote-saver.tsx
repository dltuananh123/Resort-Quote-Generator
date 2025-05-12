"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { saveQuote, isMockMode } from "@/lib/supabase";
import { useTranslation } from "@/lib/translation-context";
import { useToast } from "@/components/ui/use-toast";

interface QuoteSaverProps {
  quoteData: {
    guestName: string;
    email: string;
    phone: string;
    checkIn: Date;
    checkOut: Date;
    nights: number;
    adults: number;
    children: number;
    roomType: string;
    pricePerNight: number;
    additionalFees: number;
    notes?: string;
    bookingId?: string;
    childrenDetails?: string;
    specialRequests?: string;
    additionalServices?: string;
  };
  className?: string;
}

export function QuoteSaver({ quoteData, className }: QuoteSaverProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  // Hide debug info by default
  const [debugInfo, setDebugInfo] = useState<any>(null);
  // Set to false to hide debug info completely
  const showDebugInfo = false;

  const handleSaveQuote = async () => {
    setIsSaving(true);
    setDebugInfo(null);

    try {
      console.log("QuoteSaver received data:", quoteData);

      // Basic validation
      const validationIssues = [];
      if (!quoteData) validationIssues.push("No quote data provided");
      if (!quoteData.guestName) validationIssues.push("Missing guest name");
      if (!quoteData.roomType) validationIssues.push("Missing room type");

      // Check if dates are valid and fix them if needed
      let checkIn = quoteData.checkIn;
      let checkOut = quoteData.checkOut;

      // Validate and fix checkIn if needed
      if (!(checkIn instanceof Date) || isNaN(checkIn.getTime())) {
        console.error("Invalid checkIn date, setting to current date");
        checkIn = new Date();
        validationIssues.push(
          "Check-in date was invalid and has been set to today"
        );
      }

      // Validate and fix checkOut if needed
      if (!(checkOut instanceof Date) || isNaN(checkOut.getTime())) {
        console.error("Invalid checkOut date, creating based on checkIn");
        checkOut = new Date(checkIn);
        checkOut.setDate(checkIn.getDate() + (quoteData.nights || 1));
        validationIssues.push(
          "Check-out date was invalid and has been set to check-in + nights"
        );
      }

      // Ensure checkOut is after checkIn
      if (checkOut <= checkIn) {
        console.error("checkOut not after checkIn, fixing...");
        checkOut = new Date(checkIn);
        checkOut.setDate(checkIn.getDate() + (quoteData.nights || 1));
        validationIssues.push(
          "Check-out date was not after check-in and has been fixed"
        );
      }

      // Continue with validation if there are critical issues
      if (
        validationIssues.length > 0 &&
        (!quoteData || !quoteData.guestName || !quoteData.roomType)
      ) {
        const errorMsg = `Validation failed: ${validationIssues.join(", ")}`;
        console.error(errorMsg, { quoteData });
        if (showDebugInfo) {
          setDebugInfo({
            error: errorMsg,
            quoteData: JSON.stringify(quoteData, null, 2),
          });
        }
        throw new Error(errorMsg);
      }

      // Map the component data structure to the database structure with fixed dates
      const quote = {
        guest_name: quoteData.guestName,
        email: quoteData.email || "",
        phone: quoteData.phone || "",
        check_in: checkIn.toISOString(), // Use fixed date
        check_out: checkOut.toISOString(), // Use fixed date
        nights:
          quoteData.nights ||
          Math.max(
            1,
            Math.ceil(
              (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
            )
          ),
        adults: quoteData.adults || 0,
        children: quoteData.children || 0,
        room_type: quoteData.roomType,
        price_per_night: quoteData.pricePerNight || 0,
        additional_fees: quoteData.additionalFees || 0,
        notes: quoteData.notes || "",
        booking_id: quoteData.bookingId || "",
        children_details: quoteData.childrenDetails || "",
        special_requests: quoteData.specialRequests || "",
        additional_services: quoteData.additionalServices || "",
      };

      console.log("Saving quote:", quote);
      console.log("Using mock mode:", isMockMode);

      const saved = await saveQuote(quote);
      console.log("Quote saved successfully:", saved);

      // Only store debug info if it's enabled
      if (showDebugInfo) {
        setDebugInfo({
          success: true,
          mockMode: isMockMode,
          savedData: saved,
          warnings: validationIssues.length > 0 ? validationIssues : undefined,
        });
      }

      toast({
        title: t("quote.saveSuccess") || "Quote Saved",
        description:
          t("quote.saveSuccessDetail") ||
          `Your quote has been saved${isMockMode ? " (mock mode)" : ""}`,
        variant: "default",
      });

      // You could redirect to a quotes list page or perform other actions
      // router.push(`/quotes/${saved.id}`);
    } catch (error) {
      console.error("Failed to save quote:", error);

      let errorMessage =
        error instanceof Error ? error.message : "Unknown error saving quote";

      toast({
        title: t("quote.saveError") || "Error Saving Quote",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleSaveQuote}
        disabled={isSaving}
        className={className}
        variant="secondary"
      >
        {isSaving ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t("quote.saving") || "Saving..."}
          </>
        ) : (
          <>{t("quote.saveToDatabase") || "Save To Database"}</>
        )}
      </Button>

      {/* Only show debug info if enabled and if there's something to show */}
      {showDebugInfo && debugInfo && (
        <div className="mt-2 p-2 text-xs bg-gray-100 rounded max-h-40 overflow-auto">
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
