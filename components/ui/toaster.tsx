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
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

export function Toaster() {
  const { toasts } = useToast();
  const [isMobile, setIsMobile] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Check if the device is mobile based on screen width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener to update if window is resized
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show swipe hint when first toast appears on mobile
  useEffect(() => {
    if (isMobile && toasts.length > 0 && !showHint) {
      setShowHint(true);
      // Hide hint after 3 seconds
      const timer = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, toasts.length, showHint]);

  return (
    <ToastProvider
      // Use horizontal swipe on mobile, vertical on desktop
      swipeDirection={isMobile ? "right" : "down"}
      // Lower threshold for easier swiping on mobile
      swipeThreshold={isMobile ? 10 : 50}
    >
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

                {/* Swipe hint for mobile users */}
                {isMobile && showHint && (
                  <div className="flex items-center text-xs mt-1 opacity-70 animate-pulse">
                    <span>Swipe right to dismiss</span>
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </div>
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
