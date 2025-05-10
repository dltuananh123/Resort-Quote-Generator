"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslation } from "@/lib/translation-context";
import { Home, BedDouble, CirclePlus, Mail, Menu, X } from "lucide-react";
import { AuthButton } from "./auth-button";

export function ResortHeader() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
          <div className="flex items-center">
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center">
              <Link
                href="https://asteriamuineresort.com/vi/"
                className="group relative hover:text-sky-200 transition-colors px-6"
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
                  {t("nav.home")}
                </span>
              </Link>
              <Link
                href="https://asteriamuineresort.com/vi/phong-nghi/"
                className="group relative hover:text-sky-200 transition-colors px-6"
                target="_blank"
              >
                <div className="transform group-hover:-translate-y-2 transition-transform">
                  <BedDouble className="w-6 h-6" />
                </div>
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-6 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("nav.rooms")}
                </span>
              </Link>
              <Link
                href="https://asteriamuineresort.com/vi/tien-ich/"
                className="group relative hover:text-sky-200 transition-colors px-6"
                target="_blank"
              >
                <div className="transform group-hover:-translate-y-2 transition-transform">
                  <CirclePlus className="w-6 h-6" />
                </div>
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-6 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("nav.amenities")}
                </span>
              </Link>
              <Link
                href="https://asteriamuineresort.com/vi/lien-he/"
                className="group relative hover:text-sky-200 transition-colors px-6"
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
                  {t("nav.contact")}
                </span>
              </Link>
              <div className="px-6 flex items-center space-x-4">
                <LanguageSwitcher />
                <AuthButton />
              </div>
            </nav>

            {/* Language switcher & mobile menu button */}
            <div className="flex items-center md:hidden">
              <div className="mr-2">
                <LanguageSwitcher />
              </div>
              <div className="mr-2">
                <AuthButton />
              </div>
              <button
                className="p-1 rounded-full hover:bg-sky-800 transition-colors"
                onClick={toggleMobileMenu}
                aria-label={t("nav.toggleMenu")}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile navigation with slide-down animation */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? "max-h-[400px] opacity-100 border-t border-sky-800 mt-4 pt-4"
              : "max-h-0 opacity-0 border-t-0 mt-0 pt-0"
          }`}
          style={{
            transformOrigin: "top",
            transitionProperty:
              "max-height, opacity, margin, padding, border-width",
          }}
        >
          <nav className="flex flex-col space-y-4">
            <Link
              href="https://asteriamuineresort.com/vi/"
              className="flex items-center gap-3 py-2 px-3 hover:bg-sky-800 rounded-md transition-colors"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                className="w-5 h-5"
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
              <span>{t("nav.home")}</span>
            </Link>
            <Link
              href="https://asteriamuineresort.com/vi/phong-nghi/"
              className="flex items-center gap-3 py-2 px-3 hover:bg-sky-800 rounded-md transition-colors"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BedDouble className="w-5 h-5" />
              <span>{t("nav.rooms")}</span>
            </Link>
            <Link
              href="https://asteriamuineresort.com/vi/tien-ich/"
              className="flex items-center gap-3 py-2 px-3 hover:bg-sky-800 rounded-md transition-colors"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
            >
              <CirclePlus className="w-5 h-5" />
              <span>{t("nav.amenities")}</span>
            </Link>
            <Link
              href="https://asteriamuineresort.com/vi/lien-he/"
              className="flex items-center gap-3 py-2 px-3 hover:bg-sky-800 rounded-md transition-colors"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Mail className="w-5 h-5" />
              <span>{t("nav.contact")}</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
