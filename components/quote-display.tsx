"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { SimpleQuoteExport } from "@/components/simple-quote-export";
import { useTranslation } from "@/lib/translation-context";
import { FileText } from "lucide-react";

interface QuoteData {
  bookingId: string;
  customerName: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  roomType: string;
  adults: number;
  children: number;
  childrenDetails: string;
  specialRequests: string;
  pricePerNight: string;
  totalRoomCost: string;
  additionalFees: string;
  additionalServices: string;
  grandTotal: string;
  email?: string;
}

export function QuoteDisplay() {
  const { t, currentLanguage } = useTranslation();
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);

  useEffect(() => {
    // Listen for quote update events
    const handleUpdateQuote = (event: CustomEvent<QuoteData>) => {
      setQuoteData(event.detail);
    };

    window.addEventListener("updateQuote", handleUpdateQuote as EventListener);

    return () => {
      window.removeEventListener(
        "updateQuote",
        handleUpdateQuote as EventListener
      );
    };
  }, []);

  if (!quoteData) {
    return (
      <div className="border border-dashed border-sky-300 rounded-lg p-8 text-center bg-sky-50 min-h-[400px] flex flex-col items-center justify-center">
        <FileText className="w-16 h-16 text-sky-300 mb-4" />
        <p className="text-sky-800 text-lg font-medium mb-2">
          {t("quote.noData")}
        </p>
        <p className="text-sm text-sky-600 max-w-xs mx-auto">
          {t("quote.pleaseEnterData")}
        </p>
      </div>
    );
  }

  // Format translation strings with variables
  const totalRoomCostText = t("quote.totalRoomCost").replace(
    "{nights}",
    quoteData.nights.toString()
  );
  const additionalServicesText = quoteData.additionalServices
    ? t("quote.additionalServices").replace(
        "{services}",
        quoteData.additionalServices
      )
    : "";

  // Format the current date based on selected language
  const currentDateFormatted = new Date().toLocaleDateString(
    currentLanguage === "en" ? "en-US" : "vi-VN"
  );

  // Prepare data for saving to database
  const prepareExportData = () => {
    console.log("Original quote data:", quoteData);

    // Parse string dates into Date objects
    const parseDate = (dateStr: string) => {
      if (!dateStr) return new Date();
      try {
        const [day, month, year] = dateStr.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        // Check if date is valid
        if (isNaN(date.getTime())) {
          console.error("Invalid date from string:", dateStr);
          return new Date(); // Return current date as fallback
        }
        return date;
      } catch (e) {
        console.error("Error parsing date:", e, dateStr);
        return new Date(); // Return current date as fallback
      }
    };

    // Ensure we have valid dates
    const checkIn = parseDate(quoteData.checkInDate);
    // Set checkOut to be at least 1 day after checkIn if it's invalid
    let checkOut = parseDate(quoteData.checkOutDate);
    if (isNaN(checkOut.getTime()) || !quoteData.checkOutDate) {
      checkOut = new Date(checkIn);
      checkOut.setDate(checkIn.getDate() + Number(quoteData.nights || 1));
      console.log("Created fallback checkOut date:", checkOut);
    }

    // Parse prices to remove formatting
    const parsePrice = (priceStr: string) => {
      if (!priceStr) return 0;
      return parseInt(priceStr.replace(/[^\d]/g, "") || "0");
    };

    // Ensure we have valid guest name and room type
    const guestName = quoteData.customerName || "Guest";
    const roomType = quoteData.roomType || "Standard Room";

    // Check and fix email/phone - they might be swapped
    // Email typically contains @ symbol, phone typically has mostly digits
    let email = quoteData.email || "";
    let phone = quoteData.phone || "";

    // If email looks more like a phone number and phone looks like an email, swap them
    const emailLooksLikePhone =
      email &&
      !email.includes("@") &&
      email.replace(/\D/g, "").length > 0.5 * email.length;
    const phoneLooksLikeEmail = phone && phone.includes("@");

    if (emailLooksLikePhone && phoneLooksLikeEmail) {
      console.log("Email and phone appear to be swapped, fixing...");
      const temp = email;
      email = phone;
      phone = temp;
    } else if (emailLooksLikePhone && !phoneLooksLikeEmail) {
      // If email looks like a phone and we don't have a valid phone, move it
      if (!phone) {
        console.log("Email looks like a phone number, moving to phone field");
        phone = email;
        email = "";
      }
    }

    // Log key fields to debug
    console.log("Processed fields:", {
      customerName: quoteData.customerName,
      roomType: quoteData.roomType,
      email,
      phone,
      parsed: { guestName, roomType },
    });

    return {
      guestName: guestName,
      email: email,
      phone: phone,
      checkIn: checkIn,
      checkOut: checkOut,
      nights: Number(quoteData.nights) || 1,
      adults: Number(quoteData.adults) || 1,
      children: Number(quoteData.children) || 0,
      roomType: roomType,
      pricePerNight: parsePrice(quoteData.pricePerNight),
      additionalFees: parsePrice(quoteData.additionalFees),
      bookingId:
        quoteData.bookingId ||
        "BKK-" + new Date().getTime().toString().slice(-6),
      notes: quoteData.specialRequests || "",
      childrenDetails: quoteData.childrenDetails || "",
      specialRequests: quoteData.specialRequests || "",
      additionalServices: quoteData.additionalServices || "",
    };
  };

  const exportData = prepareExportData();
  console.log("Quote display prepared data for export:", exportData);

  return (
    <div className="space-y-4">
      <SimpleQuoteExport
        quoteElementId="quote-card"
        bookingId={quoteData.bookingId}
        quoteData={exportData}
      />

      <Card className="overflow-hidden" id="quote-card">
        <div className="bg-sky-800 text-white p-4 text-center">
          <h3 className="text-xl font-bold">Asteria Mũi Né Resort</h3>
          <p className="text-sky-200 text-sm">{t("quote.title")}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("quote.bookingId")}
              </p>
              <p className="font-semibold">{quoteData.bookingId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {t("quote.createdAt")}
              </p>
              <p className="font-semibold">{currentDateFormatted}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sky-800 mb-2">
                {t("quote.guestInfo")}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("form.guestName")}
                  </p>
                  <p>{quoteData.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("form.phone")}
                  </p>
                  <p>{quoteData.phone}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sky-800 mb-2">
                {t("quote.bookingDetails")}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("form.checkIn")}
                  </p>
                  <p>{quoteData.checkInDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("form.checkOut")}
                  </p>
                  <p>{quoteData.checkOutDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("form.nights")}
                  </p>
                  <p>{quoteData.nights}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("form.roomType")}
                  </p>
                  <p>{quoteData.roomType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("form.adults")}
                  </p>
                  <p>{quoteData.adults}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("form.children")}
                  </p>
                  <p>
                    {quoteData.children} ({quoteData.childrenDetails})
                  </p>
                </div>
              </div>
            </div>

            {quoteData.specialRequests && (
              <div>
                <h4 className="font-semibold text-sky-800 mb-2">
                  {t("form.specialRequests")}
                </h4>
                <p className="bg-sky-50 p-3 rounded-md text-sky-900">
                  {quoteData.specialRequests}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-sky-800 mb-2">
                {t("quote.pricing")}
              </h4>
              <div className="space-y-2 border-t pt-2">
                <div className="flex justify-between">
                  <span>{t("form.pricePerNight")}</span>
                  <span>{quoteData.pricePerNight}</span>
                </div>
                <div className="flex justify-between">
                  <span>{totalRoomCostText}</span>
                  <span>{quoteData.totalRoomCost}</span>
                </div>
                {quoteData.additionalServices && (
                  <div className="flex justify-between">
                    <span>{additionalServicesText}</span>
                    <span>{quoteData.additionalFees}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>{t("quote.totalPrice")}</span>
                  <span className="text-sky-800">{quoteData.grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sky-50 p-4 rounded-md mt-6">
            <h4 className="font-semibold text-sky-800 mb-2">
              {t("quote.termsAndNotes")}
            </h4>
            <ul className="text-sm space-y-1 text-sky-900">
              <li>• {t("quote.vatIncluded")}</li>
              <li>• {t("quote.validFor24Hours")}</li>
              <li>• {t("quote.depositRequired")}</li>
              <li>• {t("quote.cancellationPolicy")}</li>
              <li>• {t("quote.checkInOutTimes")}</li>
            </ul>
          </div>
        </div>

        <div className="bg-sky-50 p-4 text-center border-t">
          <p className="text-sm text-sky-800">{t("quote.thankYou")}</p>
          <p className="text-xs text-sky-600 mt-1">{t("quote.contactInfo")}</p>
        </div>
      </Card>
    </div>
  );
}
