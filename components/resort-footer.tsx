"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/translation-context";

export function ResortFooter() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sky-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">{t("footer.resort")}</h3>
            <p className="text-sky-200 mb-4">{t("footer.description")}</p>
            <div className="flex items-center gap-2 text-sky-200 mb-2">
              <MapPin size={16} />
              <span>Mũi Né, Phan Thiết, Bình Thuận</span>
            </div>
            <div className="flex items-center gap-2 text-sky-200 mb-2">
              <Phone size={16} />
              <span>+84 123 456 789</span>
            </div>
            <div className="flex items-center gap-2 text-sky-200">
              <Mail size={16} />
              <span>info@asteriamuineresort.com</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">
              {t("footer.amenities")}
            </h3>
            <ul className="space-y-2 text-sky-200">
              <li>{t("footer.largePool")}</li>
              <li>{t("footer.arena")}</li>
              <li>{t("footer.restaurant")}</li>
              <li>{t("footer.snackBar")}</li>
              <li>{t("footer.spa")}</li>
              <li>{t("footer.fitnessCenter")}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sky-200 hover:text-white transition-colors"
                >
                  {t("footer.booking")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sky-200 hover:text-white transition-colors"
                >
                  {t("footer.promotions")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sky-200 hover:text-white transition-colors"
                >
                  {t("footer.roomsAndRates")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sky-200 hover:text-white transition-colors"
                >
                  {t("footer.spaServices")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sky-200 hover:text-white transition-colors"
                >
                  {t("footer.restaurants")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sky-200 hover:text-white transition-colors"
                >
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sky-800 mt-8 pt-6 text-center text-sky-300 text-sm">
          <p>
            {t("footer.copyright").replace("{year}", currentYear.toString())}{" "}
            <a
              href="https://github.com/dltuananh123"
              className="underline hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              dltuananh123
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/bechovang"
              className="underline hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              bechovang
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
