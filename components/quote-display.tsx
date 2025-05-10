"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { SimpleQuoteExport } from "@/components/simple-quote-export";
import { useTranslation } from "@/lib/translation-context";

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
}

export function QuoteDisplay() {
  const { t, currentLanguage } = useTranslation();
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);

  useEffect(() => {
    // Lắng nghe sự kiện cập nhật báo giá
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
      <div className="border border-dashed border-sky-300 rounded-lg p-8 text-center bg-sky-50">
        <p className="text-sky-800 mb-2">{t("quote.noData")}</p>
        <p className="text-sm text-sky-600">{t("quote.pleaseEnterData")}</p>
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

  return (
    <div className="space-y-4">
      <SimpleQuoteExport
        quoteElementId="quote-card"
        bookingId={quoteData.bookingId}
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
