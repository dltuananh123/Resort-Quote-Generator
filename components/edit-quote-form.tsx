"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateQuote } from "@/lib/supabase";
import { useTranslation } from "@/lib/translation-context";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface EditQuoteFormProps {
  quoteData: {
    id: string;
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
}

export function EditQuoteForm({ quoteData }: EditQuoteFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    quoteData.checkIn
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    quoteData.checkOut
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      guestName: quoteData.guestName,
      email: quoteData.email,
      phone: quoteData.phone,
      nights: quoteData.nights,
      adults: quoteData.adults,
      children: quoteData.children,
      roomType: quoteData.roomType,
      pricePerNight: quoteData.pricePerNight,
      additionalFees: quoteData.additionalFees,
      notes: quoteData.notes,
      bookingId: quoteData.bookingId,
      childrenDetails: quoteData.childrenDetails,
      specialRequests: quoteData.specialRequests,
      additionalServices: quoteData.additionalServices,
    },
  });

  // Update nights when dates change
  const updateNights = () => {
    if (checkInDate && checkOutDate) {
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setValue("nights", diffDays);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      // Convert form data to database structure
      const quoteUpdate = {
        guest_name: data.guestName,
        email: data.email,
        phone: data.phone,
        check_in: checkInDate?.toISOString(),
        check_out: checkOutDate?.toISOString(),
        nights: data.nights,
        adults: data.adults,
        children: data.children,
        room_type: data.roomType,
        price_per_night: data.pricePerNight,
        additional_fees: data.additionalFees,
        notes: data.notes,
        booking_id: data.bookingId,
        children_details: data.childrenDetails,
        special_requests: data.specialRequests,
        additional_services: data.additionalServices,
      };

      await updateQuote(quoteData.id, quoteUpdate);

      toast({
        title: t("quote.updateSuccess") || "Quote Updated",
        description:
          t("quote.updateSuccessDetail") ||
          "The quote has been updated successfully",
        variant: "default",
      });

      router.push(`/quotes/${quoteData.id}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to update quote:", error);

      toast({
        title: t("quote.updateError") || "Error Updating Quote",
        description:
          t("quote.updateErrorDetail") ||
          "There was an error updating the quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="guestName">{t("form.guestName")}</Label>
          <Input
            id="guestName"
            {...register("guestName", { required: true })}
            className={errors.guestName ? "border-red-500" : ""}
          />
          {errors.guestName && (
            <p className="text-red-500 text-sm">
              {t("form.required") || "This field is required"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bookingId">{t("form.bookingId")}</Label>
          <Input id="bookingId" {...register("bookingId")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("form.email")}</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: true })}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">
              {t("form.required") || "This field is required"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("form.phone")}</Label>
          <Input
            id="phone"
            {...register("phone", { required: true })}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">
              {t("form.required") || "This field is required"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t("form.checkIn")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkInDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkInDate ? (
                  format(checkInDate, "PPP")
                ) : (
                  <span>{t("form.selectDate")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={(date) => {
                  setCheckInDate(date);
                  updateNights();
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>{t("form.checkOut")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkOutDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOutDate ? (
                  format(checkOutDate, "PPP")
                ) : (
                  <span>{t("form.selectDate")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkOutDate}
                onSelect={(date) => {
                  setCheckOutDate(date);
                  updateNights();
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nights">{t("form.nights")}</Label>
          <Input
            id="nights"
            type="number"
            min="1"
            {...register("nights", {
              required: true,
              min: 1,
              valueAsNumber: true,
            })}
            className={errors.nights ? "border-red-500" : ""}
          />
          {errors.nights && (
            <p className="text-red-500 text-sm">
              {t("form.positiveNumber") || "Enter a positive number"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="roomType">{t("form.roomType")}</Label>
          <Input
            id="roomType"
            {...register("roomType", { required: true })}
            className={errors.roomType ? "border-red-500" : ""}
          />
          {errors.roomType && (
            <p className="text-red-500 text-sm">
              {t("form.required") || "This field is required"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="adults">{t("form.adults")}</Label>
          <Input
            id="adults"
            type="number"
            min="1"
            {...register("adults", {
              required: true,
              min: 1,
              valueAsNumber: true,
            })}
            className={errors.adults ? "border-red-500" : ""}
          />
          {errors.adults && (
            <p className="text-red-500 text-sm">
              {t("form.positiveNumber") || "Enter a positive number"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="children">{t("form.children")}</Label>
          <Input
            id="children"
            type="number"
            min="0"
            {...register("children", {
              required: true,
              min: 0,
              valueAsNumber: true,
            })}
            className={errors.children ? "border-red-500" : ""}
          />
          {errors.children && (
            <p className="text-red-500 text-sm">
              {t("form.positiveNumber") || "Enter a positive number or zero"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pricePerNight">{t("form.pricePerNight")}</Label>
          <Input
            id="pricePerNight"
            type="number"
            min="0"
            step="1000"
            {...register("pricePerNight", {
              required: true,
              min: 0,
              valueAsNumber: true,
            })}
            className={errors.pricePerNight ? "border-red-500" : ""}
          />
          {errors.pricePerNight && (
            <p className="text-red-500 text-sm">
              {t("form.positiveNumber") || "Enter a positive number"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalFees">{t("form.additionalFees")}</Label>
          <Input
            id="additionalFees"
            type="number"
            min="0"
            step="1000"
            {...register("additionalFees", {
              required: true,
              min: 0,
              valueAsNumber: true,
            })}
            className={errors.additionalFees ? "border-red-500" : ""}
          />
          {errors.additionalFees && (
            <p className="text-red-500 text-sm">
              {t("form.positiveNumber") || "Enter a positive number or zero"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="childrenDetails">{t("form.childrenDetails")}</Label>
          <Input id="childrenDetails" {...register("childrenDetails")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalServices">
            {t("form.additionalServices")}
          </Label>
          <Input id="additionalServices" {...register("additionalServices")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialRequests">{t("form.specialRequests")}</Label>
        <Textarea
          id="specialRequests"
          {...register("specialRequests")}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{t("form.notes")}</Label>
        <Textarea id="notes" {...register("notes")} rows={3} />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-sky-600 hover:bg-sky-700"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              {t("form.updating") || "Updating..."}
            </>
          ) : (
            <>{t("form.updateQuote") || "Update Quote"}</>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/quotes/${quoteData.id}`)}
          disabled={isSubmitting}
        >
          {t("common.cancel") || "Cancel"}
        </Button>
      </div>
    </form>
  );
}
