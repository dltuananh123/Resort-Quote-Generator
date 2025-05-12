"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import {
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="down" swipeThreshold={10}>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        // Select icon based on toast variant
        let Icon = Info;
        if (variant === "destructive") Icon = XCircle;
        if (variant === "success") Icon = CheckCircle;
        if (variant === "warning") Icon = AlertTriangle;

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-2 items-start w-full">
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="grid gap-1 w-full">
                {title && (
                  <ToastTitle className="text-sm md:text-base">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-xs md:text-sm">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
