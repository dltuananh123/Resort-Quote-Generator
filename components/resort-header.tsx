"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslation } from "@/lib/translation-context";
import { Home, BedDouble, CirclePlus, Mail } from "lucide-react";

export function ResortHeader() {
  const { t } = useTranslation();

  return (
    <header className="bg-sky-900 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-12 h-12 md:w-16 md:h-16 bg-white rounded overflow-hidden">
              <Image
                src="/logo.svg"
                alt="Asteria Mũi Né Resort Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Asteria</h1>
              <p className="text-xs md:text-sm text-sky-200">Mũi Né Resort</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-12">
              <Link
                href="https://asteriamuineresort.com/vi/"
                className="group relative hover:text-sky-200 transition-colors"
                target="_blank"
              >
                <div className="transform group-hover:-translate-y-2 transition-transform">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-6 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Trang Chủ
                </span>
              </Link>
              <Link
                href="https://asteriamuineresort.com/vi/phong-nghi/"
                className="group relative hover:text-sky-200 transition-colors"
                target="_blank"
              >
                <div className="transform group-hover:-translate-y-2 transition-transform">
                  <BedDouble className="w-6 h-6" />
                </div>
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-6 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Phòng Nghỉ
                </span>
              </Link>
              <Link
                href="https://asteriamuineresort.com/vi/tien-ich/"
                className="group relative hover:text-sky-200 transition-colors"
                target="_blank"
              >
                <div className="transform group-hover:-translate-y-2 transition-transform">
                  <CirclePlus className="w-6 h-6" />
                </div>
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-6 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Tiện Ích
                </span>
              </Link>
              <Link
                href="https://asteriamuineresort.com/vi/lien-he/"
                className="group relative hover:text-sky-200 transition-colors"
                target="_blank"
              >
                <div className="transform group-hover:-translate-y-2 transition-transform">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-6 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Liên Hệ
                </span>
              </Link>
            </nav>
            <div className="ml-2 flex items-center justify-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
