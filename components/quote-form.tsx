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
import { SimpleQuoteExport } from "@/components/simple-quote-export";

export function QuoteForm() {
  const { t, currentLanguage } = useTranslation();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    bookingId: "",
    customerName: "",
    email: "",
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

      // Add currency suffix and thousands separators based on language
      const currencySuffix =
        currentLanguage === "en"
          ? "VND"
          : currentLanguage === "vi"
          ? "VNĐ"
          : "VND";

      // Get locale for formatting
      const locale =
        currentLanguage === "en"
          ? "en-US"
          : currentLanguage === "vi"
          ? "vi-VN"
          : currentLanguage === "ru"
          ? "ru-RU"
          : currentLanguage === "kr"
          ? "ko-KR"
          : "zh-CN";

      const formattedValue = `${parseInt(numericValue).toLocaleString(
        locale
      )} ${currencySuffix}`;

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
      // Try using Clipboard API directly
      const clipboardText = await navigator.clipboard.readText();

      if (!clipboardText) {
        toast({
          title: t("form.clipboardEmpty"),
          description: t("form.noDataInClipboard"),
          variant: "destructive",
        });
        return;
      }

      // Process data from clipboard
      processClipboardData(clipboardText);

      // Success notification
      toast({
        title: t("form.pasteSuccess"),
        description: t("form.dataProcessed"),
        variant: "success",
      });
    } catch (error) {
      console.error("Error reading clipboard:", error);

      // Display error notification
      toast({
        title: t("form.clipboardError"),
        description: t("form.checkPermissions"),
        variant: "destructive",
      });
    }
  };

  const handleUseSampleData = () => {
    // Generate random sample data
    const generateRandomSampleData = () => {
      // List of common Vietnamese names
      const firstNames = [
        "Nguyễn",
        "Trần",
        "Lê",
        "Phạm",
        "Hoàng",
        "Huỳnh",
        "Phan",
        "Vũ",
        "Võ",
        "Đặng",
      ];
      const lastNames = [
        "An",
        "Bình",
        "Cường",
        "Dũng",
        "Hà",
        "Hải",
        "Hương",
        "Lan",
        "Linh",
        "Mai",
        "Minh",
        "Nam",
        "Nga",
        "Phương",
        "Quang",
        "Thảo",
        "Trang",
        "Tuấn",
        "Thanh",
        "Hiền",
      ];

      // List of email domains
      const emailDomains = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "icloud.com",
        "example.com",
      ];

      // List of room types
      const roomTypes = [
        "Phòng Deluxe King",
        "Phòng Superior Twin",
        "Phòng Suite Hướng Biển",
        "Phòng Suite Gia Đình",
        "Phòng Premier Hướng Vườn",
        "Villa Hồ Bơi Riêng",
        "Phòng Junior Suite",
      ];

      // List of special requests
      const specialRequests = [
        "Phòng tầng cao có view đẹp",
        "Đặt phòng gần nhau, đi theo nhóm",
        "Cần cũi cho em bé",
        "Yêu cầu phòng cách xa thang máy",
        "Cần ghế cao cho trẻ em",
        "Yêu cầu phòng không hút thuốc",
        "Cần dịch vụ đón sân bay",
        "Muốn trang trí phòng cho kỷ niệm",
        "Gửi xe trong thời gian lưu trú",
        "",
      ];

      // List of additional services
      const additionalServices = [
        "Bữa buffet sáng cho 2 người",
        "Đón/tiễn sân bay",
        "Dịch vụ spa cho 2 người",
        "1 vé buffet trẻ em",
        "Gói chụp ảnh lưu niệm",
        "Tour tham quan địa phương nửa ngày",
        "Tiệc BBQ bãi biển",
        "",
      ];

      // Generate random full name
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} Thị ${lastName}`;

      // Function to remove Vietnamese accents
      const removeAccents = (str: string) => {
        return str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "D");
      };

      // Generate email matching the name (without accents)
      const email = `${removeAccents(lastName.toLowerCase())}.${removeAccents(
        firstName.toLowerCase()
      )}@${emailDomains[Math.floor(Math.random() * emailDomains.length)]}`;

      // Generate Vietnamese phone number
      const phonePrefix = [
        "090",
        "091",
        "093",
        "094",
        "096",
        "097",
        "098",
        "032",
        "033",
        "034",
        "035",
        "036",
        "037",
        "038",
        "039",
        "070",
        "076",
        "077",
        "078",
        "079",
      ];
      const prefix =
        phonePrefix[Math.floor(Math.random() * phonePrefix.length)];
      const suffix = Math.floor(1000000 + Math.random() * 9000000);
      const phone = `${prefix}${suffix}`;

      // Random booking ID
      const bookingId = `BK${Math.floor(1000 + Math.random() * 9000)}`;

      // Current date
      const today = new Date();

      // Create check-in date between 10-30 days after current date
      const checkInOffset = Math.floor(10 + Math.random() * 20); // 10-30 days
      const checkInDate = new Date(
        today.getTime() + checkInOffset * 24 * 60 * 60 * 1000
      );

      // Create check-out date 1-7 days after check-in
      const stayDuration = Math.floor(1 + Math.random() * 7); // 1-7 days
      const checkOutDate = new Date(
        checkInDate.getTime() + stayDuration * 24 * 60 * 60 * 1000
      );

      // Format date as DD/MM/YYYY
      const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Number of adults and children
      const adults = Math.floor(1 + Math.random() * 3); // 1-4 adults
      const children = Math.floor(Math.random() * 3); // 0-2 children

      // Children details
      let childrenDetails = "";
      if (children > 0) {
        const childAges = [];
        for (let i = 0; i < children; i++) {
          childAges.push(Math.floor(1 + Math.random() * 12)); // 1-12 years old
        }
        childrenDetails = `${children} trẻ em (${childAges.join(", ")} tuổi)`;
      }

      // Select room type
      const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];

      // Random room price (from 1 million to 5 million)
      const basePriceMillions = 1 + Math.random() * 4;
      const basePrice =
        Math.round((basePriceMillions * 1000000) / 100000) * 100000; // Round to nearest 100,000 VND

      // Additional fees (0 to 500 thousand)
      const additionalFees = Math.round(Math.random() * 5) * 100000;

      // Total room cost
      const totalRoomCost = basePrice * stayDuration;

      // Total cost
      const totalCost = totalRoomCost + additionalFees;

      // Special request
      const specialRequest =
        specialRequests[Math.floor(Math.random() * specialRequests.length)];

      // Additional service
      const additionalService =
        additionalServices[
          Math.floor(Math.random() * additionalServices.length)
        ];

      // Combine all into a tab-separated sample data string
      return `${bookingId}\t${fullName}\t${email}\t${phone}\t${formatDate(
        checkInDate
      )}\t${formatDate(checkOutDate)}\t${roomType}\t${adults}\t${children}\t${
        childrenDetails || "-"
      }\t${specialRequest || "-"}\t${basePrice.toLocaleString(
        "vi-VN"
      )} VND\t${additionalFees.toLocaleString("vi-VN")} VND\t${
        additionalService || "-"
      }`;
    };

    // Generate and use random sample data
    processClipboardData(generateRandomSampleData());

    // Success notification
    toast({
      title: t("form.sampleDataUsed"),
      description: t("form.quoteCreatedWithSample"),
      variant: "success",
    });
  };

  // Function to process clipboard data
  const processClipboardData = (clipboardText: string) => {
    // Parse data from clipboard (assuming tab-separated format)
    const formFields = clipboardText.split("\t").map((field) => field.trim());

    // No data found
    if (formFields.length <= 1) {
      return;
    }

    // Map data values to correct form fields order
    // Sample data structure: BookingID, GuestName, Email, Phone, CheckIn, CheckOut, RoomType, Adults, Children, ChildrenDetails,
    // Special Requests, PricePerNight, AdditionalFees, AdditionalServices

    const bookingId = formFields[0] || "";
    const customerName = formFields[1] || "";
    const email = formFields[2] || "";
    const phone = formFields[3] || "";
    const checkInDate = formFields[4] || "";
    const checkOutDate = formFields[5] || "";
    const roomType = formFields[6] || "";
    const adults = formFields[7] || "1";
    const children = formFields[8] || "0";
    const childrenDetails = formFields[9] || "";
    const specialRequests = formFields[10] || "";
    const pricePerNight = formFields[11] || "";
    const totalRoomCost = formFields[12] || "";
    const additionalFees = formFields[13] || "";
    const additionalServices = formFields[14] || "";
    const grandTotal = formFields[15] || "";

    // Format currency values with thousands separators
    const formatCurrency = (value: string) => {
      if (!value) return "";
      // Remove any existing non-digit characters
      const numericValue = value.replace(/[^\d]/g, "");
      if (numericValue === "") return "";

      // Format with appropriate currency suffix and thousands separators
      const currencySuffix =
        currentLanguage === "en"
          ? "VND"
          : currentLanguage === "vi"
          ? "VNĐ"
          : "VND";

      // Get locale for formatting
      const locale =
        currentLanguage === "en"
          ? "en-US"
          : currentLanguage === "vi"
          ? "vi-VN"
          : currentLanguage === "ru"
          ? "ru-RU"
          : currentLanguage === "kr"
          ? "ko-KR"
          : "zh-CN";

      return `${parseInt(numericValue).toLocaleString(
        locale
      )} ${currencySuffix}`;
    };

    // Update form state with clipboard data
    setFormData({
      bookingId,
      customerName,
      email,
      phone,
      roomType,
      adults,
      children,
      childrenDetails,
      specialRequests,
      pricePerNight: formatCurrency(pricePerNight),
      additionalFees: formatCurrency(additionalFees),
      additionalServices,
    });

    // Update check-in and check-out dates if available
    if (checkInDate) {
      try {
        const [day, month, year] = checkInDate.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          setCheckIn(date);
        }
      } catch (e) {
        console.error("Error converting check-in date:", e);
      }
    }

    if (checkOutDate) {
      try {
        const [day, month, year] = checkOutDate.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          setCheckOut(date);
        }
      } catch (e) {
        console.error("Error converting check-out date:", e);
      }
    }

    // Update global state to display quote
    const event = new CustomEvent("updateQuote", {
      detail: {
        bookingId,
        customerName,
        email,
        phone,
        checkInDate,
        checkOutDate,
        nights: 1, // Will be calculated based on dates
        roomType,
        adults: Number.parseInt(adults) || 1,
        children: Number.parseInt(children) || 0,
        childrenDetails,
        specialRequests,
        pricePerNight: formatCurrency(pricePerNight),
        totalRoomCost: formatCurrency(totalRoomCost),
        additionalFees: formatCurrency(additionalFees),
        additionalServices,
        grandTotal: formatCurrency(grandTotal),
      },
    });
    window.dispatchEvent(event);
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
      const currencySuffix =
        currentLanguage === "en"
          ? "VND"
          : currentLanguage === "vi"
          ? "VNĐ"
          : "VND";

      // Get locale for formatting
      const locale =
        currentLanguage === "en"
          ? "en-US"
          : currentLanguage === "vi"
          ? "vi-VN"
          : currentLanguage === "ru"
          ? "ru-RU"
          : currentLanguage === "kr"
          ? "ko-KR"
          : "zh-CN";

      return `${value.toLocaleString(locale)} ${currencySuffix}`;
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
        email: formData.email,
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

    // Store the complete form data with calculated fields for use in QuoteSaver
    setCompleteFormData({
      bookingId: formData.bookingId,
      guestName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      checkIn: checkIn || new Date(),
      checkOut: checkOut || new Date(),
      nights: nights,
      adults: parseInt(formData.adults) || 1,
      children: parseInt(formData.children) || 0,
      roomType: formData.roomType,
      pricePerNight: getNumericValue(formData.pricePerNight),
      additionalFees: getNumericValue(formData.additionalFees),
      notes: formData.specialRequests,
      childrenDetails: formData.childrenDetails,
      specialRequests: formData.specialRequests,
      additionalServices: formData.additionalServices,
    });

    toast({
      title: t("form.quoteCreated"),
      description: t("form.quoteCreatedWithInfo"),
      variant: "success",
    });
  };

  // Add state to store the complete form data with calculated fields
  const [completeFormData, setCompleteFormData] = useState<any>(null);

  // The dateFns locale based on currentLanguage
  const dateLocale = currentLanguage === "en" ? undefined : vi;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          type="button"
          onClick={handlePasteData}
          variant="outline"
          className="w-full bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200 text-xs sm:text-sm px-1 sm:px-2"
        >
          <Clipboard className="mr-1 h-4 w-4 flex-shrink-0" />
          {t("form.paste")}
        </Button>
        <Button
          type="button"
          onClick={handleUseSampleData}
          variant="outline"
          className="w-full bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200 text-xs sm:text-sm px-1 sm:px-2"
        >
          <FileText className="mr-1 h-4 w-4 flex-shrink-0" />
          {t("form.sample")}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bookingId">{t("form.bookingId")}</Label>
          <Input
            id="bookingId"
            placeholder={t("form.placeholder.bookingId")}
            value={formData.bookingId}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("form.phone")}</Label>
          <Input
            id="phone"
            placeholder={t("form.placeholder.phone")}
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerName">{t("form.guestName")}</Label>
        <Input
          id="customerName"
          placeholder={t("form.placeholder.guestName")}
          value={formData.customerName}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("form.email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          value={formData.email}
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
          placeholder={t("form.placeholder.roomType")}
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
            placeholder={t("form.placeholder.adults")}
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
            placeholder={t("form.placeholder.children")}
            value={formData.children}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="childrenDetails">{t("form.childrenDetails")}</Label>
        <Input
          id="childrenDetails"
          placeholder={t("form.placeholder.childrenDetails")}
          value={formData.childrenDetails}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialRequests">{t("form.specialRequests")}</Label>
        <Textarea
          id="specialRequests"
          placeholder={t("form.placeholder.specialRequests")}
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
            placeholder={t("form.placeholder.pricePerNight")}
            value={formData.pricePerNight}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="additionalFees">{t("form.additionalFees")}</Label>
          <Input
            id="additionalFees"
            placeholder={t("form.placeholder.additionalFees")}
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
          placeholder={t("form.placeholder.additionalServices")}
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

      {/* Export buttons */}
      {completeFormData && (
        <SimpleQuoteExport
          quoteElementId="quote"
          bookingId={completeFormData.bookingId}
          quoteData={completeFormData}
          formView={true}
        />
      )}
    </form>
  );
}
