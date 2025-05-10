"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { translations, Language } from "./translations";
import {
  LanguageInfo,
  supportedLanguages,
  getInitialLanguage,
  getLanguageInfo,
} from "./translation-utils";

type TranslationContextType = {
  t: (key: string) => string;
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
  languages: LanguageInfo[];
  languageInfo: LanguageInfo;
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

type NestedObject = {
  [key: string]: string | NestedObject;
};

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with a function to prevent unnecessary re-renders
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() =>
    getInitialLanguage()
  );

  // Get current language information
  const languageInfo = getLanguageInfo(currentLanguage);

  useEffect(() => {
    // Make sure the language is saved in localStorage on initial load
    if (typeof window !== "undefined") {
      localStorage.setItem("language", currentLanguage);

      // Set HTML lang attribute for accessibility
      document.documentElement.lang = currentLanguage;

      // Set text direction (for future RTL language support)
      document.documentElement.dir = languageInfo.direction;
    }
  }, [currentLanguage, languageInfo]);

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  // Translation function
  const t = (key: string): string => {
    try {
      const keys = key.split(".");
      let result: string | NestedObject = translations[
        currentLanguage
      ] as NestedObject;

      for (const k of keys) {
        if (result && typeof result === "object" && k in result) {
          result = result[k];
        } else {
          // Fallback to English if key not found
          let fallback: string | NestedObject = translations.en as NestedObject;
          for (const fk of keys) {
            if (fallback && typeof fallback === "object" && fk in fallback) {
              fallback = fallback[fk];
            } else {
              return key; // If not found in fallback, return the key itself
            }
          }
          return typeof fallback === "string" ? fallback : key;
        }
      }

      return typeof result === "string" ? result : key;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  return (
    <TranslationContext.Provider
      value={{
        t,
        currentLanguage,
        changeLanguage,
        languages: supportedLanguages,
        languageInfo,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
