"use client";

import { QuoteForm } from "@/components/quote-form";
import { QuoteDisplay } from "@/components/quote-display";
import { ResortHeader } from "@/components/resort-header";
import { ResortFooter } from "@/components/resort-footer";
import { useTranslation } from "@/lib/translation-context";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <ResortHeader />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        <div className="max-w-5xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-sky-900 mb-8">
            {t("quote.title")}
          </h1>
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-sky-800 mb-4">
                {t("form.submit")}
              </h2>
              <QuoteForm />
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-sky-800 mb-4">
                {t("quote.guestInfo")}
              </h2>
              <QuoteDisplay />
            </div>
          </div>
        </div>
      </main>
      <ResortFooter />
    </div>
  );
}
