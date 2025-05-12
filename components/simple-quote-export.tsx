"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ImageIcon, Loader2, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  elementToPngBlob,
  elementToPngDataUrl,
  qualitySettings,
} from "@/lib/export-helpers";
import { useTranslation } from "@/lib/translation-context";
import Link from "next/link";
import { QuoteSaver } from "./quote-saver";

interface SimpleQuoteExportProps {
  quoteElementId: string;
  bookingId?: string;
  quoteData: any;
  formView?: boolean;
}

export function SimpleQuoteExport({
  quoteElementId,
  bookingId = "Asteria",
  quoteData,
  formView = false,
}: SimpleQuoteExportProps) {
  const { t, currentLanguage } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [imageQuality, setImageQuality] = useState<"normal" | "high" | "ultra">(
    "high"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingPdf, setIsCreatingPdf] = useState(false);

  if (formView) {
    return <></>;
  }

  const handleSaveAsPng = async () => {
    const quoteElement = document.getElementById(quoteElementId);
    if (!quoteElement) {
      alert(t("export.elementNotFound"));
      return;
    }

    try {
      setIsSaving(true);

      const blob = await elementToPngBlob(quoteElement, imageQuality);

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      const filePrefix = currentLanguage === "en" ? "Quote" : "Bao-Gia";
      link.download = `${filePrefix}-${bookingId}-${
        new Date().toISOString().split("T")[0]
      }-${imageQuality}.png`;

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        if (link.parentNode === document.body) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
        setIsSaving(false);
      }, 100);
    } catch (error) {
      console.error(t("export.imageError"), error);
      alert(t("export.cannotCreateImage"));
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    const quoteElement = document.getElementById(quoteElementId);
    if (!quoteElement) {
      alert(t("export.elementNotFound"));
      return;
    }

    try {
      setIsCreatingPdf(true);

      const jspdfModule = await import("jspdf");
      const jsPDF = jspdfModule.default;

      const dataUrl = await elementToPngDataUrl(quoteElement, imageQuality);

      const img = new Image();
      img.src = dataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
      const imgWidth = img.width * ratio;
      const imgHeight = img.height * ratio;
      const x = (pdfWidth - imgWidth) / 2;
      const y = 10;

      pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight);

      const filePrefix = currentLanguage === "en" ? "Quote" : "Bao-Gia";
      pdf.save(
        `${filePrefix}-${bookingId}-${
          new Date().toISOString().split("T")[0]
        }-${imageQuality}.pdf`
      );

      setIsCreatingPdf(false);
    } catch (error) {
      console.error(t("export.pdfError"), error);
      alert(t("export.cannotCreatePDF"));
      setIsCreatingPdf(false);
    }
  };

  const getQualityLabel = (quality: "normal" | "high" | "ultra") => {
    switch (quality) {
      case "normal":
        return t("export.qualityNormal");
      case "high":
        return t("export.qualityHigh");
      case "ultra":
        return t("export.qualityUltra");
      default:
        return "";
    }
  };

  const prepareQuoteData = () => {
    try {
      console.log("Raw quote data:", quoteData);

      if (!quoteData) {
        console.error("No quote data available");
        return null;
      }

      // For debugging
      const logDataType = (name: string, value: any) => {
        console.log(`${name} type:`, typeof value, value);
      };

      logDataType("quoteData.checkIn", quoteData.checkIn);
      logDataType("quoteData.checkOut", quoteData.checkOut);
      logDataType("quoteData.pricePerNight", quoteData.pricePerNight);

      // Safely convert to Date objects with validation
      let checkIn: Date;
      if (
        quoteData.checkIn instanceof Date &&
        !isNaN(quoteData.checkIn.getTime())
      ) {
        checkIn = quoteData.checkIn;
      } else {
        try {
          checkIn = new Date(quoteData.checkIn || Date.now());
          if (isNaN(checkIn.getTime())) {
            console.error(
              "Invalid checkIn date, using current date as fallback"
            );
            checkIn = new Date();
          }
        } catch (e) {
          console.error("Error parsing checkIn date:", e);
          checkIn = new Date();
        }
      }

      let checkOut: Date;
      // First try to use the provided checkout date
      if (
        quoteData.checkOut instanceof Date &&
        !isNaN(quoteData.checkOut.getTime())
      ) {
        checkOut = quoteData.checkOut;
      } else {
        try {
          // Try to parse it if it's a string
          checkOut = new Date(quoteData.checkOut || Date.now() + 86400000);
          // If parsing failed or the date is invalid, create a date based on checkIn
          if (isNaN(checkOut.getTime())) {
            console.error("Invalid checkOut date, creating based on checkIn");
            checkOut = new Date(checkIn);
            checkOut.setDate(checkIn.getDate() + (quoteData.nights || 1));
          }
        } catch (e) {
          console.error("Error parsing checkOut date:", e);
          checkOut = new Date(checkIn);
          checkOut.setDate(checkIn.getDate() + (quoteData.nights || 1));
        }
      }

      // Ensure checkOut is after checkIn
      if (checkOut <= checkIn) {
        console.error("checkOut before or equal to checkIn, fixing...");
        checkOut = new Date(checkIn);
        checkOut.setDate(checkIn.getDate() + (quoteData.nights || 1));
      }

      // Convert any string numbers to actual numbers
      const pricePerNight =
        typeof quoteData.pricePerNight === "number"
          ? quoteData.pricePerNight
          : parseInt(
              String(quoteData.pricePerNight).replace(/[^\d]/g, "") || "0"
            );

      const additionalFees =
        typeof quoteData.additionalFees === "number"
          ? quoteData.additionalFees
          : parseInt(
              String(quoteData.additionalFees).replace(/[^\d]/g, "") || "0"
            );

      // Ensure we have required fields - always populate with fallbacks if missing
      const guestName =
        quoteData.guestName || quoteData.customerName || "Guest";
      const roomType = quoteData.roomType || "Standard Room";
      const bookingId =
        quoteData.bookingId ||
        "BKK-" + new Date().getTime().toString().slice(-6);

      // Fix email and phone if they seem inverted
      let email = quoteData.email || "";
      let phone = quoteData.phone || "";

      // Email should contain @ and phone should mostly contain digits
      const emailLooksLikePhone =
        email &&
        !email.includes("@") &&
        /^\d+$/.test(email.replace(/[\s\-\(\)\.]/g, ""));
      const phoneLooksLikeEmail = phone && phone.includes("@");

      if (emailLooksLikePhone && phoneLooksLikeEmail) {
        console.log("Email and phone appear to be swapped, fixing...");
        const temp = email;
        email = phone;
        phone = temp;
      } else if (emailLooksLikePhone) {
        // If email looks like a phone and we don't have a proper phone, move it
        if (!phone || phone === "") {
          phone = email;
          email = "";
        }
      }

      console.log("Final dates:", {
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        nights: quoteData.nights,
      });

      console.log("Enforcing required fields:", {
        guestName,
        roomType,
        bookingId,
        email,
        phone,
      });

      const preparedData = {
        guestName,
        email,
        phone,
        checkIn,
        checkOut,
        nights: quoteData.nights || 0,
        adults: quoteData.adults || 0,
        children: quoteData.children || 0,
        roomType,
        pricePerNight,
        additionalFees,
        notes: quoteData.notes || quoteData.specialRequests || "",
        bookingId,
        childrenDetails: quoteData.childrenDetails || "",
        specialRequests: quoteData.specialRequests || "",
        additionalServices: quoteData.additionalServices || "",
      };

      console.log("Prepared quote data:", preparedData);
      return preparedData;
    } catch (err) {
      console.error("Error preparing quote data:", err);
      return null;
    }
  };

  const preparedQuoteData = prepareQuoteData() || {
    guestName: "Guest",
    email: "",
    phone: "",
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 86400000),
    nights: 1,
    adults: 2,
    children: 0,
    roomType: "Standard Room",
    pricePerNight: 0,
    additionalFees: 0,
    notes: "",
    bookingId: bookingId || "Asteria",
  };

  return (
    <div className="flex flex-wrap mt-6 gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Settings className="h-4 w-4" />
            {t("export.quality")}: {getQualityLabel(imageQuality)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{t("export.selectQuality")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setImageQuality("normal")}>
            {t("export.qualityNormalFull")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setImageQuality("high")}>
            {t("export.qualityHighFull")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setImageQuality("ultra")}>
            {t("export.qualityUltraFull")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        onClick={handleSaveAsPng}
        disabled={isSaving}
        className="mr-0 md:mr-2 mb-2 md:mb-0 flex-1"
      >
        {isSaving ? <>{t("export.saving")}</> : <>{t("form.exportPng")}</>}
      </Button>
      <Button
        variant="outline"
        onClick={handleDownloadPdf}
        disabled={isCreatingPdf}
        className="mr-0 md:mr-2 mb-2 md:mb-0 flex-1"
      >
        {isCreatingPdf ? (
          <>{t("export.creatingPDF")}</>
        ) : (
          <>{t("form.exportPdf")}</>
        )}
      </Button>
      <QuoteSaver quoteData={preparedQuoteData} className="flex-1" />
      <Link href="/quotes" className="flex-1">
        <Button variant="outline" className="w-full">
          {t("quote.viewSavedQuotes") || "View Saved Quotes"}
        </Button>
      </Link>
    </div>
  );
}
