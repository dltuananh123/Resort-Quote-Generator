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

interface SimpleQuoteExportProps {
  quoteElementId: string;
  bookingId?: string;
}

export function SimpleQuoteExport({
  quoteElementId,
  bookingId = "Asteria",
}: SimpleQuoteExportProps) {
  const { t, currentLanguage } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [imageQuality, setImageQuality] = useState<"normal" | "high" | "ultra">(
    "high"
  );

  const handleSaveAsPng = async () => {
    const quoteElement = document.getElementById(quoteElementId);
    if (!quoteElement) {
      alert(t("export.elementNotFound"));
      return;
    }

    try {
      setDownloading(true);

      // Using our helper function to create the blob
      const blob = await elementToPngBlob(quoteElement, imageQuality);

      // Create URL from blob
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = url;
      const filePrefix = currentLanguage === "en" ? "Quote" : "Bao-Gia";
      link.download = `${filePrefix}-${bookingId}-${
        new Date().toISOString().split("T")[0]
      }-${imageQuality}.png`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        if (link.parentNode === document.body) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
        setDownloading(false);
      }, 100);
    } catch (error) {
      console.error(t("export.imageError"), error);
      alert(t("export.cannotCreateImage"));
      setDownloading(false);
    }
  };

  const handleDownloadPdf = async () => {
    const quoteElement = document.getElementById(quoteElementId);
    if (!quoteElement) {
      alert(t("export.elementNotFound"));
      return;
    }

    try {
      setPdfDownloading(true);

      // Import jspdf module
      const jspdfModule = await import("jspdf");
      const jsPDF = jspdfModule.default;

      // Get data URL using our helper function
      const dataUrl = await elementToPngDataUrl(quoteElement, imageQuality);

      // Create image from dataUrl
      const img = new Image();
      img.src = dataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Create PDF with A4 size
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate ratio
      const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
      const imgWidth = img.width * ratio;
      const imgHeight = img.height * ratio;
      const x = (pdfWidth - imgWidth) / 2;
      const y = 10;

      // Add image to PDF
      pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight);

      // Save PDF
      const filePrefix = currentLanguage === "en" ? "Quote" : "Bao-Gia";
      pdf.save(
        `${filePrefix}-${bookingId}-${
          new Date().toISOString().split("T")[0]
        }-${imageQuality}.pdf`
      );

      setPdfDownloading(false);
    } catch (error) {
      console.error(t("export.pdfError"), error);
      alert(t("export.cannotCreatePDF"));
      setPdfDownloading(false);
    }
  };

  // Translate quality levels
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

  return (
    <div className="flex justify-end gap-2 mb-4 print:hidden">
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
        size="sm"
        className="flex items-center gap-1"
        onClick={handleSaveAsPng}
        disabled={downloading}
      >
        {downloading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("export.saving")}
          </>
        ) : (
          <>
            <ImageIcon className="h-4 w-4" />
            {t("form.exportPng")}
          </>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleDownloadPdf}
        disabled={pdfDownloading}
      >
        {pdfDownloading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("export.creatingPDF")}
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            {t("form.exportPdf")}
          </>
        )}
      </Button>
    </div>
  );
}
