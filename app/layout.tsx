import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TranslationProvider } from "@/lib/translation-context";
import { Providers } from "./providers";

export const metadata = {
  title: "Asteria Mũi Né Resort - Báo Giá Đặt Phòng",
  description: "Hệ thống tạo báo giá đặt phòng cho Asteria Mũi Né Resort",
  generator: "v0.dev",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon-256x256.png", type: "image/png", sizes: "256x256" },
    ],
    apple: [{ url: "/favicon-192x192.png", sizes: "192x192" }],
    shortcut: [{ url: "/favicon-256x256.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        <Providers>
          <TranslationProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <main>{children}</main>
              <Toaster />
            </ThemeProvider>
          </TranslationProvider>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
