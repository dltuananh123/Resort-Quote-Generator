"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "@/lib/translation-context";

export function ResortFooter() {
  const { t, currentLanguage } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${t("footer.subscriptionThanks")}: ${email}`);
    setEmail("");
  };

  // Get the connector text based on language
  const getConnector = () => {
    switch (currentLanguage) {
      case "vi":
        return "và";
      case "cn":
        return "和";
      case "ru":
        return "и";
      case "kr":
        return "및";
      default:
        return "and";
    }
  };

  // Get the appropriate address based on the current language
  const getLocalizedAddress = () => {
    switch (currentLanguage) {
      case "en":
        return "08 Xuan Thuy Street, Ward 5, Mui Ne Ward, Phan Thiet City, Binh Thuan Province, Vietnam";
      case "ru":
        return "08 ул. Суан Туи, Район 5, район Муй Не, город Фантьет, провинция Бинь Туан, Вьетнам";
      case "kr":
        return "베트남 빈투언성 판티엣시 무이네구 5지구 쑤안투이 거리 08번지";
      case "cn":
        return "越南平顺省潘切市美奈坊第5坊春水街08号";
      case "vi":
        return "08 đường Xuân Thủy, phường 5, phường Mũi Né, thành phố Phan Thiết, tỉnh Bình Thuận, Việt Nam";
      default:
        return "08 Xuan Thuy Street, Ward 5, Mui Ne Ward, Phan Thiet City, Binh Thuan Province, Vietnam";
    }
  };

  return (
    <footer className="bg-sky-900 text-white">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Address and Contact Information */}
          <div className="px-8">
            <h3 className="text-lg font-medium uppercase mb-4">
              {t("footer.address")}
            </h3>
            <p className="text-white mb-8">{getLocalizedAddress()}</p>

            <h3 className="text-lg font-medium uppercase mb-4">
              {t("footer.contactInfo")}
            </h3>
            <a
              href="tel:+842523822222"
              className="text-[#c5965a] hover:underline block mb-2"
            >
              +84 252 382 2222
            </a>
            <a
              href="mailto:info@asteriamuineresort.com"
              className="text-white hover:underline block mb-8"
            >
              info@asteriamuineresort.com
            </a>

            <div>
              <h3 className="text-lg font-medium uppercase mb-4">
                {t("footer.subscribeToOffers")}
              </h3>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  placeholder={t("footer.enterEmail")}
                  className="bg-transparent border border-gray-500 text-white p-2 w-full focus:outline-none focus:border-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-[#90775f] text-white px-4 py-2 uppercase hover:bg-[#c5965a] transition"
                >
                  {t("footer.subscribe")}
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Logo and Social Media */}
          <div className="flex flex-col items-center justify-start px-8">
            <div className="mb-8 mt-4">
              <Image
                src="/logo-white.svg"
                alt={t("footer.resort")}
                width={180}
                height={120}
                className="mx-auto"
              />
            </div>

            <h3 className="text-lg font-medium uppercase text-center mb-6">
              {t("footer.followUs")}
            </h3>
            <div className="flex justify-center items-center space-x-8">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition text-white flex items-center justify-center"
                aria-label="X (Twitter)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 3: Map */}
          <div className="px-8">
            <h3 className="text-lg font-medium uppercase mb-4">
              {t("footer.resortLocation")}
            </h3>
            <div className="h-64 w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3906.3455765507595!2d108.28973!3d11.721775000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31768df3eb3c3d89%3A0x24b5350f13b0afb2!2sAsteria%20Mui%20Ne%20Resort!5e0!3m2!1sen!2s!4v1718687850656!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-sky-950 py-4 text-center text-gray-300 text-sm border-t border-sky-800">
        <p>
          {currentLanguage === "en" && "Made by "}
          {currentLanguage === "vi" && "Được phát triển bởi "}
          {currentLanguage === "cn" && "由 "}
          {currentLanguage === "ru" && "Разработано "}
          {currentLanguage === "kr" && "제작자: "}
          <a
            href="https://github.com/dltuananh123"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c5965a] hover:underline"
          >
            dltuananh123
          </a>{" "}
          {getConnector()}{" "}
          <a
            href="https://github.com/bechovang"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c5965a] hover:underline"
          >
            bechovang
          </a>
          {currentLanguage === "cn" && " 开发"}
        </p>
      </div>
    </footer>
  );
}
