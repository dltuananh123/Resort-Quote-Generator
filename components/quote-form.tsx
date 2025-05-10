"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, FileText, Clipboard } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/lib/translation-context";

export function QuoteForm() {
  const { t, currentLanguage } = useTranslation();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    bookingId: "",
    customerName: "",
    phone: "",
    roomType: "",
    adults: "1",
    children: "0",
    childrenDetails: "",
    specialRequests: "",
    pricePerNight: "",
    additionalFees: "",
    additionalServices: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    // For price and fee fields, format with thousands separators
    if (id === "pricePerNight" || id === "additionalFees") {
      // Remove all non-digit characters
      const numericValue = value.replace(/[^\d]/g, "");

      if (numericValue === "") {
        setFormData((prev) => ({
          ...prev,
          [id]: "",
        }));
        return;
      }

      // Add ₫ prefix and thousands separators
      const formattedValue = `₫${parseInt(numericValue).toLocaleString(
        "vi-VN"
      )}`;

      setFormData((prev) => ({
        ...prev,
        [id]: formattedValue,
      }));
    } else {
      // For other fields, use regular handling
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handlePasteData = async () => {
    try {
      // Thử sử dụng Clipboard API trực tiếp
      const clipboardText = await navigator.clipboard.readText();

      if (!clipboardText) {
        toast({
          title: t("form.clipboardEmpty"),
          description: t("form.noDataInClipboard"),
          variant: "destructive",
        });
        return;
      }

      // Xử lý dữ liệu từ clipboard
      processClipboardData(clipboardText);

      // Thông báo thành công
      toast({
        title: t("form.pasteSuccess"),
        description: t("form.dataProcessed"),
        variant: "default",
      });
    } catch (error) {
      console.error("Lỗi khi đọc clipboard:", error);

      // Hiển thị thông báo lỗi
      toast({
        title: t("form.clipboardError"),
        description: t("form.checkPermissions"),
        variant: "destructive",
      });
    }
  };

  const handleUseSampleData = () => {
    // Sử dụng dữ liệu mẫu có sẵn
    const sampleData =
      "BKK-001\tTrần Thị Hồng\t09332233232\t11/05/2025\t12/05/2025\t1\tPhòng Senior Deluxe Giường Đôi\t\t3\t5\t2 bé (3t, 5t)\tNhờ khu nghỉ xếp phòng cạnh nhau do đi cùng đoàn.\t₫2,200,000\t₫6,600,000\t₫100,000\t1 vé buffet trẻ em\t₫6,700,000";
    processClipboardData(sampleData);

    // Thông báo thành công
    toast({
      title: t("form.sampleDataUsed"),
      description: t("form.quoteCreatedWithSample"),
      variant: "default",
    });
  };

  // Función para procesar los datos del portapapeles
  const processClipboardData = (clipboardText: string) => {
    try {
      // Phân tích dữ liệu từ clipboard (giả sử định dạng tab-separated)
      const parts = clipboardText.split("\t");

      if (parts.length < 15) {
        toast({
          title: "Định dạng dữ liệu không hợp lệ",
          description:
            "Dữ liệu không đúng định dạng tab-separated hoặc thiếu thông tin.",
          variant: "destructive",
        });
        return;
      }

      // Format currency values with thousands separators
      const formatCurrency = (value: string) => {
        if (!value) return "";
        // Remove any existing non-digit characters
        const numericValue = value.replace(/[^\d]/g, "");
        if (numericValue === "") return "";
        // Format with ₫ prefix and thousands separators
        return `₫${parseInt(numericValue).toLocaleString("vi-VN")}`;
      };

      // Cập nhật trạng thái form với dữ liệu từ clipboard
      setFormData({
        bookingId: parts[0] || "",
        customerName: parts[1] || "",
        phone: parts[2] || "",
        roomType: parts[6] || "",
        adults: parts[8] || "1",
        children: parts[9] || "0",
        childrenDetails: parts[10] || "",
        specialRequests: parts[11] || "",
        pricePerNight: formatCurrency(parts[12] || ""),
        additionalFees: formatCurrency(parts[14] || ""),
        additionalServices: parts[15] || "",
      });

      // Cập nhật ngày check-in và check-out nếu có
      if (parts[3]) {
        try {
          const [day, month, year] = parts[3].split("/").map(Number);
          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) {
            setCheckIn(date);
          }
        } catch (e) {
          console.error("Lỗi khi chuyển đổi ngày check-in:", e);
        }
      }

      if (parts[4]) {
        try {
          const [day, month, year] = parts[4].split("/").map(Number);
          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) {
            setCheckOut(date);
          }
        } catch (e) {
          console.error("Lỗi khi chuyển đổi ngày check-out:", e);
        }
      }

      // Cập nhật trạng thái toàn cục để hiển thị báo giá
      const event = new CustomEvent("updateQuote", {
        detail: {
          bookingId: parts[0] || "",
          customerName: parts[1] || "",
          phone: parts[2] || "",
          checkInDate: parts[3] || "",
          checkOutDate: parts[4] || "",
          nights: Number.parseInt(parts[5]) || 1,
          roomType: parts[6] || "",
          adults: Number.parseInt(parts[8]) || 1,
          children: Number.parseInt(parts[9]) || 0,
          childrenDetails: parts[10] || "",
          specialRequests: parts[11] || "",
          pricePerNight: parts[12] || "",
          totalRoomCost: parts[13] || "",
          additionalFees: parts[14] || "",
          additionalServices: parts[15] || "",
          grandTotal: parts[16] || "",
        },
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Lỗi khi xử lý dữ liệu clipboard:", error);
      toast({
        title: "Lỗi xử lý dữ liệu",
        description: "Không thể xử lý dữ liệu. Vui lòng kiểm tra định dạng.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate nights based on check-in and check-out dates
    const nights =
      checkIn && checkOut
        ? Math.max(
            1,
            Math.ceil(
              (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
            )
          )
        : 1;

    // Format currency values
    const formatCurrency = (value: number) => {
      return `₫${value.toLocaleString("vi-VN")}`;
    };

    // Helper to extract numeric value from formatted currency
    const getNumericValue = (value: string) => {
      return parseInt(value.replace(/[^\d]/g, "")) || 0;
    };

    // Calculate total room cost using formatted value
    const pricePerNightNum = getNumericValue(formData.pricePerNight);
    const totalRoomCost = pricePerNightNum * nights;

    // Calculate grand total using formatted value
    const additionalFeesNum = getNumericValue(formData.additionalFees);
    const grandTotal = totalRoomCost + additionalFeesNum;

    // Create event to update quote display
    const event = new CustomEvent("updateQuote", {
      detail: {
        bookingId: formData.bookingId,
        customerName: formData.customerName,
        phone: formData.phone,
        checkInDate: checkIn
          ? format(checkIn, "dd/MM/yyyy", { locale: vi })
          : "",
        checkOutDate: checkOut
          ? format(checkOut, "dd/MM/yyyy", { locale: vi })
          : "",
        nights: nights,
        roomType: formData.roomType,
        adults: parseInt(formData.adults) || 1,
        children: parseInt(formData.children) || 0,
        childrenDetails: formData.childrenDetails,
        specialRequests: formData.specialRequests,
        pricePerNight: formData.pricePerNight || formatCurrency(0),
        totalRoomCost: formatCurrency(totalRoomCost),
        additionalFees: formData.additionalFees || formatCurrency(0),
        additionalServices: formData.additionalServices,
        grandTotal: formatCurrency(grandTotal),
      },
    });

    window.dispatchEvent(event);

    toast({
      title: t("form.quoteCreated"),
      description: t("form.quoteCreatedWithInfo"),
      variant: "default",
    });
  };

  // The dateFns locale based on currentLanguage
  const dateLocale = currentLanguage === "en" ? undefined : vi;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          type="button"
          onClick={handlePasteData}
          variant="outline"
          className="w-full bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200"
        >
          <Clipboard className="mr-2 h-4 w-4" />
          {t("form.paste")}
        </Button>
        <Button
          type="button"
          onClick={handleUseSampleData}
          variant="outline"
          className="w-full bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200"
        >
          <FileText className="mr-2 h-4 w-4" />
          {t("form.sample")}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bookingId">{t("form.bookingId")}</Label>
          <Input
            id="bookingId"
            placeholder="VD: BKK-001"
            value={formData.bookingId}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("form.phone")}</Label>
          <Input
            id="phone"
            placeholder="VD: 0933223322"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerName">{t("form.guestName")}</Label>
        <Input
          id="customerName"
          placeholder="VD: Trần Thị Hồng"
          value={formData.customerName}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="checkIn">{t("form.checkIn")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="checkIn"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkIn && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? (
                  format(checkIn, "dd/MM/yyyy", { locale: dateLocale })
                ) : (
                  <span>{t("form.selectDate")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkOut">{t("form.checkOut")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="checkOut"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkOut && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? (
                  format(checkOut, "dd/MM/yyyy", { locale: dateLocale })
                ) : (
                  <span>{t("form.selectDate")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="roomType">{t("form.roomType")}</Label>
        <Input
          id="roomType"
          placeholder="VD: Phòng Senior Deluxe Giường Đôi"
          value={formData.roomType}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="adults">{t("form.adults")}</Label>
          <Input
            id="adults"
            type="number"
            min="1"
            placeholder="VD: 3"
            value={formData.adults}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="children">{t("form.children")}</Label>
          <Input
            id="children"
            type="number"
            min="0"
            placeholder="VD: 5"
            value={formData.children}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="childrenDetails">{t("form.childrenDetails")}</Label>
        <Input
          id="childrenDetails"
          placeholder="VD: 2 bé (3t, 5t)"
          value={formData.childrenDetails}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialRequests">{t("form.specialRequests")}</Label>
        <Textarea
          id="specialRequests"
          placeholder="VD: Nhờ khu nghỉ xếp phòng cạnh nhau do đi cùng đoàn."
          rows={3}
          value={formData.specialRequests}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pricePerNight">{t("form.pricePerNight")}</Label>
          <Input
            id="pricePerNight"
            placeholder="VD: ₫2,200,000"
            value={formData.pricePerNight}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="additionalFees">{t("form.additionalFees")}</Label>
          <Input
            id="additionalFees"
            placeholder="VD: ₫100,000"
            value={formData.additionalFees}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalServices">
          {t("form.additionalServices")}
        </Label>
        <Input
          id="additionalServices"
          placeholder="VD: 1 vé buffet trẻ em"
          value={formData.additionalServices}
          onChange={handleChange}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-sky-700 hover:bg-sky-800 text-white"
      >
        {t("form.submit")}
      </Button>
    </form>
  );
}
