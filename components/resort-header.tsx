"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslation } from "@/lib/translation-context";

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
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="https://asteriamuineresort.com/vi/"
                className="hover:text-sky-200 transition-colors"
                target="_blank"
              >
                Trang Chủ
              </Link>
              <Link
                href="https://asteriamuineresort.com/vi/phong-nghi/"
                className="hover:text-sky-200 transition-colors"
                target="_blank"
              >
                Phòng Nghỉ
              </Link>
              <Link
                href="https://asteriamuineresort.com/vi/tien-ich/"
                className="hover:text-sky-200 transition-colors"
                target="_blank"
              >
                Tiện Ích
              </Link>
              <Link
                href="https://asteriamuineresort.com/vi/lien-he/"
                className="hover:text-sky-200 transition-colors"
                target="_blank"
              >
                Liên Hệ
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
