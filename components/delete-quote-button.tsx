"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteQuote } from "@/lib/supabase";
import { useTranslation } from "@/lib/translation-context";
import { useToast } from "@/components/ui/use-toast";

interface DeleteQuoteButtonProps {
  quoteId: string;
}

export function DeleteQuoteButton({ quoteId }: DeleteQuoteButtonProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteQuote(quoteId);

      toast({
        title: t("quote.deleteSuccess") || "Quote Deleted",
        description:
          t("quote.deleteSuccessDetail") ||
          "The quote has been deleted successfully",
        variant: "default",
      });

      router.push("/quotes");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete quote:", error);

      toast({
        title: t("quote.deleteError") || "Error Deleting Quote",
        description:
          t("quote.deleteErrorDetail") ||
          "There was an error deleting the quote. Please try again.",
        variant: "destructive",
      });

      setIsOpen(false);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setIsOpen(true)}
        disabled={isDeleting}
      >
        {isDeleting ? (
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
            {t("quote.deleting") || "Deleting..."}
          </>
        ) : (
          <>{t("quote.delete") || "Delete"}</>
        )}
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("quote.confirmDelete") ||
                "Are you sure you want to delete this quote?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("quote.confirmDeleteDesc") ||
                "This action cannot be undone. The quote will be permanently deleted from the database."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("common.cancel") || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>{t("quote.deleting") || "Deleting..."}</>
              ) : (
                <>{t("quote.confirmDeleteAction") || "Yes, delete quote"}</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
