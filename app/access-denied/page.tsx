"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ResortHeader } from "@/components/resort-header";
import { useTranslation } from "@/lib/translation-context";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AccessDeniedPage() {
  const { t } = useTranslation();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Display content after component is mounted
    setShowContent(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-sky-100">
      <ResortHeader />

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{
            opacity: showContent ? 1 : 0,
            y: showContent ? 0 : 50,
            scale: showContent ? 1 : 0.9,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-lg shadow-lg border border-red-100"
        >
          <motion.div
            className="text-red-500 text-6xl mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="mx-auto h-16 w-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {t("access.deniedTitle") || "Access Denied"}
          </motion.h1>

          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {t("access.deniedMessage") ||
              "You don't have permission to access this page. Please contact your administrator if you believe this is an error."}
          </motion.p>

          <motion.div
            className="pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <Button
              asChild
              className="bg-sky-700 hover:bg-sky-800 text-white transition-all duration-300 hover:scale-105"
            >
              <Link href="/">{t("access.returnHome") || "Return to Home"}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
