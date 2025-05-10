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

interface SimpleQuoteExportProps {
  quoteElementId: string;
  bookingId?: string;
}

export function SimpleQuoteExport({
  quoteElementId,
  bookingId = "Asteria",
}: SimpleQuoteExportProps) {
  const [downloading, setDownloading] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [imageQuality, setImageQuality] = useState<"normal" | "high" | "ultra">(
    "high"
  );

  const handleSaveAsPng = async () => {
    const quoteElement = document.getElementById(quoteElementId);
    if (!quoteElement) {
      alert("Không tìm thấy phần tử báo giá để xuất");
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
      link.download = `Bao-Gia-${bookingId}-${
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
      console.error("Lỗi khi tạo hình ảnh:", error);
      alert("Không thể tạo hình ảnh. Vui lòng thử lại.");
      setDownloading(false);
    }
  };

  const handleDownloadPdf = async () => {
    const quoteElement = document.getElementById(quoteElementId);
    if (!quoteElement) {
      alert("Không tìm thấy phần tử báo giá để xuất");
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
      pdf.save(
        `Bao-Gia-${bookingId}-${
          new Date().toISOString().split("T")[0]
        }-${imageQuality}.pdf`
      );

      setPdfDownloading(false);
    } catch (error) {
      console.error("Lỗi khi tạo PDF:", error);
      alert("Không thể tạo PDF. Vui lòng thử lại.");
      setPdfDownloading(false);
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
            Chất lượng:{" "}
            {imageQuality === "normal"
              ? "Thường"
              : imageQuality === "high"
              ? "Cao"
              : "Rất cao"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Chọn chất lượng hình ảnh</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setImageQuality("normal")}>
            Thường (Nhanh, kích thước nhỏ)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setImageQuality("high")}>
            Cao (Khuyến nghị)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setImageQuality("ultra")}>
            Rất cao (Chậm, kích thước lớn)
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
            Đang lưu...
          </>
        ) : (
          <>
            <ImageIcon className="h-4 w-4" />
            Lưu PNG
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
            Đang tạo PDF...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Tải PDF
          </>
        )}
      </Button>
    </div>
  );
}
