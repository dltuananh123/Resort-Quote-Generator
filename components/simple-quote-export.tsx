"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download, ImageIcon, Loader2, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Cấu hình chất lượng hình ảnh
  const qualitySettings = {
    normal: { scale: 2, quality: 0.9 },
    high: { scale: 3, quality: 0.95 },
    ultra: { scale: 4, quality: 1.0 },
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsPng = async () => {
    const quoteElement = document.getElementById(quoteElementId);
    if (!quoteElement) {
      alert("Không tìm thấy phần tử báo giá để xuất");
      return;
    }

    try {
      setDownloading(true);

      // Sử dụng thư viện domtoimage thay vì html2canvas
      const domtoimage = await import("dom-to-image");

      // Lấy cấu hình chất lượng
      const { scale, quality } = qualitySettings[imageQuality];

      // Tạo blob từ DOM với chất lượng cao hơn
      const blob = await domtoimage.toBlob(quoteElement, {
        quality: quality,
        bgcolor: "#ffffff",
        height: quoteElement.offsetHeight * scale,
        width: quoteElement.offsetWidth * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${quoteElement.offsetWidth}px`,
          height: `${quoteElement.offsetHeight}px`,
        },
      });

      // Tạo URL từ blob
      const url = URL.createObjectURL(blob);

      // Tạo liên kết tải xuống
      const link = document.createElement("a");
      link.href = url;
      link.download = `Bao-Gia-${bookingId}-${
        new Date().toISOString().split("T")[0]
      }-${imageQuality}.png`;

      // Kích hoạt tải xuống
      document.body.appendChild(link);
      link.click();

      // Dọn dẹp
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

      // Sử dụng thư viện domtoimage và jspdf
      const [domtoimage, jspdfModule] = await Promise.all([
        import("dom-to-image"),
        import("jspdf"),
      ]);

      const jsPDF = jspdfModule.default;

      // Lấy cấu hình chất lượng
      const { scale, quality } = qualitySettings[imageQuality];

      // Tạo dataUrl từ DOM với chất lượng cao hơn
      const dataUrl = await domtoimage.toPng(quoteElement, {
        quality: quality,
        bgcolor: "#ffffff",
        height: quoteElement.offsetHeight * scale,
        width: quoteElement.offsetWidth * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${quoteElement.offsetWidth}px`,
          height: `${quoteElement.offsetHeight}px`,
        },
      });

      // Tạo image từ dataUrl
      const img = new Image();
      img.src = dataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Tạo PDF với kích thước A4
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Tính toán tỷ lệ
      const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
      const imgWidth = img.width * ratio;
      const imgHeight = img.height * ratio;
      const x = (pdfWidth - imgWidth) / 2;
      const y = 10;

      // Thêm hình ảnh vào PDF
      pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight);

      // Lưu PDF
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
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4" />
        In
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
